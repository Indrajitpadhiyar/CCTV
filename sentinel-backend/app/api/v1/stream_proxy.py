from typing import Optional
import httpx
from fastapi import APIRouter, Response, HTTPException, status, Query
from app.core.config import settings
from app.core.logging import logger

router = APIRouter(prefix="/stream-proxy", tags=["Stream Proxy"])


@router.get("/{camera_code}/{file_name:path}")
async def proxy_hls_stream(
    camera_code: str,
    file_name: str,
    user: Optional[str] = Query(None),
    password: Optional[str] = Query(None)
):
    """
    Proxy HLS stream manifests (.m3u8) and video segments (.ts) from cctv.corp8.cloud
    with Basic Auth credentials and Access-Control-Allow-Origin headers.
    """
    target_url = f"{settings.CCTV_HLS_BASE_URL}/{camera_code}/{file_name}"
    
    # Use provided user/password or fallback to settings
    stream_user = user or settings.CCTV_STREAM_USER
    stream_pass = password or settings.CCTV_STREAM_PASSWORD
    auth = (stream_user, stream_pass) if (stream_user and stream_pass) else None

    async with httpx.AsyncClient(timeout=10.0, follow_redirects=True, auth=auth) as client:
        try:
            res = await client.get(target_url)
            if res.status_code == 401:
                logger.warning(f"[{camera_code}] 401 Unauthorized when fetching {target_url}. CDN requires valid credentials.")
                return Response(
                    content=b'{"error": "Unauthorized", "message": "cctv.corp8.cloud requires valid credentials"}',
                    status_code=401,
                    media_type="application/json",
                    headers={"Access-Control-Allow-Origin": "*"}
                )
            if res.status_code == 404:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Stream file {file_name} not found")
            
            content_type = res.headers.get("content-type", "application/vnd.apple.mpegurl" if file_name.endswith(".m3u8") else "video/MP2T")
            
            return Response(
                content=res.content,
                status_code=res.status_code,
                media_type=content_type,
                headers={
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET, OPTIONS",
                    "Cache-Control": "no-cache",
                }
            )
        except Exception as e:
            logger.warning(f"Stream proxy connection error for {camera_code}/{file_name}: {e}")
            return Response(
                content=b'{"status": "offline", "message": "Stream feed proxying fallback"}',
                status_code=502,
                media_type="application/json",
                headers={
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET, OPTIONS",
                }
            )

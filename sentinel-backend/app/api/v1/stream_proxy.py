import httpx
from fastapi import APIRouter, Response, HTTPException, status
from app.core.config import settings
from app.core.logging import logger

router = APIRouter(prefix="/stream-proxy", tags=["Stream Proxy"])


@router.get("/{camera_code}/{file_name:path}")
async def proxy_hls_stream(camera_code: str, file_name: str):
    """
    Proxy HLS stream manifests (.m3u8) and video segments (.ts) from cctv.corp8.cloud
    adding Access-Control-Allow-Origin headers to resolve browser CORS restrictions.
    """
    target_url = f"{settings.CCTV_HLS_BASE_URL}/{camera_code}/{file_name}"
    
    async with httpx.AsyncClient(timeout=10.0, follow_redirects=True) as client:
        try:
            res = await client.get(target_url)
            if res.status_code == 404:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Stream file {file_name} not found")
            
            content_type = res.headers.get("content-type", "application/vnd.apple.mpegurl" if file_name.endswith(".m3u8") else "video/MP2T")
            
            return Response(
                content=res.content,
                media_type=content_type,
                headers={
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET, OPTIONS",
                    "Cache-Control": "no-cache",
                }
            )
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error proxying stream for {camera_code}/{file_name}: {e}")
            raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=f"Stream proxy error: {str(e)}")

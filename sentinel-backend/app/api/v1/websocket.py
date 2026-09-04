import json
import asyncio
from typing import List, Set
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.events.subscriber import EventSubscriber
from app.core.logging import logger

router = APIRouter(tags=["WebSockets"])


class ConnectionManager:
    """Manages active client WebSocket connections and broadcasts events."""

    def __init__(self):
        self.active_connections: Set[WebSocket] = set()

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.add(websocket)
        logger.info(f"WebSocket client connected. Total connections: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)
        logger.info(f"WebSocket client disconnected. Total connections: {len(self.active_connections)}")

    async def broadcast(self, message: dict):
        if not self.active_connections:
            return
        payload = json.dumps(message)
        disconnected = set()
        for connection in self.active_connections:
            try:
                await connection.send_text(payload)
            except Exception as e:
                logger.warning(f"Error sending message to WebSocket client: {e}")
                disconnected.add(connection)
        for conn in disconnected:
            self.disconnect(conn)


manager = ConnectionManager()
subscriber = EventSubscriber()
_listener_task = None


async def start_redis_ws_listener():
    """Background task to bridge Redis Pub/Sub events to WebSocket manager."""
    global _listener_task
    if _listener_task is None or _listener_task.done():
        _listener_task = asyncio.create_task(subscriber.start_listening(manager.broadcast))


@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    # Ensure Redis listener background task is running
    await start_redis_ws_listener()
    
    try:
        while True:
            # Keep connection alive and receive optional ping/client commands
            data = await websocket.receive_text()
            if data == "ping":
                await websocket.send_text(json.dumps({"event": "pong"}))
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        manager.disconnect(websocket)

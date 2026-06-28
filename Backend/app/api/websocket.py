from fastapi import APIRouter, WebSocket, Query
from app.services.websocket_service import handle_stream

router = APIRouter()

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket, token: str = Query(None)):
    print(f"🔌 Connection attempt with token: {token}")
    
    # Validate the license token.
    # We check if it starts with the signature "voxa_" (e.g. voxa_usr_9823ac).
    # You can easily extend this to check against a Redis/SQL database!
    if not token or not token.startswith("voxa_"):
        print("❌ Invalid or missing license token. Rejecting connection.")
        await websocket.close(code=4001, reason="Invalid License Key")
        return

    await handle_stream(websocket)
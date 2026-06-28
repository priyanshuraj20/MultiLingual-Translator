from fastapi import APIRouter, WebSocket, Query
from app.services.websocket_service import handle_stream

router = APIRouter()

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket, token: str = Query(None)):
    print(f"🔌 Connection attempt with token: {token}")
    
    # Validate the license token.
    # We check if it starts with the signature "voxa_" (e.g. voxa_usr_9823ac).
    #
    # TODO: Later on when you implement user auth and a database:
    # 1. Connect to your database engine (PostgreSQL, MongoDB, Redis, etc.).
    # 2. Query the token: check if it exists in the active licenses table/collection.
    # 3. Verify user status (e.g. if their subscription is active and has usage limits remaining).
    # 4. Reject the connection if validation fails.
    #
    if not token or not token.startswith("voxa_"):
        print("❌ Invalid or missing license token. Rejecting connection.")
        await websocket.close(code=4001, reason="Invalid License Key")
        return

    await handle_stream(websocket)
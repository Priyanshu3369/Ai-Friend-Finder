from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.db import db
from app.models.message import ChatMessage
from datetime import datetime

chat_router = APIRouter()
chat_collection = db.get_collection("chats")

active_connections = {}  # {email: WebSocket}

@chat_router.websocket("/ws/{user_email}")
async def chat_endpoint(websocket: WebSocket, user_email: str):
    await websocket.accept()
    active_connections[user_email] = websocket

    try:
        while True:
            data = await websocket.receive_json()
            message = ChatMessage(**data)
            await chat_collection.insert_one({
                "sender": message.sender,
                "receiver": message.receiver,
                "encrypted_text": message.encrypted_text,
                "timestamp": datetime.utcnow()
            })

            # Forward the message to the receiver if they are online
            if message.receiver in active_connections:
                await active_connections[message.receiver].send_json({
                    "sender": message.sender,
                    "encrypted_text": message.encrypted_text
                })
    except WebSocketDisconnect:
        active_connections.pop(user_email, None)

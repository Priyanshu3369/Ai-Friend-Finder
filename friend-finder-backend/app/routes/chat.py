from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query
from fastapi.responses import JSONResponse
from app.db import db
from app.models.message import ChatMessage
from datetime import datetime

chat_router = APIRouter()
chat_collection = db.get_collection("chats")

active_connections = {}

@chat_router.websocket("/ws/{user_email}")
async def chat_endpoint(websocket: WebSocket, user_email: str):
    await websocket.accept()
    active_connections[user_email] = websocket

    try:
        while True:
            data = await websocket.receive_json()
            message = ChatMessage(**data)

            # Save encrypted message
            await chat_collection.insert_one({
                "sender": message.sender,
                "receiver": message.receiver,
                "encrypted_text": message.encrypted_text,
                "timestamp": datetime.utcnow()
            })

            # Forward message to receiver if online
            if message.receiver in active_connections:
                await active_connections[message.receiver].send_json({
                    "sender": message.sender,
                    "encrypted_text": message.encrypted_text
                })
    except WebSocketDisconnect:
        active_connections.pop(user_email, None)

@chat_router.get("/history")
async def get_chat_history(user1: str = Query(...), user2: str = Query(...)):
    messages = await chat_collection.find({
        "$or": [
            {"sender": user1, "receiver": user2},
            {"sender": user2, "receiver": user1}
        ]
    }).sort("timestamp", 1).to_list(length=None)

    return JSONResponse([
        {
            "sender": msg["sender"],
            "receiver": msg["receiver"],
            "encrypted_text": msg["encrypted_text"],
            "timestamp": msg["timestamp"].isoformat()
        } for msg in messages
    ])

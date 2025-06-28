from flask_socketio import emit, join_room
from extensions import mongo
from bson.objectid import ObjectId

def init_chat_events(socketio):

    @socketio.on('join')
    def handle_join(data):
        room = get_room_id(data['user1'], data['user2'])
        join_room(room)

    @socketio.on('send_message')
    def handle_send_message(data):
        room = get_room_id(data['sender_id'], data['receiver_id'])

        message = {
            "sender_id": data["sender_id"],
            "receiver_id": data["receiver_id"],
            "message": data["message"]
        }
        mongo.db.messages.insert_one(message)

        emit("receive_message", message, room=room)

def get_room_id(id1, id2):
    return "_".join(sorted([id1, id2]))

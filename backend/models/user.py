from extensions import mongo

def find_user_by_email(email):
    return mongo.db.users.find_one({"email": email})

def create_user(user_data):
    return mongo.db.users.insert_one(user_data)

def get_user_by_id(user_id):
    return mongo.db.users.find_one({"_id": user_id})

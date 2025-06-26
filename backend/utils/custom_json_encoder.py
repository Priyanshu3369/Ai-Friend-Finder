from flask.json.provider import DefaultJSONProvider
from bson import ObjectId

class CustomJSONProvider(DefaultJSONProvider):
    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        return super().default(obj)

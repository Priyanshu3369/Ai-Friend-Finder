from transformers import pipeline

emotion_pipeline = pipeline("text-classification", model="bhadresh-savani/distilbert-base-uncased-emotion")

def detect_emotion(text):
    result = emotion_pipeline(text)
    return sorted(result, key=lambda x: x['score'], reverse=True)[0]

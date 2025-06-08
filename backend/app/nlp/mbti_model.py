import random

mbti_traits = {
    "E/I": ["Extrovert", "Introvert"],
    "S/N": ["Sensing", "Intuitive"],
    "T/F": ["Thinking", "Feeling"],
    "J/P": ["Judging", "Perceiving"],
}

def analyze_mbti(text):
    personality = {k: random.choice(v) for k, v in mbti_traits.items()}
    summary = "You are " + ", ".join(personality.values())
    return {"traits": personality, "summary": summary}

def extract_personality(text: str) -> dict:
    return {
        "MBTI": "INTP",
        "BigFive": {
            "openness": 0.9,
            "conscientiousness": 0.7,
            "extraversion": 0.3,
            "agreeableness": 0.8,
            "neuroticism": 0.4
        }
    }

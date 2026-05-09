from typing import Dict, List


INTENT_KEYWORDS: Dict[str, List[str]] = {
    "HVAC": ["ac", "cooling", "air condition", "temperature", "refrigerant", "ventilation"],
    "Plumbing": ["plumb", "leak", "pipe", "water", "bathroom", "drain", "clogged", "tank"],
    "Electrical": ["electric", "wire", "power", "short circuit", "fuse", "current", "generator"],
    "Pest": ["pest", "cockroach", "rat", "termite", "insects", "rodents", "ants"],
    "Industrial": ["machine", "industrial", "conveyor", "motor", "gear", "equipment", "factory", "boiler"],
}


def classify_intent(transcript: str) -> str:
    text = (transcript or "").lower()
    scores: dict[str, int] = {}
    for intent, keywords in INTENT_KEYWORDS.items():
        score = sum(1 for keyword in keywords if keyword in text)
        scores[intent] = score

    best_intent = max(scores, key=scores.get)
    return best_intent if scores[best_intent] > 0 else "General"

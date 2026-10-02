from typing import List, Dict

MEDICAL_KNOWLEDGE_BASE = [
    {
        "id": "kb-001",
        "title": "AHA 2023 Hypertension Clinical Practice Guidelines",
        "topic": "Hypertension",
        "content": "Blood pressure ranges: Normal (<120/80 mmHg), Elevated (120-129/<80), Stage 1 Hypertension (130-139/80-89), Stage 2 Hypertension (>=140/90). First-line therapies include ACE inhibitors, ARBs, CCBs, and thiazide diuretics alongside sodium reduction (<2300 mg/day)."
    },
    {
        "id": "kb-002",
        "title": "ADA 2024 Standards of Medical Care in Diabetes",
        "topic": "Diabetes",
        "content": "Diagnostic thresholds: Normal fasting glucose <100 mg/dL, Prediabetes 100-125 mg/dL, Diabetes >=126 mg/dL. Normal HbA1c is <5.7%, Prediabetes 5.7-6.4%, Diabetes >=6.5%. First-line lifestyle changes combined with Metformin are standard for type 2 diabetes management."
    },
    {
        "id": "kb-003",
        "title": "ACC/AHA Cholesterol Management Guidelines",
        "topic": "Lipids & Cholesterol",
        "content": "Optimal LDL cholesterol is <100 mg/dL. Desirable total cholesterol is <200 mg/dL. HDL cholesterol >40 mg/dL in men and >50 mg/dL in women is cardioprotective. Elevated LDL is a major modifiable risk factor for atherosclerotic cardiovascular disease."
    },
    {
        "id": "kb-004",
        "title": "Preventive Cardiology & Lifestyle Care",
        "topic": "Preventive Medicine",
        "content": "Adults should aim for at least 150 minutes of moderate-intensity aerobic physical activity or 75 minutes of vigorous activity per week, plus muscle-strengthening activities on 2 or more days per week. A Mediterranean or DASH diet pattern improves cardiovascular longevity."
    }
]

class MedicalRAGRetriever:
    @staticmethod
    def retrieve_context(query: str, top_k: int = 2) -> List[Dict]:
        """Simple TF-IDF keyword overlap retrieval over medical knowledge base."""
        query_words = set(query.lower().split())
        scored_docs = []

        for doc in MEDICAL_KNOWLEDGE_BASE:
            doc_words = set(doc["content"].lower().split()) | set(doc["title"].lower().split())
            overlap = len(query_words & doc_words)
            if overlap > 0:
                scored_docs.append((overlap, doc))

        scored_docs.sort(key=lambda x: x[0], reverse=True)
        results = [doc for _, doc in scored_docs[:top_k]]

        # If no direct word match, return top general guideline
        if not results:
            results = [MEDICAL_KNOWLEDGE_BASE[0], MEDICAL_KNOWLEDGE_BASE[1]]

        return results

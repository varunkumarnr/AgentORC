from utils import get_gemini_response, get_pschat_response
from langchain.prompts import PromptTemplate

class RelatedQuestionsService: 
    @staticmethod
    def generate_related_questions(requirement):
        prompt_template = PromptTemplate(
            input_variables=["requirement"],
            template="""
            You are provided with the following requirement: "{requirement}".

            Your first task is to fully understand this requirement. Based on your understanding, generate exactly 4 specific and insightful questions that will help gather more detailed information, clarify any ambiguities, and explore all relevant aspects of this requirement.

            The questions should help to:
            1. Ensure a comprehensive understanding of the requirement (e.g., "What is the primary goal or purpose of this requirement?")
            2. Clarify any potential ambiguities or details that are not explicitly mentioned (e.g., "Are there any specific features or outcomes that are particularly important?")
            3. Explore any technical, design, or strategic considerations related to the requirement (e.g., "What are the constraints or special conditions that should be considered?")
            4. Identify any inspirations, references, or examples that could guide the work (e.g., "Are there existing solutions or examples that you would like to emulate or avoid?")

            Please format the questions clearly, with each question on a new line:

            1. [First question]
            2. [Second question]
            3. [Third question]
            4. [Fourth question]
            """
        )

        formatted_prompt = prompt_template.format(requirement=requirement)
        questions_string = get_pschat_response(formatted_prompt)
        
        # Process the output to ensure correct formatting and relevance
        questions = []
        for idx, line in enumerate(questions_string.splitlines()):
            if line.startswith(str(idx + 1) + ". "):
                question_text = line.split(". ", 1)[-1].strip()
                questions.append({
                    "id": idx + 1,
                    "question": question_text
                })

        return questions

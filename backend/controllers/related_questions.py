from flask import jsonify
from services import RelatedQuestionsService
from services.memory import MemoryService

class RelatedQuestionsController: 
    @staticmethod 
    def generate_questions(requirement, uuid):
        MemoryService.save_or_update_memory(id=uuid,requirement=requirement)
        questions = RelatedQuestionsService.generate_related_questions(requirement)
        response = {
            "uuid": uuid,
            "questions": questions
        }
        return jsonify(response)

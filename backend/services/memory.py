from flask import jsonify
from app import db
from models import Memory
from sqlalchemy.exc import IntegrityError

class MemoryService: 
    @staticmethod
    def save_or_update_memory(id, requirement=None, subtasks=None, previous_response=None, final_response=None):
        try:
            if not id or not isinstance(id, str):
                raise ValueError("ID must be a non-empty string.")
        
            existing_memory = Memory.query.get(id)
            if existing_memory:
                if requirement is not None:
                    existing_memory.requirement = requirement
                if subtasks is not None:
                    existing_memory.subtasks = subtasks
                if previous_response is not None:
                    existing_memory.previous_response = previous_response
                if final_response is not None:
                    existing_memory.final_response = final_response
                db.session.commit()
            else:
                new_memory = Memory(
                    id=id,
                    requirement=requirement or "",  
                    subtasks=subtasks or [],       
                    previous_response=previous_response or "",  
                    final_response=final_response or {} 
                )

                db.session.add(new_memory)
                db.session.commit()
                return {"message": "Memory saved successfully!", "id": new_memory.id}, 201

        except ValueError as ve:
            return {"error": str(ve)}, 400

        except IntegrityError as ie:
            db.session.rollback()
            return {"error": "An error occurred due to a unique constraint violation."}, 400

        except Exception as e:
            db.session.rollback()
            return {"error": "An error occurred while saving or updating the Memory.", "details": str(e)}, 500
    
    @staticmethod
    def get_previous_responses_by_id(id):
        try:
            if not id or not isinstance(id, str):
                raise ValueError("ID must be a non-empty string.")

            memory_entry = Memory.query.get(id)

            if not memory_entry:
                return {"error": f"Memory entry with ID {id} not found."}, 404

            return memory_entry.previous_response

        except Exception as e:
            return {"error": "An error occurred while retrieving previous responses.", "details": str(e)}, 500
        

    @staticmethod
    def get_memory_by_id(id):
        try:
            # Query the database to get the Memory entry by id
            memory = Memory.query.get(id)

            if memory is None:
                return {"error": "Memory entry not found."}, 404

            memory_details = {
                "id": memory.id,
                "requirement": memory.requirement,
                "subtasks": memory.subtasks,
                "previous_response": memory.previous_response,
                "final_response": memory.final_response
            }
            return jsonify(memory_details)

        except Exception as e:
            return {"error": "An error occurred while retrieving the Memory.", "details": str(e)}, 500

    

from flask import Blueprint, request
from controllers.controller import SimpleController
from controllers import RequirementController, AgentController, RelatedQuestionsController, MemoryController

main = Blueprint('main', __name__)

@main.route('/', methods=['GET'])
def status():
    "Endpoint to check if the server is running."
    return SimpleController.get_status()


@main.route('/related-questions', methods=['POST'])
def related_questions():
    data = request.get_json()
    requirement = data.get('requirement')
    uuid = data.get('uuid')
    return RelatedQuestionsController.generate_questions(requirement, uuid)

@main.route('/task',methods=['POST'])
def task_maker(): 
    data = request.get_json()
    uuid = data.get('uuid')
    requirement = data.get('requirement')
    input_data = data.get('input_data')
    return RequirementController.taskManager(uuid,requirement,input_data)


@main.route('/agent',methods=['GET'])
def agent(): 
    return RequirementController.agent()

@main.route('/add-agent', methods=['POST'])
def add_agent(): 
    return AgentController.add_agent(request.json)

@main.route('/list-agents', methods=['GET'])
def list_agents():
    return AgentController.list_agents()

@main.route('/delete-agent/<agent_id>', methods=['DELETE'])
def delete_agent(agent_id):
    return AgentController.delete_agent(agent_id)

@main.route('/get-agent/<agent_id>', methods=['GET'])
def get_agent(agent_id):
    return AgentController.get_agent_by_id(agent_id)

@main.route('/memory/<id>', methods=['GET'])
def get_memory(id):
    return MemoryController.get_memory_by_id(id=str(id))

@main.route('/execute', methods=['POST'])
def agent_execute():
    data = request.json
    uuid = data['uuid']
    task_data = data['data']
    responses = AgentController.agent_executes(uuid, task_data)
    return responses

@main.route('/agentexecute', methods=['POST'])
def agent_single_execute():
    data = request.json
    uuid = data['uuid']
    task_data = data['data']
    previous_response = data['previous_response']
    save_memory = data['save_memory']
    response = AgentController.agent_execute(uuid=uuid,data=task_data,previous_response=previous_response, save_memory=save_memory)
    return response
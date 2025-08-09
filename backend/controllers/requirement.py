from flask import jsonify
from services import TaskMaker
from services import AgentConfig
from services  import BaseAgent
from services.agents.agent_manager import AgentManager
from .agent import AgentController
from services.agents.agent_executer import AgentExecutor
from services.memory import MemoryService

class RequirementController: 
    @staticmethod 
    def taskManager(uuid, requirment, input_data):
        response = TaskMaker.task_maker(requirment ,input_data) 
        agents  = AgentManager.select_agents_for_pipeline(response, AgentManager.list_agents())
        res = MemoryService.save_or_update_memory(id=uuid,requirement=requirment,subtasks=agents)
        return agents
    
    @staticmethod 
    def agent():
        '''
        Below code just to unit test 
        '''

        agent_data = AgentController.get_agent_by_id("research_agent")
        print(agent_data)

        if isinstance(agent_data, tuple) and agent_data[1] == 404:
            print("Agent not found.")
            return jsonify({'message': 'Agent not found.'}), 404
        elif isinstance(agent_data, tuple) and agent_data[1] == 500:
            print(f"Error retrieving agent: {agent_data[0]}")
            return jsonify({'message': 'Error retrieving agent', 'error': agent_data[0]}), 500
        
        try:
         
            react_config = AgentConfig(
                id="react_agent",
                description = "Test",
                Role="Assistant",
                Goal="Help users with various tasks",
                Backstory="A helpful AI assistant",
                LLM="CustomModelName",
                Tools=[ "TavilySearchResults","JiraToolkit"],
                System_Template="System template here",
                Prompt_Template="Prompt template here",
                Response_Template="Response template here",
                save_memory = "",
                type = "",
                agent_type="Legecy-ReAct"
            )
            agent_instance = BaseAgent.create_agent(react_config)

            response = agent_instance.execute(uuid="6",agent_config=react_config,user_input="Add below all mentioned jira stories to project SCRUM?")
            print(response)
            return response

        except Exception as e:
            print(f"Error creating agent: {e}")
            return jsonify({'message': 'Error creating agent', 'error': str(e)}), 500

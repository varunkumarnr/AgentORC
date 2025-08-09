from services import AgentConfig
from services.agents.agent_manager import AgentManager 
from services.agents.agent_executer import AgentExecutor
from typing import Dict
from flask import jsonify
from services.memory import MemoryService

class AgentController: 
    @staticmethod
    def add_agent(config_data: Dict):
        try:
            if isinstance(config_data.get('Tools'), str):
                config_data['Tools'] = config_data['Tools'].split(',')

            config = AgentConfig(**config_data)
            return AgentManager.create_agent(config=config)
        except Exception as e:
            return jsonify({'message': 'Invalid configuration data', 'error': str(e)}), 400
        
    @staticmethod
    def list_agents():
        return AgentManager.list_agents()
    
    @staticmethod
    def delete_agent(agent_id):
        return AgentManager.delete_agent(agent_id)
    
    @staticmethod
    def get_agent_by_id(agent_id):
        return AgentManager.get_agent_by_id(agent_id)
    
    @staticmethod
    def agent_executes(uuid, data):
        MemoryService.save_or_update_memory(id=uuid, previous_response="")
        res = AgentExecutor.execute_agents(uuid, data)
        MemoryService.save_or_update_memory(id=uuid, subtasks=data, final_response=res)
        return res 
    
    @staticmethod
    def agent_execute(uuid,data, previous_response,save_memory):
        res = AgentExecutor.execute_agent(uuid,data,previous_response=previous_response, save_memory=save_memory)
        return res
    
    
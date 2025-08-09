from typing import Dict
from flask import jsonify
from app import db
from models import Agent
from .agent_config import AgentConfig
from langchain_core.prompts import PromptTemplate
from utils import get_gemini_response, get_gemini_response_flash

class AgentManager: 
    @staticmethod
    def create_agent(config: AgentConfig):
        existing_agent = Agent.query.get(config.id)
        if existing_agent:
            return jsonify({'message': 'Agent with this ID already exists.'}), 400
        new_agent = Agent(
            id=config.id,
            description = config.description,
            role=config.Role,
            goal=config.Goal,
            backstory=config.Backstory,
            llm=config.LLM,
            tools=config.Tools,
            system_template=config.System_Template,
            prompt_template=config.Prompt_Template,
            response_template=config.Response_Template,
            type=config.type,
            save_memory=config.save_memory,
            agent_type=config.agent_type
        )
        
        try:
            db.session.add(new_agent)
            db.session.commit()
            return jsonify({'message': 'Agent added successfully!'})
        except Exception as e:
            db.session.rollback()
            return jsonify({'message': 'Error adding agent', 'error': str(e)}), 500
        
    @staticmethod
    def list_agents():
        try:
            agents = Agent.query.all()
            agents_list = [
                {
                    'id': agent.id,
                    'description':agent.description,
                    'role': agent.role,
                    'goal': agent.goal,
                    'backstory': agent.backstory,
                    'llm': agent.llm,
                    'tools': agent.tools,
                    'system_template': agent.system_template,
                    'prompt_template': agent.prompt_template,
                    'response_template': agent.response_template,
                    'type': agent.type,
                    'save_memory': agent.save_memory,
                    'agent_type': agent.agent_type
                } for agent in agents
            ]
            return agents_list
        except Exception as e:
            return jsonify({'message': 'Error listing agents', 'error': str(e)}), 500
        
    @staticmethod
    def delete_agent(agent_id: str):
        try:
            agent = Agent.query.get(agent_id)
            if not agent:
                return jsonify({'message': 'Agent not found.'}), 404

            db.session.delete(agent)
            db.session.commit()
            return jsonify({'message': 'Agent deleted successfully!'})
        except Exception as e:
            db.session.rollback()
            return jsonify({'message': 'Error deleting agent', 'error': str(e)}), 500
        
    @staticmethod
    def get_agent_by_id(agent_id: str):
        try:
            agent = Agent.query.get(agent_id)
            if not agent:
                return jsonify({'message': 'Agent not found.'}), 404

            agent_data = {
                'id': agent.id,
                'description': agent.description,
                'role': agent.role,
                'goal': agent.goal,
                'backstory': agent.backstory,
                'llm': agent.llm,
                'tools': agent.tools,
                'system_template': agent.system_template,
                'prompt_template': agent.prompt_template,
                'response_template': agent.response_template,
                'type': agent.type,
                'save_memory': agent.save_memory,
                'agent_type': agent.agent_type
            }
            return agent_data
        except Exception as e:
            return jsonify({'message': 'Error getting agent', 'error': str(e)}), 500
    

    def select_agents_for_pipeline(tasks:list, all_agents:list):
        prompt_template = PromptTemplate(
                input_variables=["tasks", "agents"],
                template="""

                    
                    You are given a list of tasks and information about an agent. Based on the provided details, identify if this agent is suitable for the tasks.

                    Tasks:
                    {tasks}

                    {agents}

                    Analyze the information about the agent and determine if they are suitable for the tasks. 
                    
                    Very Important each agent should only be used once never use a agebt twice.  return NA if the agent is already. 

                    Return all the agent names that are sutable for the given task. In order of there execution.

                    Output as to be in  AgentNames seperated by ~ only There should not be any other response If there are no sutable agents just reurn NA. 

                    Number of agents should always be same as number of tasks
                """
            )
        tasks_str = "\n".join(tasks)
        agents_str = "\n".join([
                f"Agent Name: {agent.get('id', 'N/A')}, Agent Description: {agent.get('description', 'N/A')}"
                for agent in all_agents
            ])
        prompt = prompt_template.format(tasks=tasks_str, agents=agents_str)
        response = get_gemini_response_flash(prompt)
        agents = [agent.strip() for agent in response.split('~')]
        task_agent_mapping = [{"task": task, "agent": agent} for task, agent in zip(tasks, agents)]
        return task_agent_mapping

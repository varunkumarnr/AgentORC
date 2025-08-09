from .base_agent import BaseAgent
from .agent_manager import AgentManager
from .agent_config import AgentConfig
from services.memory import MemoryService

def run_agent(uuid, agentId, task): 
    agent_data  = AgentManager.get_agent_by_id(agentId)
    agent_config = AgentConfig(
                id=agent_data['id'],
                description=agent_data['description'],
                Role=agent_data['role'],
                Goal=agent_data['goal'],
                Backstory=agent_data['backstory'],
                LLM=agent_data['llm'],
                Tools=[tool.strip() for tool in agent_data['tools'].strip('{}').split(',') if tool.strip().isalnum()],
                System_Template=agent_data['system_template'],
                Prompt_Template=agent_data['prompt_template'],
                Response_Template=agent_data['response_template'],
                save_memory= agent_data['save_memory'],
                type= agent_data['type'],
                agent_type=agent_data['agent_type']
    )
    agent_instance = BaseAgent.create_agent(agent_config)
    res = agent_instance.execute(uuid,agent_config = agent_config, user_input = task)
    return res
    

class AgentExecutor:
    def execute_agents(uuid, all_agent_tasks:list):
        responses = []
        for agent_task in all_agent_tasks:
            agent_id = agent_task.get("agent", "NA")
            task = agent_task.get("task", "")
            if agent_id != "NA":
                agent_response = run_agent(uuid, agent_id, task)
                responses.append({
                    "task": task,
                    "agent": agent_id,
                    "response": agent_response
                })
            else:
                responses.append({
                    "task": task,
                    "agent": agent_id,
                    "response": "No suitable agent found."
                })
        return responses
    
    def execute_agent(uuid, agent_task, previous_response,save_memory): 
        agent_id = agent_task.get("agent", "NA")
        task = agent_task.get("task", "")
        if agent_id != "NA":
            agent_response = run_agent(uuid, agent_id, task)
            if(save_memory == "Y"):
                MemoryService.save_or_update_memory(id=uuid, previous_response=agent_response)
            response = {
                "task": task,
                "agent": agent_id,
                "response": agent_response
            }
        else:
            response= {
                "task": task,
                "agent": agent_id,
                "response": "No suitable agent found."
            }
        return response

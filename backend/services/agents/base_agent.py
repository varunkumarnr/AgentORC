from langchain.agents import create_react_agent
from  .agent_config import AgentConfig
from utils.gemini_request  import get_gemini, get_gemini_flash
from langchain.prompts import PromptTemplate 

class BaseAgent:
    def __init__(self, config: AgentConfig):
        self.config = config
        self.language_model = self.create_language_model()
        self.tools = self.config.Tools
        self.prompt =  PromptTemplate(
            input_variables=["user_input"],
            template="""
                is it working {user_input}""")



    def create_language_model(self):
        return get_gemini_flash()

    def execute(self,uuid, agent_config, user_input):
        raise NotImplementedError("This method should be overridden by subclasses")

    @classmethod
    def create_agent(cls, config: AgentConfig):
        if config.agent_type == "ReAct":
            from .reAct_agent import ReActAgent 
            return ReActAgent(config)
        elif config.agent_type == "Role-Based":
            from .role_agent import RoleBasedAgent  
            return RoleBasedAgent(config)
        elif config.agent_type == "Legecy-ReAct":
            from .legecy_reAct_agent import LegecyReActAgent
            return LegecyReActAgent(config)
        else:
            raise ValueError(f"Unknown agent type: {config.agent_type}")




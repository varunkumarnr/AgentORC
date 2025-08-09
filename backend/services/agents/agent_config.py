from pydantic import BaseModel

class AgentConfig(BaseModel):
    id: str
    description:str
    Role: str
    Goal: str
    Backstory: str
    LLM: str
    Tools: list
    System_Template: str
    Prompt_Template: str
    Response_Template: str
    type: str 
    save_memory: str
    agent_type: str
from .agent_config import AgentConfig
from .base_agent import BaseAgent
from utils import get_gemini_response,get_gemini_response_flash
from ..prompt_generator import PromptGenerator
from services.memory import MemoryService

class RoleBasedAgent(BaseAgent):
    def __init__(self, config: AgentConfig):
        super().__init__(config)

    def execute(self, uuid, agent_config, user_input):
        previous_response = MemoryService.get_previous_responses_by_id(uuid)
        prompt = PromptGenerator.generate_prompt(previous_response, agent_config, user_input)
        return get_gemini_response_flash(prompt)

from langchain.prompts import PromptTemplate
from services.agents.agent_config import AgentConfig

class PromptGenerator:
    @staticmethod
    def generate_prompt(previous_response: str, agent_config: AgentConfig , task : str) -> str:
        """
        Generate a complete prompt based on the agent's configuration.

        Parameters:
        - agent_config (AgentConfig): The configuration object for the agent.

        Returns:
        - str: The fully constructed prompt.
        """

        prompt_template = PromptTemplate(
            input_variables=[
                "tasks","id", "description", "Role", "Goal", "Backstory", "LLM",
                "Tools", "System_Template", "Prompt_Template", "Response_Template", "agent_type"
            ],
            template="""
            You are an AI agent with the following configuration:

            Below is your given task

            {tasks}

            Use Below as your memory if the memory exists perform tasks on the memory it is important if no memeory just do the task:
            ------ Start of memory -------------

            {previous_response}

            ----- End of memory --------------

            You are {Backstory} 

            and your goal is to {Goal}

            To achive this goal follow this: {System_Template} 

            {Prompt_Template}

            Have the response in the following format

            {Response_Template}
            """
        )
        prompt = prompt_template.format(
            tasks = task,
            previous_response=previous_response,
            id=agent_config.id,
            description=agent_config.description,
            Role=agent_config.Role,
            Goal=agent_config.Goal,
            Backstory=agent_config.Backstory,
            LLM=agent_config.LLM,
            Tools=', '.join(agent_config.Tools),
            System_Template=agent_config.System_Template,
            Prompt_Template=agent_config.Prompt_Template,
            Response_Template=agent_config.Response_Template,
            agent_type=agent_config.agent_type
        )
        return prompt

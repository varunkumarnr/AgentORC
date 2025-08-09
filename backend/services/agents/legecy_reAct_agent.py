from langchain.agents import create_react_agent
from .base_agent import BaseAgent
from .agent_config import AgentConfig
from langchain.agents import AgentType, initialize_agent
from langchain_core.prompts import PromptTemplate
from..tools import Tools 
from services.memory import MemoryService



class LegecyReActAgent(BaseAgent):
    def __init__(self, config: AgentConfig): 
        super().__init__(config) 
        self.agent_executor  = self.create_agent_executor()

    def create_agent_executor(self):
        llm = self.language_model

        tools = Tools.create_tools(self.config.Tools)

        system = self.config.System_Template

        template = '''Answer the following questions as best you can. You have access to the following tools:

                {tools}

                Use the following format:

                Question: the input question you must answer
                Thought: you should always think about what to do
                Action: the action to take, should be one of [{tool_names}]
                Action Input: the input to the action 
                Observation: the result of the action
                ... (this Thought/Action/Action Input/Observation can repeat N times)
                Thought: I now know the final answer
                Final Answer: the final answer to the original input question
                Important: Do not provide a "Final Answer" until all actions are completed. Always ensure that actions and their observations are clearly separated.

                Begin!

                Question: {input}
                Thought:{agent_scratchpad}'''
        
        prompt = PromptTemplate.from_template(template)

        agent = initialize_agent(
                tools, 
                llm, 
                agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION, 
                verbose=True,
                handle_parsing_errors="Check your output and make sure it conforms! Do not output an action and a final answer at the same time."
            )
        return agent

    def execute(self,uuid, agent_config,  user_input):
        previous_response = MemoryService.get_previous_responses_by_id(uuid)
        keywords = ["above", "below", "following"]
        if any(keyword in user_input.lower() for keyword in keywords):
            user_input = f"{previous_response} \n {user_input}"
        return self.agent_executor.run({"input": user_input })


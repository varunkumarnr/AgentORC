from langchain.agents import create_react_agent
from .base_agent import BaseAgent
from .agent_config import AgentConfig
from langchain.agents import AgentExecutor, create_react_agent
from langchain_core.prompts import PromptTemplate
from..tools import Tools 
from services.memory import MemoryService


class ReActAgent(BaseAgent):
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
                Begin!

                Question: {input}
                Thought:{agent_scratchpad}'''
        
        prompt = PromptTemplate.from_template(template)

        agent = create_react_agent(
            llm=llm,
            tools = tools,
            prompt=prompt
        )

        return AgentExecutor(agent=agent, tools = tools, verbose=True,
                             handle_parsing_errors=True)
    
    def execute(self,uuid, agent_config,  user_input):
        previous_response = MemoryService.get_previous_responses_by_id(uuid)
        keywords = ["above", "below", "following"]
        if any(keyword in user_input.lower() for keyword in keywords):
            user_input = f"{previous_response} \n {user_input}"
        return self.agent_executor.invoke({"input": user_input})


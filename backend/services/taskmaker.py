from utils import get_gemini_response,get_gemini_response_flash
from utils import get_pschat_response
from langchain.prompts import PromptTemplate
from services.agents import   AgentManager

class TaskMaker: 
    @staticmethod
    def task_maker(requirement, input_data):
        all_agents = AgentManager.list_agents()
        prompt_template = PromptTemplate(
            input_variables=["questions_answers", "requirement", "agents"],
            template="""
        I have a requirement This is the main consideration All this requirments should be taken care: {requirement}


        Here are some related questions and answers that provide more information:

        {questions_answers}

        Below is list of agents our app supports make tasks customed to this agents whereever possible, This is not mandatory but helpful

        {agents}

        Based on the requirement and the provided information, please generate a concise list of distinct, actionable tasks. Each task will serve as input for selecting agents to build a pipeline in the next step.

        **Important Guidelines:**

        1. **Single-Agent Focus**: Each task should correspond to a single agent, which is an AI tool designed to excel at a specific task. For example, a "Confluence Agent" is proficient in writing documentation, while a "Coding Agent" is adept at all coding-related tasks.

        2. **Consolidate Related Actions**: If multiple actions can be performed by a single agent, combine them into one task. For instance, if a task involves both designing and implementing a feature, treat it as a single task. Aim to minimize the total number of tasks while ensuring each task remains actionable and clear.

        3. **Avoid Overlap**: Ensure that there are no overlapping tasks. Each task should be unique and focused on a specific action.

        4. **Clarity and Specificity**: Each task should be clearly defined, using precise language to convey the action required. Avoid vague descriptions.

        5. **Format**: Provide the generated list of tasks in a numbered format, with each task starting with "Task:".
        
        Note from above example, See how all the tasks related to code are in a single task. It is very important to have everything in a single task, if they use the same tool in this case, Java or Python.
        Please provide the generated list of tasks.
        
        I want the output in the below format. 

        Task: subtasks.  
        ~ Task: subtasks. 
        ~ Task: subtasks.
        
        It is very important to have the output in above format as I will storing this tasks in array for further proccessing. I need ~ as sperator so only use it to sepearate each task.

        Below two are very important.
        Not how only main task as the seperator ~ and not the sub tasks. This is very important.

        Note from above example, See how all the tasks related to code are in a single task. It is very important to have everything in a single task, if they use the same tool in this case, Java or Python.
        Please provide the generated list of tasks. See how all coding tasks are under one tasks.

        Note only include code and unit testing as tasks if it explictly mentioned they need code.  Ideally our main concentation is on report genration and bettering SDLC cycle not coding. Alwa
        """
        )
        
        questions_answers = "\n".join(
            f"Question: {item['question']}\nAnswer: {item['answer']}" for item in input_data
        )
        agents_str = "\n".join([
                f"Agent Name: {agent.get('id', 'N/A')}, Agent Description: {agent.get('description', 'N/A')}"
                for agent in all_agents
            ])
        
        formatted_prompt = prompt_template.format(
            questions_answers=questions_answers, requirement=requirement, agents= agents_str
        )
        
        tasks_string = get_gemini_response(formatted_prompt)
        tasks = [task.strip() for task in tasks_string.split('~')]
        return tasks

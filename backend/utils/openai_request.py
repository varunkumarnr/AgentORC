import os
from langchain_openai import ChatOpenAI

os.environ["OPENAI_API_KEY"] = "YOUR-OPENAI-KEY"
model_name = "gpt-3.5-turbo"
llm = ChatOpenAI(model_name=model_name)

def get_openai_response(prompt):
    response = llm(prompt)
    return response

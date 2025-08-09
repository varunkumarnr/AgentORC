from langchain_google_genai import ChatGoogleGenerativeAI
# import os
# from dotenv import load_dotenv

# load_dotenv()
# token = os.environ["GOOGLE_API_KEY"]

llm = ChatGoogleGenerativeAI(
    model="gemini-1.5-pro",
    temperature=0,
    max_tokens=None,
    timeout=None,
    max_retries=4,
)

llm_flash = ChatGoogleGenerativeAI(
    model="gemini-1.0-pro",
    temperature=0,
    max_tokens=None,
    timeout=None,
    max_retries=4,
)

def get_gemini_response(prompt): 
    ai_msg = llm.invoke(prompt)
    return ai_msg.content

def get_gemini_response_flash(prompt): 
    ai_msg = llm_flash.invoke(prompt)
    return ai_msg.content


def get_gemini():
    return llm

def get_gemini_flash():
    return llm_flash






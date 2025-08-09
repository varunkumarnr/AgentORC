import requests
# import os 
# from dotenv import load_dotenv
import json
from config import Config

def get_headers(): 
    headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer" + " ";
    }
    return headers


def request_body(prompt):
    return {    
        "async": "false",
        "message": prompt,
        "options": {"model": "gpt4"},
        "assistant": "",
        "contexts": [],
        "parameters": {"temperature": 0, "max_tokens": 1000},
        "source": "pschat",
    }


def get_pschat_response(prompt): 
    response = requests.post(
        url = "https://api.psnext.info/api/chat/",
        json = request_body(prompt),
        headers=get_headers(),
    )
    # print(request_body(prompt=prompt))
    data = json.loads(response.text)
    # print(data['data']['messages'][2]['content'])
    return data['data']['messages'][2]['content']




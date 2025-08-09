from .custom_tools import CustomTools
class Tools: 
    @staticmethod
    def build_tool(tool_name: str):
        if tool_name.lower() == "multiply".lower():
            return CustomTools.multiply
        elif tool_name.lower() == "square".lower():
            return CustomTools.square
        elif tool_name.lower() == "TavilySearchResults".lower():
            from langchain_community.tools.tavily_search import TavilySearchResults
            return TavilySearchResults(max_results=1)
        elif tool_name.lower() == "DuckDuckGo".lower(): 
            from langchain_community.tools import DuckDuckGoSearchRun
            return DuckDuckGoSearchRun()
        elif tool_name.lower() == "JiraToolkit".lower():
            from langchain_community.agent_toolkits.jira.toolkit import JiraToolkit
            from langchain_community.utilities.jira import JiraAPIWrapper
            jira = JiraAPIWrapper()
            toolkit = JiraToolkit.from_jira_api_wrapper(jira)
            tools = toolkit.get_tools()
            return tools
        elif tool_name.lower() == "GmailToolkit".lower(): 
            from langchain_google_community.gmail.utils import (
                build_resource_service,
                get_gmail_credentials,
            )
            from langchain_google_community import GmailToolkit
            credentials = get_gmail_credentials(
                    token_file="token.json",
                    scopes=["https://mail.google.com/"],
                    client_secrets_file="credentials.json",
                )
            api_resource = build_resource_service(credentials=credentials)
            toolkit = GmailToolkit(api_resource=api_resource)
            tools = toolkit.get_tools()
            return tools
        else:
            raise ValueError(f"Unknown tool: {tool_name}")

    @staticmethod
    def create_tools(tool_names: list):
        tools = []
        for tool_name in tool_names:
            tool = Tools.build_tool(tool_name)
            if isinstance(tool, list):
                tools.extend(tool)  
            else:
                tools.append(tool) 
        return tools

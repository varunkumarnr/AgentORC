from langchain.tools import  tool
from pydantic import BaseModel


class CustomTools:
    @staticmethod
    @tool
    def multiply(a, b) -> int:
        """Multiply two numbers."""
        return int(a) * int(b)

    @staticmethod
    @tool
    def square(tool_input) -> int:
        """Calculates the square of a number."""
        return int(tool_input) * int(tool_input)

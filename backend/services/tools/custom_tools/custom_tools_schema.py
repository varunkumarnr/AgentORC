from pydantic import BaseModel

class MultiplySchema(BaseModel):
    num1: int
    num2: int
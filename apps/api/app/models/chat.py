from pydantic import BaseModel
from typing import List, Literal
from datetime import datetime


class Message(BaseModel):
    role: Literal["user", "assistant", "system"]
    content: str


class ChatRequest(BaseModel):
    model: str
    messages: List[Message]
    stream: bool = False


class ChatResponse(BaseModel):
    id: str
    message: Message
    model: str
    created_at: datetime = datetime.now()

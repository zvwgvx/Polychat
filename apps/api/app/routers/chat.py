from fastapi import APIRouter, HTTPException
from app.models.chat import ChatRequest, ChatResponse, Message
from app.services.ai_service import ai_service
from datetime import datetime
import uuid

router = APIRouter()


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Process chat request and return AI response.

    Args:
        request: ChatRequest containing model and messages

    Returns:
        ChatResponse with AI-generated message
    """
    try:
        # Validate request
        if not request.messages:
            raise HTTPException(status_code=400, detail="Messages cannot be empty")

        # Generate AI response
        ai_response_content = await ai_service.generate_response(
            model=request.model,
            messages=request.messages
        )

        # Create response message
        response_message = Message(
            role="assistant",
            content=ai_response_content
        )

        # Create chat response
        chat_response = ChatResponse(
            id=str(uuid.uuid4()),
            message=response_message,
            model=request.model,
            created_at=datetime.now()
        )

        return chat_response

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing chat request: {str(e)}"
        )


@router.get("/models")
async def list_models():
    """
    List available AI models.
    """
    return {
        "models": [
            {
                "id": "gpt-3.5-turbo",
                "name": "GPT-3.5 Turbo",
                "provider": "OpenAI",
                "description": "Fast and efficient model"
            },
            {
                "id": "gpt-4",
                "name": "GPT-4",
                "provider": "OpenAI",
                "description": "Most capable model"
            },
            {
                "id": "claude-3-sonnet",
                "name": "Claude 3 Sonnet",
                "provider": "Anthropic",
                "description": "Balanced performance"
            }
        ]
    }

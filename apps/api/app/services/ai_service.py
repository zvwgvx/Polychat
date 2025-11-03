import httpx
import json
import subprocess
from typing import List, Dict, Any
from app.models.chat import Message


class AIService:
    """
    Service for interacting with AI models.
    Currently using curl-based temporary solution for demonstration.
    """

    def __init__(self):
        self.openai_api_url = "https://api.openai.com/v1/chat/completions"
        self.anthropic_api_url = "https://api.anthropic.com/v1/messages"

    async def generate_response(
        self, model: str, messages: List[Message]
    ) -> str:
        """
        Generate AI response using the specified model.

        This is a temporary implementation using curl.
        In production, you would use proper API clients.
        """

        # For demonstration, return a mock response
        # You can uncomment the curl implementation below for real API calls

        return await self._mock_response(model, messages)

    async def _mock_response(self, model: str, messages: List[Message]) -> str:
        """
        Mock response for testing without actual API calls.
        """
        last_message = messages[-1].content if messages else ""

        responses = {
            "gpt-3.5-turbo": f"I'm GPT-3.5 Turbo. You said: '{last_message}'. This is a mock response for testing.",
            "gpt-4": f"I'm GPT-4. You said: '{last_message}'. This is a mock response for testing.",
            "claude-3-sonnet": f"I'm Claude 3 Sonnet. You said: '{last_message}'. This is a mock response for testing.",
        }

        return responses.get(
            model,
            f"I'm {model}. You said: '{last_message}'. This is a mock response for testing."
        )

    async def _call_openai_with_curl(
        self, model: str, messages: List[Message], api_key: str
    ) -> str:
        """
        Call OpenAI API using curl command.
        Uncomment and use this when you have a real API key.
        """
        # Format messages for OpenAI API
        formatted_messages = [
            {"role": msg.role, "content": msg.content}
            for msg in messages
        ]

        # Build curl command
        data = {
            "model": model,
            "messages": formatted_messages,
            "temperature": 0.7
        }

        curl_command = [
            "curl",
            "-X", "POST",
            self.openai_api_url,
            "-H", "Content-Type: application/json",
            "-H", f"Authorization: Bearer {api_key}",
            "-d", json.dumps(data)
        ]

        try:
            result = subprocess.run(
                curl_command,
                capture_output=True,
                text=True,
                timeout=30
            )

            if result.returncode == 0:
                response_data = json.loads(result.stdout)
                return response_data["choices"][0]["message"]["content"]
            else:
                raise Exception(f"Curl command failed: {result.stderr}")

        except Exception as e:
            raise Exception(f"Error calling OpenAI API: {str(e)}")

    async def _call_anthropic_with_curl(
        self, model: str, messages: List[Message], api_key: str
    ) -> str:
        """
        Call Anthropic API using curl command.
        Uncomment and use this when you have a real API key.
        """
        # Format messages for Anthropic API
        formatted_messages = [
            {"role": msg.role, "content": msg.content}
            for msg in messages
            if msg.role != "system"  # Anthropic handles system messages differently
        ]

        data = {
            "model": model,
            "messages": formatted_messages,
            "max_tokens": 1024
        }

        curl_command = [
            "curl",
            "-X", "POST",
            self.anthropic_api_url,
            "-H", "Content-Type: application/json",
            "-H", f"x-api-key: {api_key}",
            "-H", "anthropic-version: 2023-06-01",
            "-d", json.dumps(data)
        ]

        try:
            result = subprocess.run(
                curl_command,
                capture_output=True,
                text=True,
                timeout=30
            )

            if result.returncode == 0:
                response_data = json.loads(result.stdout)
                return response_data["content"][0]["text"]
            else:
                raise Exception(f"Curl command failed: {result.stderr}")

        except Exception as e:
            raise Exception(f"Error calling Anthropic API: {str(e)}")


# Singleton instance
ai_service = AIService()

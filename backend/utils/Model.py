"""Base model class for LLM operations. All LLM-based utilities inherit from this."""

from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv

MODEL_NAME = "gemini-2.5-flash"


class MyModel:
    """Base class providing a shared Gemini LLM instance for all derived classes."""

    def __init__(self, model_name: str = MODEL_NAME):
        load_dotenv()
        self.model = ChatGoogleGenerativeAI(model=model_name)

    def generate(self, structured_prompt: str) -> str:
        """Invoke the model with a prompt and return the text response."""
        try:
            response = self.model.invoke(structured_prompt)
            return response.content
        except Exception as e:
            return f"Error: {str(e)}"
        


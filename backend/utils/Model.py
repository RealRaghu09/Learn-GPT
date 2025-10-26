from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv

class MyModel :
    model = None
    def __init__(self):
        load_dotenv()
        self.model = ChatGoogleGenerativeAI(model="gemini-2.0-flash")
    
    def generate(self , structured_prompt:str ) -> str:
        try:
            response = self.model.invoke(structured_prompt)
            return response.content
        except Exception as e:
            return f"Error: {str(e)}"
        


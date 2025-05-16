from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser

class Chatbot:
    def __init__(self):
        load_dotenv()
        self.Model = ChatGoogleGenerativeAI(model="gemini-1.5-flash")
        self.template = PromptTemplate(
            template="Answer the following question: {question}",
            input_variables=['question']
        )
        self.parser = StrOutputParser()
    def generate_response(self, question: str) -> str:
        try:
            chain = self.template | self.Model | self.parser
            response = chain.invoke({"question": question})
            return response
        except Exception as e:
            return f"Error from Chatbot: {str(e)}"
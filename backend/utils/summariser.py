from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain.output_parsers import StructuredOutputParser 
from langchain_core.output_parsers import StrOutputParser
from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv
class Summariser:
    def __init__(self):
        load_dotenv()
        self.model = ChatGoogleGenerativeAI(model = 'gemini-2.0-flash')
        self.template = PromptTemplate(
            template='summarize the following text to {size} words :\n\n {text}',
            input_variables=['text', 'size']
        )

    def generate(self,text:str , size:str) ->str:
        try:
            chain = self.template | self.model | StrOutputParser()
            response = chain.invoke({'text': text, 'size': size})
            return str(response)
        except Exception as e:
            return f"Error from Summariser:  {str(e)}"
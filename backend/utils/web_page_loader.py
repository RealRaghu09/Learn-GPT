#For WebBaseLoader
from langchain_community.document_loaders import WebBaseLoader
from utils.Model import MyModel


class CustomWebBaseLoader:
    def get_response(self, url):
        try:
            Loader = WebBaseLoader(url)
            docs = Loader.load()
            print(type(docs))
            llm = MyModel()
            return llm.generate(structured_prompt=str(docs))
        except Exception as e:
            return f"Error from Loading URL to BE: {str(e)}"
        
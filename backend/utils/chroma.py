from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_core.documents import  Document
from dotenv import load_dotenv


class VectorEmbedding:
    def __init__(self):
        load_dotenv()
        self.embeddings = GoogleGenerativeAIEmbeddings(model="models/text-embedding-004")
    

    def insert_documents(self, documents:str):
        self.documentsList = list(documents)
        vectorStore = Chroma.from_documents(
            documents=self.documentsList,
            embedding=self.embeddings,
            collection_name="Hello_AI"
        )
        self.retrive = vectorStore.as_retriever(search_kwargs={"k": 1})
    def query_documents(self, query:str):
        try:
            response = self.retrive.invoke(query)
            return str(response.page_content)
        except Exception as e:
            return str(e)
# load_dotenv()


# embeddings = GoogleGenerativeAIEmbeddings(model="models/text-embedding-004")

# DocumentList = [
#     Document(page_content="hello world"),
#     Document(page_content="Hey Google"),
#     Document(page_content="hello Alexa"),
#     Document(page_content="Hello siri")
# ]


# vectorstore = Chroma.from_documents(
#     documents=DocumentList,
#     embedding=embeddings,
#     collection_name="Hello_AI"
# )


# retrive =vectorstore.as_retriever(search_kwargs={"k": 1})


# query = "Google"
# res = retrive.invoke(query)

# for i , q in enumerate(res):
#     print(f"Result {i+1}:")
#     print(q.page_content)
#     print("\n")
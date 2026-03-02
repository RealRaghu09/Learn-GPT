from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_core.documents import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter
from dotenv import load_dotenv


class VectorEmbedding:
    def __init__(self):
        load_dotenv()
        self.embeddings = GoogleGenerativeAIEmbeddings(
            model="models/text-embedding-004"
        )

        self.vectorStore = None
        self.retriever = None

    def insert_documents(self, text: str):

        splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            separators=["\n\n", "\n", ".", " ", ""]
        )

        chunks = splitter.split_text(text)

        documents = [
            Document(
                page_content=chunk,
                metadata={"chunk_id": idx}
            )
            for idx, chunk in enumerate(chunks)
        ]

        self.vectorStore = Chroma.from_documents(
            documents=documents,
            embedding=self.embeddings,
            collection_name="Hello_AI",
            persist_directory="./chroma_db"
        )

        self.retriever = self.vectorStore.as_retriever(
            search_type="mmr",
            search_kwargs={
                "k": 4,
                "lambda_mult": 0.5
            }
        )

    def query_documents(self, query: str):
        try:
            results = self.retriever.invoke(query)
    
            combined_text = "\n\n".join(
                [doc.page_content for doc in results]
            )

            return combined_text

        except Exception as e:
            return str(e)
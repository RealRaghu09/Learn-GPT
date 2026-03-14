"""Chatbot utility - inherits from MyModel for LLM access."""

from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import PromptTemplate

from utils.Model import MyModel


class Chatbot(MyModel):
    """Answers questions based on provided context using the base model."""

    def __init__(self):
        super().__init__()
        self.parser = StrOutputParser()
        self.template = PromptTemplate(
            template="Answer the following question based on the context.\n\nContext: {context}\n\nQuestion: {question}",
            input_variables=["question", "context"],
        )

    def generate_response(self, context: str, question: str) -> str:
        """Generate an answer to the question using the given context."""
        try:
            chain = self.template | self.model | self.parser
            return chain.invoke({"question": question, "context": context})
        except Exception as e:
            return f"Error from Chatbot: {str(e)}"
"""Summariser utility - inherits from MyModel for LLM access."""

from langchain.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser

from utils.Model import MyModel


class Summariser(MyModel):
    """Summarises text to a specified word count using the base model."""

    def __init__(self):
        super().__init__()
        self.template = PromptTemplate(
            template="Summarize the following text to {size} words:\n\n{text}",
            input_variables=["text", "size"],
        )

    def generate(self, text: str, size: str) -> str:
        """Summarise the given text to the specified word count."""
        try:
            chain = self.template | self.model | StrOutputParser()
            response = chain.invoke({"text": text, "size": size})
            return str(response)
        except Exception as e:
            return f"Error from Summariser: {str(e)}"
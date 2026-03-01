"""Web page loader - loads URL content and generates a summary via MyModel."""

from langchain_community.document_loaders import WebBaseLoader

from utils.Model import MyModel


class CustomWebBaseLoader(MyModel):
    """Loads a web page and generates a summary using the base model."""

    def get_response(self, url: str) -> str:
        """Load the URL and generate a summary of its content."""
        try:
            loader = WebBaseLoader(url)
            docs = loader.load()
            return self.generate(structured_prompt=str(docs))
        except Exception as e:
            return f"Error from Loading URL to BE: {str(e)}"
        
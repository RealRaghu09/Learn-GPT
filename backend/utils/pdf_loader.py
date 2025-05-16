from langchain_community.document_loaders import PyPDFLoader
import requests
import os

class PDFScanner:
    
    def LoadPDF(self, url: str) -> str:
        temp_file = "temp.pdf"
        
        # Step 1: Download the PDF
        response = requests.get(url)
        with open(temp_file, "wb") as f:
            f.write(response.content)
        
        # Step 2: Load the PDF
        loader = PyPDFLoader(temp_file)
        pages = loader.load()
        
        # Step 3: Delete the temp file
        os.remove(temp_file)
        
        return str(pages)

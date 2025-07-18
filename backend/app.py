from flask import Flask  , jsonify , request
from flask_cors import CORS
from utils.Model import MyModel
from utils.summariser import Summariser
from utils.Quiz import Quiz
from utils.chabot import Chatbot
from utils.web_page_loader import CustomWebBaseLoader
from utils.pdf_loader import PDFScanner
from utils.chroma import VectorEmbedding
import fitz
import os

app = Flask(__name__)
CORS(app,resources={r"/*": {"origins": "*"}})

# Welcome Route
@app.route('/' , methods=['POST'])
def home():
    data = request.get_json()
    return {"message":'Welcome to the Learnly API!'}

# Health check route for Render
@app.route('/health', methods=['GET'])
def health_check():
    return {"status": "healthy", "message": "Learnly API is running"}


# Experiment Route
@app.route('/generate', methods=['POST'])
def generate():
    try:
        data = request.get_json()
        llm = MyModel()
        print("received data: ", data['content'])
        return {"message":"Data received Sucessfull",'response': llm.generate(structured_prompt=data['content'])}
    except Exception as e:
        return {'message': str(e) , 'response': str(e)}
    
# Summarise Route
@app.route('/generate/summarise' , methods=['POST'])
def generate_summarise():
    try:
        data = request.get_json()
        llm = Summariser()
        response = llm.generate(text=data['content'] , size=data['size'])
        return {"message":"Data received Sucessfull",'response': response}
    except Exception as e:
        return {'message': str(e) , 'response': str(e)}

# Quiz Route 
@app.route('/generate/quiz' , methods=['POST'])
def generate_quiz():
    try:
        data = request.get_json()
        llm = Quiz()
        response = llm.generate_quiz(content=data['content'] , level=data['level'])
        return {'message' : 'Data received Sucessfull' , 'response': response}
    except Exception as e:
        return { "message": str(e) , 'response': str(e)}

# Chatbot Route
@app.route('/chat' , methods=['POST'])
def Chat():
    try:
        data = request.get_json()
        llm = Chatbot()
        response = llm.generate_response(question=data['question'] , context=data['context'])
        return {'message': 'Data received Sucessfull' , 'response': response}
    except Exception as e:
        return {'message': str(e) , 'response': str(e)}
#web Loader Route 
@app.route('/generate/webloader' , methods=['POST'])
def generate_webloader():
    try:
        data = request.get_json()
        llm = CustomWebBaseLoader()
        response = llm.get_response(url = data['content'])
        return {'message': 'Data received Sucessfull' , 'response': (response)}
    except Exception as e:
        return {'message': str(e) , 'response': str(e)}
# PDF Loader Route
@app.route('/load_pdf' , methods=['POST'])
def load_pdf():
    try :
        data = request.get_json()
        print("Data received")
        pdf = PDFScanner()
        response = pdf.LoadPDF(data['content'])
        return {'message': 'Data received Sucessfull' , 'response': str(response)}
    except Exception as e:
        return {'message': str(e) , 'response': str(e)}
    
# Not Working Route
@app.route('/load_pdf/ask', methods=['POST'])
def load_pdf_ask():
    try:
        data = request.get_json()
        pdf = PDFScanner()
        pdf_text = pdf.LoadPDF(url=data['content'])
        llm = VectorEmbedding()
        llm.insert_documents(documents=pdf_text)
        response = llm.query_documents(data['question'])
        return {'message': 'Data received Sucessfull' , 'response': (response)}
    except Exception as e:
        return {'message': str(e) , 'response': f'yo {str(e)}'}
    
@app.route('/upload', methods=['POST'])
def upload_pdf():
    file = request.files['pdf']
    doc = fitz.open(stream=file.read(), filetype="pdf")
    text = ""
    for page in doc:
        text += page.get_text()

    return jsonify({'text': text})
    

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
    

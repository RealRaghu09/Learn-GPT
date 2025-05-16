from flask import Flask  , jsonify , request
from flask_cors import CORS
from utils.Model import MyModel
from utils.summariser import Summariser
from utils.Quiz import Quiz
from utils.chabot import Chatbot
app = Flask(__name__)
CORS(app)
# Welcome Route
@app.route('/' , methods=['GET'])
def home():
    return 'Welcome to the Learnly API!'


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
        response = llm.generate_response(question=data['content'])
        return {'message': 'Data received Sucessfull' , 'response': response}
    except Exception as e:
        return {'message': str(e) , 'response': str(e)}
    

if __name__ == '__main__':
    app.run(debug=True , port=8000)
from langchain.output_parsers import StructuredOutputParser , ResponseSchema
from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv
from langchain_core.prompts import PromptTemplate
import json

class Quiz:
    def __init__(self):
        load_dotenv()
        self.Model = ChatGoogleGenerativeAI(model="gemini-1.5-flash")
        self.schema = [
            ResponseSchema(name='question_1', description='Question 1 of the content'),
            ResponseSchema(name='question_1_option_1', description='Question 1 option 1'),
            ResponseSchema(name='question_1_option_2', description='Question 1 option 2'),
            ResponseSchema(name='question_1_option_3', description='Question 1 option 3'),
            ResponseSchema(name='question_1_option_4', description='Question 1 option 4'),
            ResponseSchema(name='correct_answer_1', description='Correct answer for question 1'),
            ResponseSchema(name='question_2', description='Question 2 of the content'),
            ResponseSchema(name='question_2_option_1', description='Question 2 option 1'),
            ResponseSchema(name='question_2_option_2', description='Question 2 option 2'),
            ResponseSchema(name='question_2_option_3', description='Question 2 option 3'),
            ResponseSchema(name='question_2_option_4', description='Question 2 option 4'),
            ResponseSchema(name='correct_answer_2', description='Correct answer for question 2'),
            ResponseSchema(name='question_3', description='Question 3 of the content'),
            ResponseSchema(name='question_3_option_1', description='Question 3 option 1'),
            ResponseSchema(name='question_3_option_2', description='Question 3 option 2'),
            ResponseSchema(name='question_3_option_3', description='Question 3 option 3'),
            ResponseSchema(name='question_3_option_4', description='Question 3 option 4'),
            ResponseSchema(name='correct_answer_3', description='Correct answer for question 3'),
            ResponseSchema(name='question_4', description='Question 4 of the content'),
            ResponseSchema(name='question_4_option_1', description='Question 4 option 1'),
            ResponseSchema(name='question_4_option_2', description='Question 4 option 2'),
            ResponseSchema(name='question_4_option_3', description='Question 4 option 3'),
            ResponseSchema(name='question_4_option_4', description='Question 4 option 4'),
            ResponseSchema(name='correct_answer_4', description='Correct answer for question 4'),
            ResponseSchema(name='question_5', description='Question 5 of the content'),
            ResponseSchema(name='question_5_option_1', description='Question 5 option 1'),
            ResponseSchema(name='question_5_option_2', description='Question 5 option 2'),
            ResponseSchema(name='question_5_option_3', description='Question 5 option 3'),
            ResponseSchema(name='question_5_option_4', description='Question 5 option 4'),
            ResponseSchema(name='correct_answer_5', description='Correct answer for question 5')
        ]

        self.parser = StructuredOutputParser.from_response_schemas(self.schema)

        self.template = PromptTemplate(
            template= "Give 5 MCQ's of level {level} to {content} .in {format}",
            input_variables=["topic", "level"],
            partial_variables={"format": self.parser.get_format_instructions()},
        )
# prompt = template.invoke({"topic": "Tiger"})

# Result = Model.invoke(prompt)
# Final_result = parser.parse(Result.content)
# print(Final_result)
    def generate_quiz(self,content:str , level:str):
        try:
            chain = self.template | self.Model | self.parser
            Final = chain.invoke({"content": content, "level": level})  
            
            print(Final)
            return str(Final)
        except Exception as e:
                return (f"Error in Quiz Generation: {str(e)}")
            
# NO DATA VALIDATION
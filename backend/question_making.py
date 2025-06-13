import os
from dotenv import load_dotenv
from langchain import PromptTemplate
from langchain.chains.question_answering import load_qa_chain
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.docstore.document import Document
import re
import json
 # Load environment variables from .env file
load_dotenv()

    # Get the API key from the environment
api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
  raise ValueError("The GOOGLE_API_KEY environment variable is not set.")

def generate_questions(context):
   

    # Define the prompt template
    prompt_template = """
      Please generate five questions based on the provided paragraph.
      Ensure the questions cover key details and concepts mentioned in the paragraph.
    \n\n
      Paragraph:\n {context}\n
      
      Generated Questions:
      1.
      2.
      3.
      4.
      5.
    """

    prompt = PromptTemplate(template=prompt_template, input_variables=["context"])

    # Initialize the model
    model = ChatGoogleGenerativeAI(model="gemini-pro", temperature=0.3, api_key=api_key)

    # Load the QA chain
    chain = load_qa_chain(model, chain_type="stuff", prompt=prompt)

    # Convert the context to a Document object
    document = Document(page_content=context)

    try:
        # Generate the questions
        response = chain({"input_documents": [document]}, return_only_outputs=True)
        return response
    except Exception as e:
        return f"An error occurred: {e}"
    

def extract_sections(input_file):
    with open(input_file, 'r', encoding='utf-8') as file:
        content = file.read()

    # Split the content into sections using "Section X:" as the delimiter
    sections = re.split(r'\n\n', content.strip())

    # List to store the dataset
    dataset = []

    # Iterate through sections and generate questions
    for i, section in enumerate(sections):
        if section.strip():  # Ignore empty sections
            paragraph = section.strip()

            # Generating questions
            questions = generate_questions(paragraph)

            # Extracting questions from the dictionary
            if isinstance(questions, str):
                print(f"Error generating questions for section {i+1}: {questions}")
                continue
            question_lines = questions['output_text'].split('\n')
            # Ensure there are at least 5 questions returned
            if len(question_lines) < 5:
                print(f"Insufficient questions generated for section {i+1}")
                continue

            # Remove the leading '1. ', '2. ', etc.
            question1 = question_lines[0][3:]  
            question2 = question_lines[1][3:]  
            question3 = question_lines[2][3:]  
            question4 = question_lines[3][3:]  
            question5 = question_lines[4][3:]  

            # Append the question-answer pairs to the dataset
            dataset.append({
                'question': question1,
                'answer': paragraph
            })
            dataset.append({
                'question': question2,
                'answer': paragraph
            })
            dataset.append({
                'question': question3,
                'answer': paragraph
            })
            dataset.append({
                'question': question4,
                'answer': paragraph
            })
            dataset.append({
                'question': question5,
                'answer': paragraph
            })

    # Define the output file path
    output_file = "output_questions.json"
    
    # Open the file in write mode and write the dataset in JSON format
    with open(output_file, 'w', encoding='utf-8') as file:
        json.dump(dataset, file, indent=4)

    print(f"Dataset written to {output_file}")

# Example usage
extract_sections("/Users/nemal/OneDrive/Desktop/python/bsoup/scraped_data1.txt")
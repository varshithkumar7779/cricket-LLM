import json

def convert_to_llama_format(qa_pairs):
    formatted_qa = ""
    for qa in qa_pairs:
        formatted_qa += f"<s>[INST] {qa['question']} [/INST] {qa['answer']} </s>\n"
    return formatted_qa

def read_json_file(json_file):
    with open(json_file, 'r', encoding='utf-8') as file:
        data = json.load(file)
    return data

def append_to_text_file(text_file, content):
    with open(text_file, 'a', encoding='utf-8') as file:
        file.write(content)

def main():
    input_json_file = 'output_questions.json'  # Replace with your input JSON file
    output_text_file = 'formatted_qa_pairs.txt'  # Replace with your output text file
    
    qa_pairs = read_json_file(input_json_file)
    formatted_qa = convert_to_llama_format(qa_pairs)
    append_to_text_file(output_text_file, formatted_qa)
    
    print(f"Formatted Q&A pairs have been appended to {output_text_file}")

if __name__ == "__main__":
    main()

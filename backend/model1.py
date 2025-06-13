import json
import torch
import numpy as np
import pandas as pd
from sentence_transformers import SentenceTransformer, util
import textwrap
import os
import sys

def print_wrapped(text, wrap_length=80):
    wrapped_text = textwrap.fill(text, wrap_length)
    return wrapped_text
#bert-base-nli-mean-tokens
def main():
    query = sys.argv[1]
    #query = 'how many cups did rohit won'
    embedding_model = SentenceTransformer(model_name_or_path="all-mpnet-base-v2", device="cpu")

    # Correct path handling for Windows
    embeddings_file_path = r"C:\Users\nemal\OneDrive\Desktop\cricket\backend\embeddings_rohitsharma.json"

    if not os.path.exists(embeddings_file_path):
        print(f"File {embeddings_file_path} does not exist")
        return

    # Read the JSON file
    with open(embeddings_file_path, 'r') as f:
        json_data = json.load(f)

    sentences = []
    embeddings = []

    for sentence, embedding in json_data.items():
        sentences.append(sentence)
        embeddings.append(embedding)

    df = pd.DataFrame({
        'sentence': sentences,
        'embedding': embeddings
    })

    #print("Columns in the DataFrame:", df.columns)
    #print("First few rows of the DataFrame:\n", df.head())

    if 'embedding' in df.columns:
        df["embedding"] = df["embedding"].apply(lambda x: np.array(x))
    else:
        print("'embedding' column not found in the DataFrame")
        return

    embeddings_tensor = torch.tensor(np.array(df["embedding"].tolist()), dtype=torch.float32).to('cpu')

    query_embedding = embedding_model.encode(query, convert_to_tensor=True)

    dot_scores = util.dot_score(a=query_embedding, b=embeddings_tensor)[0]

    # Get the top-k results
    top_results_dot_product = torch.topk(dot_scores, k=1)

    results = []
    for score, idx in zip(top_results_dot_product[0].tolist(), top_results_dot_product[1].tolist()):
        if score<0.5:
            results.append({
                #"score": float(score),
                "text": """I'm sorry, I don't have the information you're looking for. I am specifically trained on topics related to Rohit Sharma. Can I help you with something related to him?"""
            })
        else:
            results.append({
                #"score": float(score),
                "text": print_wrapped(df.iloc[idx]['sentence'])
            })
    response = {
        "results":results
    }
    #print(response)
    print(json.dumps(response))

if __name__ == '__main__':
    main()
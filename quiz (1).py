import json
import requests

def getScore(quiz_id):
    global ACCES_TOKEN
    url = 'https://api.tesseractonline.com/quizattempts/submit-quiz'

    headers = {
        'Sec-Ch-Ua': '"Chromium";v="119", "Not?A_Brand";v="24"',
        'Accept': 'application/json, text/plain, /',
        'Content-Type': 'application/json',
        'Sec-Ch-Ua-Mobile': '?0',
        'Authorization': f'Bearer {ACCES_TOKEN}',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.6045.123 Safari/537.36',
        'Sec-Ch-Ua-Platform': '"Linux"',
        'Origin': 'https://tesseractonline.com',
        'Sec-Fetch-Site': 'same-site',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Dest': 'empty',
        'Referer': 'https://tesseractonline.com/',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'en-US,en;q=0.9',
        'Priority': 'u=1, i'
    }

    payload = {
        "quizId": quiz_id
    }

    response = requests.post(url, headers=headers, json=payload)

    return json.loads(response.text)["payload"]["score"]







def attemptQuizApi(quiz_id, question_id, user_answer):
    global ACCES_TOKEN
    url = 'https://api.tesseractonline.com/quizquestionattempts/save-user-quiz-answer'

    headers = {
        'Sec-Ch-Ua': '"Chromium";v="119", "Not?A_Brand";v="24"',
        'Accept': 'application/json, text/plain, /',
        'Content-Type': 'application/json',
        'Sec-Ch-Ua-Mobile': '?0',
        'Authorization': f'Bearer {ACCES_TOKEN}',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.6045.123 Safari/537.36',
        'Sec-Ch-Ua-Platform': '"Linux"',
        'Origin': 'https://tesseractonline.com',
        'Sec-Fetch-Site': 'same-site',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Dest': 'empty',
        'Referer': 'https://tesseractonline.com/',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'en-US,en;q=0.9',
        'Priority': 'u=1, i'
    }

    payload = {
        "quizId": quiz_id,
        "questionId": question_id,
        "userAnswer": user_answer
    }

    response = requests.post(url, headers=headers, json=payload)
    # print(quiz_id,"  ", question_id,"  ",user_answer," ",getScore(quiz_id))

    return getScore(quiz_id)



def attemptQuiz(quiz_id,questionId,currentScore):
    score = currentScore
    options = ["a","b","c","d"]
    i=0
    while(score!=currentScore+1):
        score = attemptQuizApi(quiz_id,questionId,options[i])
        i+=1
        if i==4:
            # print("something went wrong")
            break
    print(score)
    return score

def attemptOneQuiz(quizId):
    global ACCES_TOKEN
    url = f'https://api.tesseractonline.com/quizattempts/create-quiz/{quizId}'

    headers = {
        'Sec-Ch-Ua': '"Chromium";v="119", "Not?A_Brand";v="24"',
        'Accept': 'application/json, text/plain, /',
        'Sec-Ch-Ua-Mobile': '?0',
        'Authorization': f'Bearer {ACCES_TOKEN}',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.6045.123 Safari/537.36',
        'Sec-Ch-Ua-Platform': '"Linux"',
        'Origin': 'https://tesseractonline.com',
        'Sec-Fetch-Site': 'same-site',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Dest': 'empty',
        'Referer': 'https://tesseractonline.com/',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'en-US,en;q=0.9',
        'Priority': 'u=1, i'
    }

    response = requests.get(url, headers=headers)
    data = json.loads(response.text)
    quiz_id = data["payload"]["quizId"]
    currentScore = 0 
    for i in data["payload"]["questions"]:
        currentScore = attemptQuiz(quiz_id,i['questionId'],currentScore)

def main():
    global ACCES_TOKEN 
    ACCES_TOKEN = input("enter the Acces Token : ")
    task=[2495,2496]
    for m in task:
        print("Enter the quiz you want to write (Quiz Id Which u can see when you open the quiz page in chrome):")
        quiz= [str(m)]
        for i in quiz:
            print(f"Solving quiz {i}")
            attemptOneQuiz(i)
            print("quiz " +str(i) +" is finished .")
    print('Thank u')

if __name__ == "__main__":
    main()
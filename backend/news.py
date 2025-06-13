import requests
from bs4 import BeautifulSoup
import json

url = 'https://www.espncricinfo.com/cricket-news'
response = requests.get(url)

soup = BeautifulSoup(response.text, 'html.parser')

news_containers = soup.find_all('div', class_='ds-border-b ds-border-line ds-p-4')

news_list = []
for news in news_containers:
    headline = news.find('h2', class_='ds-text-title-s ds-font-bold ds-text-typo')
    link_tag = news.find('a')
    if headline:
        headline_text = headline.text.strip()
        news_item = {'headline': headline_text}
        if link_tag and 'href' in link_tag.attrs:
            link = 'https://www.espncricinfo.com' + link_tag['href']
            news_item['link'] = link
        news_list.append(news_item)
print(json.dumps(news_list))

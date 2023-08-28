# webscraping test 2

import requests
from bs4 import BeautifulSoup
import re

url = "https://kpe.utoronto.ca/sport-recreation/discover-sport-rec"
response = requests.get(url)

if response.status_code == 200:
    html_content = response.content
else:
    print("failed to reach website.")
exit

soup = BeautifulSoup(html_content, "html.parser")
text_elements = soup.find_all(["p", "h1", "h2", "h3", "h4", "h5", "h6", "span"])
scraped_text = "".join(element.get_text() for element in text_elements)
print(scraped_text)

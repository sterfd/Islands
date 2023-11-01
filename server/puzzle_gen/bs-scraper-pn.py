# scraping puzzle-nurikabe.com

from selenium import webdriver
from bs4 import BeautifulSoup

driver = webdriver.Chrome()

cell_contents = []
driver.get("https://www.puzzle-nurikabe.com/?size=1")

content = driver.page_source
soup = BeautifulSoup(content, "html.parser")
job = soup.find("table", id="puzzleContainer")
for div in job.find_all("div", class_="cell-off"):
    cell_contents.append(div.text)
print(cell_contents)

driver.quit()


def puz_str_to_array(puz):
    puzzle_array = [[-2 for _ in range(n)] for _ in range(n)]
    for idx, ch in enumerate(puz):
        if ch.isnumeric():
            puzzle_array[idx // n][idx % n] = int(ch)
    print(puzzle_array)


n = int(len(cell_contents) ** 0.5)
puz_str_to_array(cell_contents)

# for div in soup2.findall("div", attrs={"class": "cell-off"}):
#     cell_contents.append(div)

# for div in soup.find_all("div", attrs={"class": "cell-off"}):
#     # for div in soup.find_all("div", attrs={"id": "js-puzzle-target"}):
#     cell_contents.append(div.text)

# df = pd.DataFrame({"Cells": cell_contents})
# print(df)
# df.to_csv("cells.csv", index=False, encoding="utf-8")

# pulling starting 7x7 boards from puzzle-nurikabe.com - paste into game solver

from selenium import webdriver
from bs4 import BeautifulSoup

driver = webdriver.Chrome()
driver.get("https://www.puzzle-nurikabe.com/?size=1")

# pull from website into array
cell_contents = []
content = driver.page_source
soup = BeautifulSoup(content, "html.parser")
job = soup.find("table", id="puzzleContainer")
for div in job.find_all("div", class_="cell-off"):
    cell_contents.append(div.text)
print(cell_contents)
driver.quit()


# parse strings into my custom format for puzzles
def puz_str_to_array(puz):
    puzzle_array = [[-2 for _ in range(n)] for _ in range(n)]
    for idx, ch in enumerate(puz):
        if ch.isnumeric():
            puzzle_array[idx // n][idx % n] = int(ch)
    return puzzle_array


n = int(len(cell_contents) ** 0.5)
print(puz_str_to_array(cell_contents))

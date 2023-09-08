# scraping puzzle-nurikabe.com

from selenium import webdriver
from bs4 import BeautifulSoup
import pandas as pd

driver = webdriver.Chrome()

cell_contents = []
# driver.get("https://www.puzzle-nurikabe.com")
driver.get("https://puzzlemadness.co.uk/nurikabe/small/2016/07/16")

content = driver.page_source
soup = BeautifulSoup(content, "html.parser")

# for div in soup.find_all("div", attrs={"class": "nurikabe-task-cell cell-off"}):
for div in soup.find_all("div", attrs={"id": "js-puzzle-target"}):
    cell_contents.append(div.text)

df = pd.DataFrame({"Cells": cell_contents})
print(df)
# df.to_csv("cells.csv", index=False, encoding="utf-8")


driver.quit()

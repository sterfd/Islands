# dynamically loaded puzzles
import json
from playwright.sync_api import sync_playwright


def get_puzzle():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.goto("https://www.logicgamesonline.com/nurikabe/")
        page.wait_for_selector("#container")

        solution = page.evaluate("() => solpuz")
        puzzle = page.evaluate("() => puzzle")
        browser.close()
    return (puzzle, solution)


def puz_str_to_array(puz, sol):
    puzzle_array = [[-2 for _ in range(5)] for _ in range(5)]
    solution_array = [[0 for _ in range(5)] for _ in range(5)]

    for idx, ch in enumerate(puz):
        if ch.isnumeric():
            puzzle_array[idx // 5][idx % 5] = int(ch)

    for idx, ch in enumerate(sol):
        if ch.isnumeric():
            solution_array[idx // 5][idx % 5] = int(ch)
        elif ch == " ":
            solution_array[idx // 5][idx % 5] = -1
    return (puzzle_array, solution_array)


with open("puzzles-5.txt", "a") as f:
    for _ in range(10):
        puzzle, solution = get_puzzle()
        parray, sarray = puz_str_to_array(puzzle, solution)
        f.write(str(parray) + str(sarray) + "\n")

# there is also 9x9 archive inthe dailies
# need to write to json instead of txt - how to append?

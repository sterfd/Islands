# dynamically loaded puzzles
import json
from playwright.sync_api import sync_playwright


def get_puzzle():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.goto(
            "https://www.puzzlemix.com/playgrid.php?id=94123&type=nurikabe&share=1"
        )
        page.wait_for_selector("#gridcontainer")

        solution = page.evaluate("() => soln")
        puzzle = page.evaluate("() => placed")
        browser.close()
    return (puzzle, solution)


def puz_str_to_array(puz, sol):
    puzzle_array = [[-2 for _ in range(10)] for _ in range(10)]
    solution_array = [[0 for _ in range(10)] for _ in range(10)]

    for idx, num in enumerate(puz):
        if num != 0:
            puzzle_array[idx // 10][idx % 10] = num
            solution_array[idx // 10][idx % 10] = num
        elif sol[idx] == 1:
            solution_array[idx // 10][idx % 10] = 1

    return (puzzle_array, solution_array)


puzzle, solution = get_puzzle()
parray, sarray = puz_str_to_array(puzzle, solution)

print(parray)
print(sarray)
# with open("puzzles-10.txt", "a") as f:
#     f.write(str(parray) + str(sarray) + "\n")

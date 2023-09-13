# dynamically loaded puzzles
from playwright.sync_api import sync_playwright
import sqlite3
import random


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


def insert_into_db():
    try:
        sqliteConnection = sqlite3.connect("../api/islands.db")
        cursor = sqliteConnection.cursor()
        print("connected!!")

        for idx in range(10):
            rand = random.randint(0, 1000000)
            query = "INSERT INTO Games (id, size, board, solution) VALUES ({0}, 5, '{1}', '{2}')".format(
                rand, puzzle_array[idx], solution_array[idx]
            )
            cursor.execute(query)
        sqliteConnection.commit()
        print("successfully inserted!")
        cursor.close()
    except sqlite3.Error as error:
        print("failed", error)
    finally:
        if sqliteConnection:
            sqliteConnection.close()
            print("connection closed")


# puzzle_array, solution_array = [], []
# for _ in range(10):
#     puzzle, solution = get_puzzle()
#     parray, sarray = puz_str_to_array(puzzle, solution)
#     puzzle_array.append(parray)
#     solution_array.append(sarray)

# insert_into_db()


# UPDATE COMPUTED GAME METRICS AFTER SCRAPING

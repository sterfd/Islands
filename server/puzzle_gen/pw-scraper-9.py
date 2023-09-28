# dynamically loaded puzzles
from playwright.sync_api import sync_playwright
import sqlite3
import random


def get_puzzle(num):
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        url = "https://www.logicgamesonline.com/nurikabe/archive.php?pid=" + str(num)
        page.goto(url)
        page.wait_for_selector("#container")

        solution = page.evaluate("() => solpuz")
        puzzle = page.evaluate("() => puzzle")
        browser.close()
    return (puzzle, solution)


def puz_str_to_array(puz, sol):
    puzzle_array = [[-2 for _ in range(n)] for _ in range(n)]
    solution_array = [[0 for _ in range(n)] for _ in range(n)]

    for idx, ch in enumerate(puz):
        if ch.isnumeric():
            puzzle_array[idx // n][idx % n] = int(ch)

    for idx, ch in enumerate(sol):
        if ch.isnumeric():
            solution_array[idx // n][idx % n] = int(ch)
        elif ch == " ":
            solution_array[idx // n][idx % n] = -1
    return (puzzle_array, solution_array)


parray, sarray = [], []
for _ in range(10):
    num = random.randint(8, 6420)
    puzzle, solution = get_puzzle(num)
    n = int(len(puzzle) ** 0.5)
    puz, sol = puz_str_to_array(puzzle, solution)
    parray.append(puz)
    sarray.append(sol)
print(len(parray))
print(len(sarray))


def read_db():
    try:
        sqliteConnection = sqlite3.connect("../api/islands.db")
        cursor = sqliteConnection.cursor()
        print("connected!!")

        for idx in range(10):
            rand = random.randint(0, 1000000)
            query = "INSERT INTO Games (id, size, board, solution) VALUES ({0}, {1}, '{2}', '{3}')".format(
                rand, n, parray[idx], sarray[idx]
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


read_db()


# UPDATE COMPUTED GAME METRICS AFTER SCRAPING

import sqlite3
import os

current_directory = os.getcwd()

print(current_directory)


def update_computed_game_metrics():
    try:
        sqliteConnection = sqlite3.connect("./islands.db")
        cursor = sqliteConnection.cursor()
        print("connected!")
        game_ids = []
        for id in cursor.execute(
            "SELECT id FROM games WHERE id not in (SELECT id FROM computed_game_metrics)"
        ):
            game_ids.append(id[0])

        print(game_ids)

        for id in game_ids:
            cursor.execute(
                "INSERT INTO computed_game_metrics (id, number_of_solves, avg_time) VALUES ({0}, 0, 0)".format(
                    id
                )
            )
        sqliteConnection.commit()
        print("database updated!")

    except sqlite3.Error as error:
        print("failed", error)
    finally:
        if sqliteConnection:
            sqliteConnection.close()
            print("connection closed")


update_computed_game_metrics()

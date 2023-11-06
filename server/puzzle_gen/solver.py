import copy
import random

testBoard = [
    [-2, -2, 6, -2, -2, -2, -2],
    [-2, 1, -2, -2, -2, -2, -2],
    [-2, -2, -2, -2, 2, -2, -2],
    [-2, -2, -2, -2, -2, -2, -2],
    [-2, -2, 2, -2, -2, -2, -2],
    [-2, -2, -2, -2, -2, 4, -2],
    [-2, -2, -2, -2, 8, -2, -2],
]


# solving strat to implement - need to somehow keep looping over lonely island/water
# need update to empty distancees, since distance later is a result of available path
# for numbered islands - see if adding one somewhere blocks another island, tells us this is water


class BoardState:
    def __init__(self, board):
        self.complete = False
        self.size = len(board)
        self.remaining_islands = {
            (r, c): [(r, c)]
            for r in range(self.size)
            for c in range(self.size)
            if board[r][c] > 0
        }
        self.land = {
            (r, c): []
            for r in range(self.size)
            for c in range(self.size)
            if board[r][c] > 0
        }
        self.water = {}
        self.empty = set(
            [
                (r, c)
                for r in range(self.size)
                for c in range(self.size)
                if board[r][c] == -2
            ]
        )
        self.total_land = self.count_lands(board)
        self.land_count = len(self.remaining_islands)
        self.history = [copy.deepcopy(board)]
        self.check_diagonal_numbers()
        self.empty_distances()
        lands = list(self.land)
        for r, c in lands:
            self.check_island(r, c)
        self.empty_distances()

    # distance from island to cell is closest valid path to cell
    # what is valid - does not connect to other islands
    #           does not block other islands
    #           only over empties
    #           within area limit

    # bfs - queue with all island blocks - we have area - len(island) moves to get to hte cell
    # for directions from each coord - we can add it to queue if not checked, and valid
    # valid if it is empty and not connected to other island
    # and if not blocing other island
    #

    """
    26
    self.land
    {(0, 2): [(0, 3)], 
        (0, 3): [(0, 2)],       remaining 6

        (1, 1): [],         done 1

        (2, 4): [],             remaining 2

        (3, 2): [(4, 2)],   done 2
        (4, 2): [(3, 2)], 

        (4, 5): [(5, 5)],       remaining 4
        (5, 5): [(4, 5)],

        (6, 4): [(6, 3)],       remaining 8
        (6, 3): [(6, 4)], 

        (3, 0): [(4, 0)],       uncharted
        (4, 0): [(3, 0), (5, 0)], 
        (5, 0): [(4, 0)]}

    self.remaining_islands
    {(0, 2): {(0, 2), (0, 3)},      6
    (2, 4): [(2, 4)],               2
    (5, 5): {(4, 5), (5, 5)},       4
    (6, 4): {(6, 3), (6, 4)}}       8
    """
    # right now the problem is when two isalnd fragments aren't connected, we assume any
    # island that isn't directly connected to target is something we cannot get in proximity of
    # this results in premature blocking of routes for floating islands

    def remaining_land_expansion(self, r, c):
        dir = [(1, 0), (-1, 0), (0, 1), (0, -1)]
        remaining_area = self.history[0][r][c] - len(self.remaining_islands[(r, c)])

    def calculate_distance(self, r, c, ir, ic):
        dir = [(1, 0), (-1, 0), (0, 1), (0, -1)]
        checked = set(self.remaining_islands[(ir, ic)])
        queue = list(checked)
        distance, remaining_area = 0, self.history[0][ir][ic] - len(checked)
        while queue:
            if distance > remaining_area:
                return self.history[0][ir][ic]
            new_queue = []
            for qr, qc in queue:
                if qr == r and qc == c:
                    return distance
                for dr, dc in dir:
                    if self.valid_path(dr + qr, dc + qc, checked):
                        new_queue.append((dr + qr, dc + qc))
                        checked.add((dr + qr, dc + qc))

            queue = new_queue
            distance += 1
        return self.history[0][ir][ic]

    def valid_path(self, r, c, visited):
        dir = [(1, 0), (-1, 0), (0, 1), (0, -1)]
        dia = [(1, 1), (-1, -1), (-1, 1), (1, -1)]
        if not self.is_empty(r, c) or (r, c) in visited:
            return False
        # for dr, dc in dir:
        #     if self.is_land(r + dr, c + dc) and (r + dr, c + dc) not in visited:
        #         return False
        # for dr, dc in dia:
        #     if is_land(r+dr, c+dc) and (r+dr, c+dc) not in visited:
        #         # check if - this is in remaining
        #         #   surr empties is just these diagonals -
        return True

    def empty_distances(self):
        current_empties = list(self.empty)
        for r, c in current_empties:
            close_islands = []
            for ir, ic in self.remaining_islands:
                distance_to_cell = self.calculate_distance(r, c, ir, ic)
                if distance_to_cell < self.history[0][ir][ic]:
                    close_islands.append((distance_to_cell, ir, ic))
                if len(close_islands) > 1:
                    continue
            if not close_islands:
                self.add_water(r, c)

    def check_complete(self):
        # check if rest should be water or rest should be land
        if self.land_count == self.total_land:
            self.complete = True
            last_cells = list(self.empty)
            for r, c in last_cells:
                self.add_water(r, c)
            return
        if len(self.empty) == (self.total_land - self.land_count):
            self.complete = True
            last_cells = list(self.empty)
            for r, c in last_cells:
                self.add_land(r, c)
            return

    def count_lands(self, board):
        land = 0
        for row in board:
            for cell in row:
                if cell > 0:
                    land += cell
        return land

    def check_diagonal_numbers(self):
        dia = [(1, 1), (-1, -1), (-1, 1), (1, -1)]
        two = [(2, 0), (-2, 0), (0, 2), (0, -2)]
        remaining = list(self.remaining_islands)
        for r, c in remaining:
            for dr, dc in dia:
                if self.is_land(r + dr, c + dc):
                    self.add_water(r, c + dc)
                    self.add_water(r + dr, c)
            for dr, dc in two:
                if self.is_land(r + dr, c + dc):
                    self.add_water(r + dr // 2, c + dc // 2)

    def add_water(self, r, c):
        dir = [(1, 0), (-1, 0), (0, 1), (0, -1)]
        if (r, c) not in self.empty:
            return
        self.empty.remove((r, c))
        current_move = copy.deepcopy(self.history[-1])
        current_move[r][c] = 0
        self.history.append(current_move)
        self.water[(r, c)] = []
        self.check_complete()
        if self.complete:
            return
        # check if water is connected to others, updated adj list
        for dr, dc in dir:
            if self.is_water(r + dr, c + dc):
                self.water[(r, c)].append((r + dr, c + dc))
                self.water[(r + dr, c + dc)].append((r, c))
            if self.is_land(r + dr, c + dc):
                self.check_island(r + dr, c + dc)
        if self.water[(r, c)]:  # if adjacent water, check 2x2
            self.check_big_water(r, c)
        # check lonely - if yes, add water
        self.check_lonely_water(r, c)
        # check surrounded empties (adj) - surrounded by 4 waters
        for dr, dc in dir:
            if self.is_empty(r + dr, c + dc):
                self.check_surr_empty(r + dr, c + dc)

    def add_land(self, r, c):
        dir = [(1, 0), (-1, 0), (0, 1), (0, -1)]
        if (r, c) not in self.empty:
            return
        self.empty.remove((r, c))
        current_move = copy.deepcopy(self.history[-1])
        current_move[r][c] = -1
        self.history.append(current_move)
        self.land_count += 1
        self.land[(r, c)] = []
        for dr, dc in dir:
            if self.is_land(r + dr, c + dc):
                self.land[(r, c)].append((r + dr, c + dc))
                self.land[(r + dr, c + dc)].append((r, c))
        self.check_island(r, c)
        self.check_straight_line(r, c)
        self.check_complete()
        if self.complete:
            return

    def check_straight_line(self, r, c):
        close_islands = []
        for ir, ic in self.remaining_islands:
            distance_to_cell = abs(ir - r) + abs(ic - c)
            if distance_to_cell < self.history[0][ir][ic]:
                close_islands.append((distance_to_cell, ir, ic))
            if len(close_islands) > 1:
                continue
        if len(close_islands) == 1:
            distance, ir, ic = close_islands[0]
            if distance + 1 == self.history[0][ir][ic] and (r == ir or c == ic):
                for row in range(min(r, ir), max(r, ir) + 1):
                    for col in range(min(c, ic), max(c, ic) + 1):
                        self.add_land(row, col)

    def is_water(self, r, c):
        if 0 <= r < self.size and 0 <= c < self.size and self.history[-1][r][c] == 0:
            return True
        return False

    def is_valid(self, r, c):
        if 0 <= r < self.size and 0 <= c < self.size:
            return True
        return False

    def is_land(self, r, c):
        if (
            0 <= r < self.size
            and 0 <= c < self.size
            and (self.history[-1][r][c] == -1 or self.history[-1][r][c] > 0)
        ):
            return True
        return False

    def is_empty(self, r, c):
        if 0 <= r < self.size and 0 <= c < self.size and self.history[-1][r][c] == -2:
            return True
        return False

    def check_big_water(self, r, c):
        dir = [(1, 1), (-1, -1), (-1, 1), (1, -1)]
        for dr, dc in dir:
            if self.is_valid(dr + r, dc + c):
                not_water = []
                if not self.is_water(dr + r, dc + c):
                    not_water.append((dr + r, dc + c))
                if not self.is_water(r, dc + c):
                    not_water.append((r, dc + c))
                if not self.is_water(dr + r, c):
                    not_water.append((dr + r, c))
                if len(not_water) == 1:
                    self.add_land(not_water[0][0], not_water[0][1])

    def check_lonely_water(self, r, c):
        self.check_complete()
        dir = [(1, 0), (-1, 0), (0, 1), (0, -1)]
        checked_water = set([(r, c)])
        adj_empty = set()
        queue = [(r, c)]
        while queue:
            new_queue = []
            for r, c in queue:
                for ar, ac in self.water[(r, c)]:
                    if (ar, ac) not in checked_water:
                        new_queue.append((ar, ac))
                        checked_water.add((ar, ac))
                for dr, dc in dir:
                    if self.is_empty(r + dr, c + dc):
                        adj_empty.add((r + dr, c + dc))
                        if len(adj_empty) > 1:
                            return
            queue = new_queue
        if len(adj_empty) == 1:
            empties = list(adj_empty)
            for r, c in empties:
                self.add_water(r, c)

    def check_surr_empty(self, r, c):
        dir = [(1, 0), (-1, 0), (0, 1), (0, -1)]
        waters = 0
        surr = 0
        for dr, dc in dir:
            if self.is_valid(r + dr, c + dc):
                surr += 1
            if self.is_water(r + dr, c + dc):
                waters += 1
        if waters == surr:
            self.add_water(r, c)

    def check_island(self, r, c):
        dir = [(1, 0), (-1, 0), (0, 1), (0, -1)]
        self.check_straight_line(r, c)
        target = (r, c) if (r, c) in self.remaining_islands else None
        surr_empties = set()
        checked = set([(r, c)])
        queue = [(r, c)]
        while queue:
            new_queue = []
            for r, c in queue:
                for ar, ac in self.land[(r, c)]:
                    if (ar, ac) not in checked:
                        checked.add((ar, ac))
                        new_queue.append((ar, ac))
                        if (ar, ac) in self.remaining_islands:
                            target = (ar, ac)
                for dr, dc in dir:
                    if self.is_empty(r + dr, c + dc):
                        surr_empties.add((r + dr, c + dc))
            queue = new_queue
        if target:
            r, c = target
            self.remaining_islands[(r, c)] = checked
            if len(self.remaining_islands[(r, c)]) == self.history[-1][r][c]:
                for er, ec in surr_empties:
                    self.add_water(er, ec)
                if (r, c) in self.remaining_islands:
                    self.remaining_islands.pop((r, c))
                # check for empties again
                self.empty_distances()
        if len(surr_empties) == 1:
            for r, c in surr_empties:
                self.add_land(r, c)


class DSU:
    def __init__(self):
        self.parents = {}
        self.ranks = {}

    def parent_len(self):
        return len(set(self.parents.values()))

    def find_water(self, node):
        if node not in self.parents:
            self.parents[node] = node
        if self.parents[node] != node:
            self.parents[node] = self.find_water(self.parents[node])
        return self.parents[node]

    def get_rank(self, node):
        if node not in self.ranks:
            self.ranks[node] = 0
        return self.ranks[node]

    def union(self, node_a, node_b):
        parent_a = self.find_water(node_a)
        parent_b = self.find_water(node_b)
        if parent_a == parent_b:
            return
        rank_a = self.get_rank(parent_a)
        rank_b = self.get_rank(parent_b)
        if rank_a > rank_b:
            self.parents[parent_b] = parent_a
        else:
            self.parents[parent_a] = parent_b
            if rank_a == rank_b:
                rank_b += 1


def is_water(r, c, board):
    if 0 <= r < len(board) and 0 <= c < len(board) and board[r][c] == 0:
        return True
    return False


def is_land(r, c, board):
    if (
        0 <= r < len(board)
        and 0 <= c < len(board)
        and (board[r][c] == -1 or board[r][c] > 0)
    ):
        return True
    return False


def valid_solution(board):
    board_connection = DSU()
    dir = [(1, 0), (-1, 0), (0, 1), (0, -1)]
    lands_checked = set()
    for r, row in enumerate(board):
        for c, cell in enumerate(row):
            if cell == -2:
                print("not valid: theres an empty cell")
                return False
            elif cell == 0:
                board_connection.find_water((r, c))
                for dr, dc in dir:
                    if is_water(r + dr, c + dc, board):
                        board_connection.union((r, c), (r + dr, c + dc))
            elif cell > 0:
                if (r, c) in lands_checked:
                    print("not valid: Connected islands")
                    return False
                lands_checked.add((r, c))
                queue = [(r, c)]
                area = 1
                while queue:
                    new_queue = []
                    for row, col in queue:
                        for dr, dc in dir:
                            if (
                                is_land(row + dr, col + dc, board)
                                and (row + dr, col + dc) not in lands_checked
                            ):
                                new_queue.append((row + dr, col + dc))
                                lands_checked.add((row + dr, col + dc))
                                area += 1
                    queue = new_queue
                if area != cell:
                    print("not valid: island area not correct at", r, c)
    for r, c in board_connection.parents:
        board_connection.find_water((r, c))
    if board_connection.parent_len() != 1:
        print("not valid: water not connected")
        return False
    # check all 4x4 to see if all water
    for r, row in enumerate(board[:-1]):
        for c, cell in enumerate(row[:-1]):
            if (
                is_water(r, c, board)
                and is_water(r + 1, c, board)
                and is_water(r, c + 1, board)
                and is_water(r + 1, c + 1, board)
            ):
                print("not valid: there is an area of water that is too big")
                return False
    return True


# def insert_into_db():
#     try:
#         sqliteConnection = sqlite3.connect("../api/islands.db")
#         cursor = sqliteConnection.cursor()
#         print("connected!!")

#         rand = random.randint(0, 1000000)
#         query = "INSERT INTO Games (id, size, board, solution) VALUES ({0}, 5, '{1}', '{2}')".format(
#             rand, game.history[0], game.history[-1]
#         )
#         cursor.execute(query)
#         sqliteConnection.commit()
#         print("successfully inserted!")
#         cursor.close()
#     except sqlite3.Error as error:
#         print("failed", error)
#     finally:
#         if sqliteConnection:
#             sqliteConnection.close()
#             print("connection closed")


game = BoardState(testBoard)
# for num, move in enumerate(game.history):
#     print(num)
#     for row in move:
#         print(row)

print(game.history, "\n", len(game.history), "moves made")

if valid_solution(game.history[-1]):
    print("the game has been solved: board", testBoard, "\n", game.history[-1])
    print(random.randint(0, 1000000))
    # insert_into_db()
# print("solution:", game.history[-1])

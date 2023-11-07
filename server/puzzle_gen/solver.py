import copy
import random


class DSU:
    def __init__(self):
        self.parents = {}
        self.size = {}

    def find(self, node):
        if node not in self.parents:
            self.parents[node] = node
            self.size[node] = 1
        if self.parents[node] != node:
            self.parents[node] = self.find(self.parents[node])
        return self.parents[node]

    def get_size(self, node):
        parent = self.find(node)
        return self.size[parent]

    def union(self, node_a, node_b):
        parent_a = self.find(node_a)
        parent_b = self.find(node_b)
        if parent_a != parent_b:
            self.parents[parent_b] = parent_a
            self.size[parent_a] += self.size[parent_b]


class BoardState:
    def __init__(self, board):
        self.size = len(board)
        self.solved = False
        self.empty = set(
            [
                (r, c)
                for r in range(self.size)
                for c in range(self.size)
                if board[r][c] < 0
            ]
        )
        self.remaining_islands = set(
            [
                (r, c)
                for r in range(self.size)
                for c in range(self.size)
                if board[r][c] > 0
            ]
        )
        self.water_DSU = DSU()
        self.land_DSU = DSU()
        for r, c in self.remaining_islands:
            self.land_DSU.find((r, c))
        self.total_land = sum([board[r][c] for (r, c) in self.remaining_islands])
        self.history = [copy.deepcopy(board)]
        self.dir = [(1, 0), (-1, 0), (0, 1), (0, -1)]
        self.dia = [(1, 1), (-1, -1), (-1, 1), (1, -1)]
        self.twos = [(2, 0), (0, 2), (-2, 0), (0, -2)]

        # GAME START
        # for each island, check diagonal and two away, completed
        for r, c in copy.deepcopy(self.remaining_islands):
            self.is_completed_island(r, c)
            self.too_close(r, c)
        for r, c in list(self.empty):
            if not self.close_islands(r, c):
                print(len(self.history), r, c, "no islands nearby")
                self.add_square(r, c, "water")
        # for each empty, check if close to island
        for r, c in list(self.remaining_islands):
            available = self.incomplete_blocked_island(r, c)
            print(len(self.history), "checking avail", r, c, available)
            if len(available) == self.history[0][r][c] - self.land_DSU.get_size((r, c)):
                for ar, ac in available:
                    self.add_square(ar, ac, "land")

    # game start - check diagonals, two aways, completed islands, empty space prox to islands

    # USE TO PLACE SQUARES
    def check_land(self, r, c):
        # connect island to surrounding and identify which numbered island this belongs to before continuing with rest
        self.find_parent_island(r, c)
        self.is_completed_island(r, c)
        self.too_close(r, c)
        surr = self.adj_empties(r, c)
        if len(surr) == 1:
            print(len(self.history), r, c, "no way out for land")
            self.add_square(surr[0][0], surr[0][1], "land")
        # check for completed island, diagonal/2s, isolated land, isolated neighbouring water,

    def check_water(self, r, c):
        self.water_DSU.find((r, c))
        for dr, dc in self.dir:
            if self.is_water(r + dr, c + dc):
                self.water_DSU.union((r, c), (r + dr, c + dc))
                self.big_water_block(r, c)
            if (
                self.is_land(r + dr, c + dc)
                and self.land_DSU.find((r + dr, c + dc)) in self.remaining_islands
            ):
                self.check_land(r + dr, c + dc)
            if (r + dr, c + dc) in self.empty:
                self.isolated_empty(r + dr, c + dc)
        surr = self.adj_empties(r, c)
        if len(surr) == 1:
            print(len(self.history), r, c, "no way out for water")
            self.add_square(surr[0][0], surr[0][1], "water")
        # check for isolated water, isolated adj land,  2x2, isolated empties,

    def add_square(self, r, c, square_type):
        if (r, c) not in self.empty:
            return
        self.empty.remove((r, c))
        next_move = copy.deepcopy(self.history[-1])
        next_move[r][c] = 0 if square_type == "water" else -1
        self.history.append(next_move)
        self.check_complete()
        if self.solved:
            return
        if square_type == "water":
            self.check_water(r, c)
        else:
            self.check_land(r, c)

    # CHECKS DONE WHILE PLACING SQUARES
    # check completed - this is done by seeing if remaining land count == empty (rest is land), or total land == land count (rest is water)
    def check_complete(self):
        if len(self.land_DSU.parents) == self.total_land:
            # rest is water
            self.solved = True
            print("game is finished, rest is water")
            for er, ec in list(self.empty):
                self.add_square(er, ec, "water")

        if len(self.water_DSU.parents) == self.size**2 - self.total_land:
            # rest is land
            self.solved = True
            print(len(self.history), "game is finished, rest is land")
            print(self.empty)
            for er, ec in list(self.empty):
                print("adding last lands", er, ec)
                self.add_square(er, ec, "land")

    # need to do something when island is completed, maybe do another empty check or island check for random lands
    def is_completed_island(self, r, c):
        parent = self.land_DSU.find((r, c))
        pr, pc = parent
        if parent not in self.remaining_islands:
            return
        if self.history[0][pr][pc] == self.land_DSU.get_size(parent):
            print(len(self.history), r, c, "completed island")
            self.remaining_islands.remove((pr, pc))
            surr = self.adj_empties(r, c)
            for sr, sc in surr:
                self.add_square(sr, sc, "water")

    def adj_empties(self, r, c):
        connected = self.return_connected(r, c)
        adj_empty = set()
        for qr, qc in connected:
            for dr, dc in self.dir:
                if (qr + dr, qc + dc) in self.empty:
                    adj_empty.add((qr + dr, qc + dc))
        return list(adj_empty)

    # def isolated empty - check if empty is completed surrounded by water, - becomes water
    def isolated_empty(self, r, c):
        water = land = 0
        for dr, dc in self.dir:
            if (r + dr, c + dc) in self.empty:
                return
            if self.is_water(r + dr, c + dc):
                water += 1
            elif self.is_land(r + dr, c + dc):
                land += 1
        if not water:
            print(len(self.history), r, c, "empty square isolated by land")
            self.add_square(r, c, "land")
        if not land:
            print(len(self.history), r, c, "empty square isolated by water")
            self.add_square(r, c, "water")

    # need to do this check for land as well - cannot have an isolated water filling empty sapce

    # def big water - check if 2x2
    def big_water_block(self, r, c):
        # check the 4 2x2 blocks containing r,c
        for dr, dc in self.dia:
            empty = []
            if (
                self.is_land(r, c + dc)
                or self.is_land(r + dr, c)
                or self.is_land(r + dr, c + dc)
            ):
                continue
            if not (
                self.is_valid(r, c + dc)
                and self.is_valid(r + dr, c)
                and self.is_valid(r + dr, c + dc)
            ):
                continue
            if (r, c + dc) in self.empty:
                empty.append((r, dc + c))
            if (r + dr, c + dc) in self.empty:
                empty.append((r + dr, dc + c))
            if (r + dr, c) in self.empty:
                empty.append((r + dr, c))
            if len(empty) == 1:
                print(len(self.history), "big water at", r, c, empty)
                self.add_square(empty[0][0], empty[0][1], "land")

            # if self.is_water(r + dr, c + dc):
            #     if self.is_water(r, c + dc):
            #         print(len(self.history), r + dr, c, "2x2 blcok of water")
            #         self.add_square(r + dr, c, "land")
            #     if self.is_water(r + dr, c):
            #         print(len(self.history), r, c + dc, "2x2 blcok of water")
            #         self.add_square(r, c + dc, "land")

    # def too close - check diagonals and two aways for disjoint island
    def too_close(self, r, c):
        if self.solved:
            return
        rc_parent = self.land_DSU.find((r, c))
        for dr, dc in self.dia:
            if (
                self.is_land(r + dr, c + dc)
                and self.land_DSU.find((r + dr, c + dc)) != rc_parent
            ):
                print(len(self.history), r, c, "diagonal lands")
                self.add_square(r, c + dc, "water")
                self.add_square(r + dr, c, "water")
        for dr, dc in self.twos:
            if (
                self.is_land(r + dr, c + dc)
                and self.land_DSU.find((r + dr, c + dc)) != rc_parent
            ):
                print(len(self.history), r, c, "lands two away")
                self.add_square(r + dr // 2, c + dc // 2, "water")

    # find_possible island
    def find_parent_island(self, r, c):
        for dr, dc in self.dir:
            if self.is_land(dr + r, dc + c):
                self.land_DSU.union((dr + r, dc + c), (r, c))
            if (dr + r, dc + c) in self.empty:
                self.isolated_empty(dr + r, dc + c)
            # if self.is_water(dr + r, dc + c):
            #     surr = self.adj_empties(dr + r, dc + c)
            #     if len(surr) == 1:
            #         print(len(self.history), r, c, "no way out for water")
            #         self.add_square(surr[0][0], surr[0][1], "water")
        parent = self.land_DSU.find((r, c))
        if parent in self.remaining_islands:
            return
        poss_parents = self.close_islands(r, c)
        if not poss_parents:
            print("something is wrong here. there is no close island to", r, c)
        elif len(poss_parents) == 1:
            print("found a far parent for", r, c, poss_parents)
            pr, pc = poss_parents[0]
            self.land_DSU.union((pr, pc), (r, c))
            self.find_island_paths(pr, pc, r, c)
        else:
            print("there are many poss for this island at", r, c, poss_parents)

    # should be finding possible paths to this parent
    #    how many paths, what is common amongst ALL paths, what cannot be in aANY path

    def find_island_paths(self, pr, pc, r, c):
        paths = []
        parent_land = self.return_connected(pr, pc)
        isolated = self.return_connected(r, c)
        dead_end = set()
        remaining = self.history[0][pr][pc] - len(parent_land) - len(isolated)

        # bfs to explore paths from parent to isolated
        # if a path ends before reaching isoalted, put coords into dead end set
        # if we reach isolated, add to paths
        # if all paths are RA long - then we add land to squares that are in all of those paths
        #       if any dead end coords do not show up in any path - we cant do anything yet, these just not island

    # for 2s - with 2 possible paths beside each other, there must be a water at the corner

    # need to do something similar for incomplete islands - explore what space is available to it - fill if its perfect
    def incomplete_blocked_island(self, r, c):
        queue = self.return_connected(r, c)
        checked = set(queue)
        available = set()
        while queue:
            new_queue = []
            for qr, qc in queue:
                for dr, dc in self.dir:
                    if (qr + dr, qc + dc) in checked:
                        continue
                    checked.add((dr + qr, dc + qc))
                    if self.valid_path(r, c, r, c, dr + qr, dc + qc):
                        new_queue.append((dr + qr, dc + qc))
            queue = new_queue
            available.update(queue)
        return available

    # for each empty, check if path possible islands - if not, water
    def close_islands(self, r, c):
        close_islands = []
        for ir, ic in self.remaining_islands:
            # if rc is island and area of this and ir,ic exceeds that nubmer, skip
            if self.is_land(r, c):
                sizes = self.land_DSU.get_size((r, c)) + self.land_DSU.get_size(
                    (ir, ic)
                )
                if sizes >= self.history[0][ir][ic]:
                    continue
            queue = self.return_connected(ir, ic)
            checked = set(queue)
            remaining_area = self.history[0][ir][ic] - len(queue)
            while queue and remaining_area >= 0:
                if remaining_area == 0 and (r, c) not in queue:
                    break
                new_queue = []
                for qr, qc in queue:
                    for dr, dc in self.dir:
                        if (qr + dr, qc + dc) in checked:
                            continue
                        if qr + dr == r and qc + dc == c:
                            close_islands.append((ir, ic))
                            break
                        if self.valid_path(ir, ic, r, c, qr + dr, qc + dc):
                            new_queue.append((qr + dr, qc + dc))
                        checked.add((qr + dr, qc + dc))
                queue = new_queue
                remaining_area -= 1
        return close_islands

        # find distance to this block
        # if close enough, add to close islands

        # return number of close islands

    # HELPER FUNCTIONS
    def is_valid(self, r, c):
        if 0 <= r < self.size and 0 <= c < self.size:
            return True
        return False

    def is_land(self, r, c):
        if (
            0 <= r < self.size
            and 0 <= c < self.size
            and (self.history[-1][r][c] > 0 or self.history[-1][r][c] == -1)
        ):
            return True
        return False

    def is_water(self, r, c):
        if 0 <= r < self.size and 0 <= c < self.size and (self.history[-1][r][c] == 0):
            return True
        return False

    def return_connected(self, r, c):
        connected = [(r, c)]
        queue = [(r, c)]
        checked = set(connected)
        while queue:
            new_queue = []
            for ir, ic in queue:
                for dr, dc in self.dir:
                    if (ir + dr, ic + dc) in checked:
                        continue
                    if self.is_land(r, c) and self.is_land(ir + dr, ic + dc):
                        new_queue.append((ir + dr, ic + dc))
                    elif self.is_water(r, c) and self.is_water(ir + dr, ic + dc):
                        new_queue.append((ir + dr, ic + dc))
                    checked.add((ir + dr, ic + dc))
            queue = new_queue
            connected += queue
        return connected

    def valid_path(self, ir, ic, lr, lc, r, c):
        if (r, c) not in self.empty:
            return False
        island_parent = self.land_DSU.find((ir, ic))
        orig_parent = (self.size, self.size)
        if (lr, lc) in self.land_DSU.parents:
            orig_parent = self.land_DSU.find((lr, lc))
        for dr, dc in self.dir:
            if self.is_land(r + dr, c + dc):
                obs_parent = self.land_DSU.find((r + dr, c + dc))
                if obs_parent != island_parent and obs_parent != orig_parent:
                    return False
        for dr, dc in self.dia:
            if self.is_land(r + dr, c + dc):
                surr = self.adj_empties(r + dr, c + dc)
                if len(surr) == 2 and (r + dr, c) in surr and (r, c + dc) in surr:
                    return False

        return True

        # check diagonal blocking too


class validDSU:
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


def valid_solution(board):
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

    board_connection = validDSU()
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
                    return False
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

testBoard = [
    [-2, -2, -2, -2, -2, 5, -2],
    [-2, 1, -2, -2, -2, -2, -2],
    [-2, -2, 3, -2, -2, -2, -2],
    [-2, -2, -2, -2, -2, -2, -2],
    [-2, -2, 2, -2, -2, -2, -2],
    [-2, 4, -2, -2, -2, -2, -2],
    [-2, -2, -2, -2, -2, 3, -2],
]

game = BoardState(testBoard)
# for num, move in enumerate(game.history):
#     print(num)
#     for row in move:
#         print(row)

print(game.history, "\n", len(game.history), "moves made")

if valid_solution(game.history[-1]):
    print("the game has been solved: board", testBoard, "\n", game.history[-1])
    id = random.randint(0, 1000000)
    print("sql query")
    query = 'INSERT INTO Games (id, size, board, solution) VALUES ({0}, {1}, "{2}", "{3}")'.format(
        id, game.size, game.history[0], game.history[-1]
    )
    print(query)

    # insert_into_db()
# print("solution:", game.history[-1])

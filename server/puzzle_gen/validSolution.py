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


# testBoard = [[-2, -2, -2, -2, -2],
#     [-2, -2, -2, 1, -2],
#     [3, -2, -2, -2, 5],
#     [-2, 1, -2, -2, -2],
#     [-2, -2, -2, -2, -2]]

testSolution = [
    [0, 0, 0, 0, 0, 0, 0],
    [0, -1, 2, 0, -1, -1, 3],
    [0, 0, 0, 1, 0, 0, 0],
    [0, 1, 0, 0, 0, 3, 0],
    [0, 0, 0, 2, 0, -1, 0],
    [2, -1, 0, -1, 0, -1, 0],
    [0, 0, 0, 0, 0, 0, 0],
]

print(valid_solution(testSolution))

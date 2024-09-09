class Gameboard {
    constructor() {
        this.board = Array(9).fill(null);
    }

    getBoard() {
        return this.board;
    }

    setMark(index, mark) {
        if (this.board[index] === null) {
            this.board[index] = mark;
            return true;
        }
        return false;
    }

    checkWinner() {
        const winningCombos = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        for (const [a, b, c] of winningCombos) {
            if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
                return this.board[a];
            }
        }
        if (this.board.every(cell => cell !== null)) {
            return 'Tie';
        }
        return null;
    }

    reset() {
        this.board = Array(9).fill(null);
    }
}

class Player {
    constructor(name, mark) {
        this.name = name;
        this.mark = mark;
    }
}

class GameController {
    constructor() {
        this.gameboard = new Gameboard();
        this.currentPlayer = new Player('Anas', 'X');
        this.winner = null;
    }

    init() {
        const player1 = new Player('Anas', 'X');
        const player2 = new Player('Ali', 'O');
        this.currentPlayer = player1;

        const boardElement = document.getElementById('board');
        boardElement.innerHTML = '';
        this.gameboard.getBoard().forEach((_, index) => {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.index = index;
            boardElement.appendChild(cell);
        });

        boardElement.addEventListener('click', this.handleClick.bind(this));
        document.getElementById('restart').addEventListener('click', this.restartGame.bind(this));
    }

    handleClick(event) {
        const index = event.target.dataset.index;
        if (index !== undefined && this.gameboard.setMark(parseInt(index), this.currentPlayer.mark)) {
            this.updateBoard();
            this.winner = this.gameboard.checkWinner();
            if (this.winner) {
                this.displayMessage(this.winner);
                document.getElementById('board').removeEventListener('click', this.handleClick.bind(this));
            } else {
                this.switchPlayer();
            }
        }
    }

    switchPlayer() {
        this.currentPlayer = (this.currentPlayer.mark === 'X') 
            ? new Player('Ali', 'O') 
            : new Player('Anas', 'X');
    }

    updateBoard() {
        const cells = document.querySelectorAll('#board .cell');
        this.gameboard.getBoard().forEach((mark, index) => {
            cells[index].textContent = mark;
        });
    }

    displayMessage(message) {
        document.getElementById('message').textContent = (message === 'Tie') 
            ? "It's a tie!" 
            : `${this.currentPlayer.name} wins!`;
    }

    restartGame() {
        this.gameboard.reset();
        this.updateBoard();
        document.getElementById('message').textContent = '';
        this.currentPlayer = new Player('Anas', 'X');
        document.getElementById('board').addEventListener('click', this.handleClick.bind(this));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const gameController = new GameController();
    gameController.init();
});
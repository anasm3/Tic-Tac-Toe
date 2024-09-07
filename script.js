const Gameboard = (() => {
    let board = Array(9).fill(null);

    let getBoard = () => {
        return board;
    };

    let setMark = ((index, mark) => {
        if (board[index] === null) {
            board[index] = mark;
            return true;
        }
        return false;
    });

    let checkWinner = () => {
        const winningCombos = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], 
            [0, 3, 6], [1, 4, 7], [2, 5, 8], 
            [0, 4, 8], [2, 4, 6]              
        ];

        for (const [a, b, c] of winningCombos) {
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a];
            }
        }
        if (board.every(cell => cell !== null)) {
            return 'Tie';
        }
        return null;
    };

    let reset = () => {
        board = Array(9).fill(null);
    }

    return {
        getBoard,
        setMark,
        checkWinner,
        reset
    };
})();

const Player = ((name, mark) => {
    return { name, mark };
});

const GameController = (() => {
    let currentPlayer;
    let winner;

    let init = () => {
        const player1 = Player('Anas', 'X');
        const player2 = Player('Ali', 'O');
        currentPlayer = player1;

        const boardElement = document.getElementById('board');
        boardElement.innerHTML = ''; 
        Gameboard.getBoard().forEach((_, index) => {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.index = index;
            boardElement.appendChild(cell);
        });

        boardElement.addEventListener('click', handleClick);
        document.getElementById('restart').addEventListener('click', restartGame);
    };

    let handleClick = ((event) => {
        const index = event.target.dataset.index;
        if (index !== undefined && Gameboard.setMark(parseInt(index), currentPlayer.mark)) {
            updateBoard();
            winner = Gameboard.checkWinner();
            if (winner) {
                displayMessage(winner);
                document.getElementById('board').removeEventListener('click', handleClick);
            } else {
                switchPlayer();
            }
        }
    });

    let switchPlayer = () => {
        currentPlayer = (currentPlayer.mark === 'X') ? Player('Ali', 'O') : Player('Anas', 'X');
    };

    let updateBoard = () => {
        const cells = document.querySelectorAll('#board .cell');
        Gameboard.getBoard().forEach((mark, index) => {
            cells[index].textContent = mark;
        });
    };

    let displayMessage = ((message) => {
        document.getElementById('message').textContent = (message === 'Tie') ? "It's a tie!" : `${currentPlayer.name} wins!`;
    });

    let restartGame = () => {
        Gameboard.reset();
        updateBoard();
        document.getElementById('message').textContent = '';
        currentPlayer = Player('Anas', 'X');
        document.getElementById('board').addEventListener('click', handleClick);
    }
    return { init };
})();

addEventListener('DOMContentLoaded', () => GameController.init());
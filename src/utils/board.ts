import { BoardState, Moves, BoardResult } from "@utils";

export const printFormateddBoard = (state: BoardState): void => {
    let formattedString = "";
    state.forEach((cell, index) => {
        formattedString += cell ? ` ${cell} |` : "   | ";
        if ((index + 1) % 3 === 0) {
            formattedString = formattedString.slice(0, -1);
            if (index < 8) {
                formattedString += "\n";
                // formattedString += "\n\u2015\u2015\u2015 \n\u2015\u2015\u2015 \n\u2015\u2015\u2015";
            }
        }
    });
};

export const isEmpty = (state: BoardState): boolean => {
    return state.every(cell => cell === null);
};

export const isFull = (state: BoardState): boolean => {
    return state.every(cell => cell);
};

export const getAvailableMoves = (state: BoardState): Moves[] => {
    const moves: Moves[] = [];
    state.forEach((cell, index) => {
        if (cell === null) {
            moves.push(index as Moves);
        }
    });
    return moves;
};

export const isTerminal = (state: BoardState): BoardResult | false => {
    if (isEmpty(state)) return false;
    const winningLines = [
        //Vertical Lines
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        //Horizontal Lines
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        //Diagonal Lines
        [0, 4, 8],
        [2, 4, 6]
    ];
    for (let index = 0; index < winningLines.length; index++) {
        const line = winningLines[index];
        const [cell1, cell2, cell3] = line;
        if (state[cell1] && state[cell1] === state[cell2] && state[cell1] === state[cell3]) {
            const result: BoardResult = {
                winner: state[cell1]
            };
            if (index < 3) {
                result.direction = "H";
                result.row = index === 0 ? 1 : index === 1 ? 2 : 3;
            }
            if (index >= 3 && index <= 5) {
                result.direction = "V";
                result.column = index === 3 ? 1 : index === 4 ? 2 : 3;
            }
            if (index > 5) {
                result.direction = "D";
                result.diagonal = index === 6 ? "MAIN" : "COUNTER";
            }
            return result;
        }
    }
    if (isFull(state)) {
        return {
            winner: null
        };
    }
    return false;
};

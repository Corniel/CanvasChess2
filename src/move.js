import { Square } from './square';

/**
 * A class representing a move on a chessboard.
 *
 * A move typically represents the square that a piece starts on, as well as the square that the piece moves to. In the
 * event of castling, only the king's starting and ending squares are used. The rook's starting and ending squares can
 * be inferred from the position. Similarly, in the event of a capture, the capture information can also be inferred.
 *
 * In the event of a pawn promotion, the promotion piece cannot be inferred from the position. This information may
 * need to be stored in this class in the future, but is not currently stored.
 */
export class Move {
    /**
     * Create a move.
     * @param {Square} startSquare - The starting square of the move.
     * @param {Square} endSquare - The ending square of the move.
     */
    constructor(startSquare, endSquare) {
        if (!startSquare || !endSquare) {
            throw new Error('A move must have a start square and an end square');
        }
        if (!(startSquare instanceof Square && endSquare instanceof Square)) {
            throw new Error('Squares must be of type Square');
        }
        this.startSquare = startSquare;
        this.endSquare = endSquare;
    }
}

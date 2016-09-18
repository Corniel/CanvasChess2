
class Piece {
    /**
     * Create a piece.
     * @param {string} color - The color of the piece: w|b.
     * @throws Will throw an error if color is not provided, or is not a valid color.
     */
    constructor(color) {
        this.color = color;
    }

    /**
     * Get the color.
     * @return {string} The color.
     */
    get color() {
        return this._color;
    }

    /**
     * Set the color.
     * @param {string} color - The color: w|b.
     * @throws Will throw an error if color is not a valid color.
     */
    set color(color) {
        if (!validColor(color)) {
            throw new Error('Invalid color');
        }
        this._color = color;
    }

    /**
     * Determine if the piece is white.
     * @return {boolean} True if the piece is white, otherwise false.
     */
    isWhite() {
        return (this._color === 'w');
    }

    /**
     * Determine if the piece is black.
     * @return {boolean} True if the piece is black, otherwise false.
     */
    isBlack() {
        return (!this.isWhite());
    }

    /**
     * Determine if the pieces matches the provided color.
     * @param {string} The color to match against: w|b.
     * @return {boolean} True if the piece color matches the provided color, otherwise false.
     */
    isColor(color) {
        return (this._color === color);
    }
}

export class Pawn extends Piece {}
export class Knight extends Piece {}
export class Bishop extends Piece {}
export class Rook extends Piece {}
export class Queen extends Piece {}
export class King extends Piece {}

function validColor (c) {
    return (/^w|b$/.test(c));
}


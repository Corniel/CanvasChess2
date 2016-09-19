export class Piece {
    /**
     * Create a piece.
     * @param {string} color - The color of the piece: w|b.
     * @throws Will throw an error if color is not provided, or is not a valid color.
     */
    constructor(color) {
        this.color = color;
    }

    /**
     * Get the type.
     * @return {string} The type: p|n|b|r|q|k.
     */
    get type() {
        return this._type;
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
     * @param {string} color - The color to match against: w|b.
     * @return {boolean} True if the piece color matches the provided color, otherwise false.
     */
    isColor(color) {
        return (this._color === color);
    }

    /**
     * Determine if two pieces are logically equal.
     * @param {Piece} piece - The piece to compare against.
     * @return {boolean} True if the pieces have the same type and color, otherwise false.
     */
    equals(piece) {
        return (this._color === piece._color && this._type === piece._type);
    }

    /**
     * Factory method for creating a piece, when the type is unknown until runtime.
     * @param {string} The piece type and the color. Examples: wp, bn
     * @return {Piece} A piece of the appropriate type.
     */
    static create(pieceAndColor) {
        let pieceType,
            color;

        if (typeof pieceAndColor === 'string' && pieceAndColor.length === 2) {
            pieceType = pieceAndColor.substr(1, 1);
            color = pieceAndColor.substr(0, 1);
        }

        switch (pieceType) {
            case 'p':
                return new Pawn(color);
            case 'n':
                return new Knight(color);
            case 'b':
                return new Bishop(color);
            case 'r':
                return new Rook(color);
            case 'q':
                return new Queen(color);
            case 'k':
                return new King(color);
            default:
                return new NullPiece();
        }
    }
}

export class Pawn extends Piece {
    constructor(color) {
        super(color);
        this._type = 'p';
    }
}

export class Knight extends Piece {
    constructor(color) {
        super(color);
        this._type = 'n';
    }
}

export class Bishop extends Piece {
    constructor(color) {
        super(color);
        this._type = 'b';
    }
}

export class Rook extends Piece {
    constructor(color) {
        super(color);
        this._type = 'r';
    }
}

export class Queen extends Piece {
    constructor(color) {
        super(color);
        this._type = 'q';
    }
}

export class King extends Piece {
    constructor(color) {
        super(color);
        this._type = 'k';
    }
}

export class NullPiece {
    constructor() {
        this.color = '';
        this.type = '';
    }
}

function validColor (c) {
    return (/^w|b$/.test(c));
}


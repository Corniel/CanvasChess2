import * as Piece from './piece';
import { Square } from './square';

/**
 * A class representing a chess position.
 *
 * A position is created from an FEN string (https://en.wikipedia.org/wiki/Forsyth%E2%80%93Edwards_Notation). FEN is a
 * concise and human-readable notation for representing a chess position.
 *
 *   Ex: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
 *
 * This class provides methods for changing the position of the pieces, as well as other game state data. After changes
 * have been made, the position's new FEN is accessible through the fen property.
 */
export class Position {
    /**
     * Create a position.
     * @param {string} fen - The FEN string representing the position.
     * @throws Will throw an error if the FEN is not valid.
     */
    constructor(fen) {
        this.fen = fen;
    }

    /**
     * Get the FEN.
     * @return {string} The FEN.
     */
    get fen() {
        return [
            dataToFenPosition(this._positionArray),
            this._colorToMove,
            dataToFenCastling(this._castleWK, this._castleWQ, this._castleBK, this._castleBQ),
            this._enPassant,
            '0 1'
        ].join(' ');
    }

    /**
     * Set the FEN.
     * @param {string} fen - The FEN.
     */
    set fen(fen) {
        let castling;

        if (!validateFen(fen)) {
            throw new Error('Must have a valid FEN string');
        }

        this._fen = fen;
        this._enPassant = getFenSegmentEnPassant(fen);
        this._colorToMove = getFenSegmentColorToMove(fen);

        castling = getFenSegmentCastling(fen);
        this._castleWK = (castling.indexOf('K') >= 0);
        this._castleWQ = (castling.indexOf('Q') >= 0);
        this._castleBK = (castling.indexOf('k') >= 0);
        this._castleBQ = (castling.indexOf('q') >= 0);

        this._positionArray = setPieces(fen);
    }

    /**
     * Get the en passant square.
     * @return {string} The en passant square in algebraic notation (ex. 'e3').
     */
    get enPassantSquare() {
        return this._enPassant;
    }

    /**
     * Set the en passant square.
     * @param {string} The en passant square in algebraic notation (ex. 'e3').
     */
    set enPassantSquare(square) {
        if (/^[a-h][3-6]$/.test(square)) {
            this._enPassant = square;
        } else {
            this._enPassant = '-';
        }
    }

    /**
     * Determine if White is to move.
     * return {boolean} True if White is to move, otherwise false.
     */
    isWhiteToMove() {
        return (this._colorToMove === 'w');
    }

    /**
     * Determine if Black is to move.
     * return {boolean} True if Black is to move, otherwise false.
     */
    isBlackToMove() {
        return !this.isWhiteToMove();
    }

    /**
     * Determine if Black can castle kingside.
     * @return {boolean} True if Black can castle kingside, otherwise false.
     */
    canBlackCastleKingside() {
        return this._castleBK;
    }

    /**
     * Determine if Black can castle queenside.
     * @return {boolean} True if Black can castle queenside, otherwise false.
     */
    canBlackCastleQueenside() {
        return this._castleBQ;
    }

    /**
     * Determine if White can castle kingside.
     * @return {boolean} True if White can castle kingside, otherwise false.
     */
    canWhiteCastleKingside() {
        return this._castleWK;
    }

    /**
     * Determine if White can castle queenside.
     * @return {boolean} True if White can castle queenside, otherwise false.
     */
    canWhiteCastleQueenside() {
        return this._castleWQ;
    }

    /**
     * Get the color of the player who is to move.
     * @return {string} The color of the player to move: w|b.
     */
    getColorToMove() {
        return this._colorToMove;
    }

    /**
     * Get the color of the player who is NOT to move.
     * @return {string} The color of the player NOT to move: w|b.
     */
    getColorNotToMove() {
        return (this._colorToMove === 'w') ? 'b' : 'w';
    }

    /**
     * Set Black as the player to move.
     */
    setBlackToMove() {
        this._colorToMove = 'b';
    }

    /**
     * Set White as the player to move.
     */
    setWhiteToMove() {
        this._colorToMove = 'w';
    }

    /**
     * Set Black's ability to castle kingside.
     * @param {boolean} [canCastle=true] Whether or not Black can castle on the kingside.
     */
    setBlackCastleKingside(canCastle = true) {
        this._castleBK = (canCastle === true);
    }

    /**
     * Set Black's ability to castle queenside.
     * @param {boolean} [canCastle=true] Whether or not Black can castle on the queenside.
     */
    setBlackCastleQueenside(canCastle = true) {
        this._castleBQ = (canCastle === true);
    }

    /**
     * Set White's ability to castle kingside.
     * @param {boolean} [canCastle=true] Whether or not White can castle on the kingside.
     */
    setWhiteCastleKingside(canCastle = true) {
        this._castleWK = (canCastle === true);
    }

    /**
     * Set White's ability to castle queenside.
     * @param {boolean} [canCastle=true] Whether or not White can castle on the queenside.
     */
    setWhiteCastleQueenside(canCastle = true) {
        this._castleWQ = (canCastle === true);
    }

    /**
     * Get the piece on a given square.
     * @param {Square} square - The square look at when retrieving a piece.
     * @return {Piece} The piece.
     */
    getPiece(square) {
        let x = square.file,
            y = square.rank,
            pieceAndColor;

        x = x.charCodeAt(0) - 97,
        y = 8 - y;

        if (y === false || y < 0 || x < 0 || y >= this._positionArray.length || x >= this._positionArray[y].length) {
            return null;
        }

        pieceAndColor = this._positionArray[y][x];

        return Piece.create(pieceAndColor); 
    }

    /**
     * Set the piece on a given square.
     * @param {Square|string} square - The square to place the piece on.
     * @param {Piece|string} piece - The piece to place on the square.
     */
    setPiece(square, piece) {
        let x,
            y;

        if (typeof square === 'string') {
            square = new Square(square);
        }

        if (typeof piece === 'string') {
            piece = Piece.create(piece);
        }

        x = square.file;
        y = square.rank;

        x = x.charCodeAt(0) - 97;
        y = 8 - y;

        this._positionArray[y][x] = piece.color + piece.type;
    }

    /**
     * Find all squares containing a piece.
     * @param {Piece} piece - The piece to search for.
     * @return {Square[]} An array containing all of the squares that have the given piece.
     */
    findPiece(piece) {
        let squares = [];

        for (let i = 0; i < this._positionArray.length; i++) {
            for (let j = 0; j < this._positionArray[i].length; j++) {
                if (this._positionArray[i][j] === piece.color + piece.type) {
                    squares.push(new Square(getSquareName(j, i)));
                }
            }
        }

        return squares;
    }

}

function validateFen(fen) {
    return /\s+([wbWB])\s+([-kqKQ]+)\s+([-\w]{1,2})\s+(\d+)\s+(\d+)\s*$/.test(fen);
}

function getFenSegmentCastling(fen) {
    return fen.split(' ')[2];
}

function getFenSegmentColorToMove(fen) {
    return fen.split(' ')[1];
}

function getFenSegmentEnPassant(fen) {
    return fen.split(' ')[3];
}

function getFenSegmentPosition(fen) {
    return fen.split(' ')[0];
}

function setPieces(fen) {
    let positionArray,
        alphaConversion = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
        i = 0,
        j = 0,
        k = 0,
        fenRows,
        file,
        rowItem,
        startingIndex = 0;

    positionArray = getEmptyPositionArray();

    if (fen === undefined || typeof fen !== 'string' && !(fen instanceof string)) {
        return;
    }

    fenRows = getFenSegmentPosition(fen).split('/');

    for (i = 0; i < fenRows.length; i += 1) {
        for (j = 0; j < fenRows[i].length; j += 1) {
            rowItem = fenRows[i].charAt(j);
            // Get starting index
            for (k = 0; k < positionArray[i].length; k += 1) {
                if (positionArray[i][k] === '-') {
                    startingIndex = k;
                    k = positionArray[i].length; // break
                }
            }
            if (/^[0-9]$/.test(rowItem)) {
                // Empty square(s)
                for (k = 0; k < parseInt(rowItem, 10); k += 1) {
                    positionArray[i][k + startingIndex] = '';
                }
            } else {
                file = alphaConversion[startingIndex];
                positionArray[i][startingIndex] = fenToDataPiece(rowItem, file);
            }
        }
    }

    return positionArray;
}

function fenToDataPiece(piece, file) {
    var color = 'w'
        file = '';

    if (/^[kqrbnp]$/.test(piece)) {
        color = 'b';
    }
    piece = piece.toLowerCase();
    if (piece === 'p') {
        // TODO Remove file
        piece += file;
    }

    return color + piece;
}

function getSquareName(x, y) {
    let file = String.fromCharCode(x + 97),
        rank = 8 - y;
    return (file + rank);
}

function dataToFenCastling(castleWK, castleWQ, castleBK, castleBQ) {
    let castling = '';

    if (castleWK) {
        castling += 'K';
    }
    if (castleWQ) {
        castling += 'Q';
    }
    if (castleBK) {
        castling += 'k';
    }
    if (castleBQ) {
        castling += 'q';
    }

    return (castling === '' ? '-' : castling);
}

function dataToFenPosition(positionArray) {
    let rows = [];

    for (let rowNumber = 0; rowNumber < positionArray.length; rowNumber += 1) {
        rows.push(dataToFenPositionRow(positionArray, rowNumber));
    }

    return rows.join('/');
}

function dataToFenPositionRow(positionArray, rowNumber) {
    let piece,
        row = '';

    for (let columnNumber = 0; columnNumber < positionArray[rowNumber].length; columnNumber += 1) {
        piece = dataToFenPiece(positionArray[rowNumber][columnNumber]);
        row = updateOrAppendToFenPositionRow(row, piece);
    }

    return row;
}

function updateOrAppendToFenPositionRow(row, piece) {
    let emptySquares = 0;

    if (piece === '') {
        if (row.length > 0) {
            emptySquares = row.slice(-1);
            if (/^[1-7]$/.test(emptySquares)) {
                emptySquares = parseInt(emptySquares, 10);
            } else {
                emptySquares = 0;
            }
            if (emptySquares > 0) {
                row = row.slice(0, row.length - 1);
            }
        }
        row += (++emptySquares + '');
    } else {
        row += piece;
    }

    return row;
}

function dataToFenPiece(dataPiece) {
    let color,
        fenPiece;

    // TODO: Figure out why dataPiece is sometimes NaN. This should never happen.
    if (!dataPiece) {
        return dataPiece;
    }

    color = dataPiece.substr(0, 1);
    fenPiece = dataPiece.substr(1, 1);

    if (color === 'w') {
        fenPiece = fenPiece.toUpperCase();
    }

    return fenPiece;
}

function getEmptyPositionArray() {
    return [
        ['-', '-', '-', '-', '-', '-', '-', '-'],
        ['-', '-', '-', '-', '-', '-', '-', '-'],
        ['-', '-', '-', '-', '-', '-', '-', '-'],
        ['-', '-', '-', '-', '-', '-', '-', '-'],
        ['-', '-', '-', '-', '-', '-', '-', '-'],
        ['-', '-', '-', '-', '-', '-', '-', '-'],
        ['-', '-', '-', '-', '-', '-', '-', '-'],
        ['-', '-', '-', '-', '-', '-', '-', '-']
    ];
}

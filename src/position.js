import { Piece } from './piece';
import { Square } from './square';

export class Position {
    constructor(fen) {
        this.fen = fen;
    }

    get fen() {
        return this._fen;
    }

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

    get enPassantSquare() {
        return this._enPassant;
    }

    isWhiteToMove() {
        return (this._colorToMove === 'w');
    }

    isBlackToMove() {
        return !this.isWhiteToMove();
    }

    canBlackCastleKingside() {
        return this._castleBK;
    }

    canBlackCastleQueenside() {
        return this._castleBQ;
    }

    canWhiteCastleKingside() {
        return this._castleWK;
    }

    canWhiteCastleQueenside() {
        return this._castleWQ;
    }

    getColorToMove() {
        return this._colorToMove;
    }

    getColorNotToMove() {
        return (this._colorToMove === 'w') ? 'b' : 'w';
    }

    setBlackToMove() {
        this._colorToMove = 'b';
    }

    setWhiteToMove() {
        this._colorToMove = 'w';
    }

    setBlackCastleKingside() {
        this._castleBK = true;
    }

    setBlackCastleQueenside() {
        this._castleBQ = true;
    }

    setWhiteCastleKingside() {
        this._castleWK = true;
    }

    setWhiteCastleQueenside() {
        this._castleWQ = true;
    }

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

    setPiece(square, piece) {
        let x = square.file,
            y = square.rank;

        x = x.charCodeAt(0) - 97;
        y = 8 - y;

        this._positionArray[y][x] = piece.color + piece.type;
    }

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

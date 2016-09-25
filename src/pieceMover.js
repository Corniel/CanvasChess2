import { Square } from './square';
import { Move } from './move';
import { Position } from './position';
import * as Piece from './piece';

export class PieceMover {
    /**
     * Create a PieceMover for a given position.
     * @param {Position} position - The initial position.
     */
    constructor(position) {
        this._position = position;
    }

    /**
     * Play the move.
     * @param {Move} move - The move to be played.
     * @param {Piece} [promotionPiece] - The piece that a pawn should promote to, if relevant.
     */
    playMove(move, promotionPiece) {
        let capturedPiece,
            piece,
            startSquare,
            endSquare;

        startSquare = move.startSquare.clone();
        endSquare = move.endSquare.clone();
        capturedPiece = this._position.getPiece(endSquare);
        piece = this._position.getPiece(startSquare);

        movePiece(this._position, startSquare, endSquare, piece);

        if (piece instanceof Piece.Pawn) {
            if (Math.abs(startSquare.diffRank(endSquare)) === 2) {
                setNewEnPassantSquare(this._position, startSquare);
            } else if (endSquare.rank === '1' || endSquare.rank === '8') {
                promotePawn(this._position, endSquare, promotionPiece || 'Q');
            } else if (!startSquare.isSameFile(endSquare) && capturedPiece instanceof Piece.NullPiece) {
                removeEnPassantPiece(this._position, endSquare);
            }
        }

        if (piece instanceof Piece.King) {
            disableKingsideCastling(this._position, piece);
            disableQueensideCastling(this._position, piece);

            if (piece instanceof Piece.King && startSquare.file === 'e') {
                if (endSquare.file === 'g') {
                    castleKingsideWithRook(this._position, startSquare);
                } else if (endSquare.file === 'c') {
                    castleQueensideWithRook(this._position, startSquare);
                }
            }
        }

        if (piece instanceof Piece.Rook) {
            if (startSquare.name === 'h1' || startSquare.name === 'h8') {
                disableKingsideCastling(this._position, piece);
            } else if (startSquare.name === 'a1' || startSquare.name === 'a8') {
                disableQueensideCastling(this._position, piece);
            }
        }

        if (capturedPiece instanceof Piece.Rook) {
            if (endSquare.name === 'a1' || endSquare.name === 'a8') {
                disableQueensideCastling(this._position, capturedPiece);
            } else if (endSquare.name === 'h1' || endSquare.name === 'h8') {
                disableKingsideCastling(this._position, capturedPiece);
            }
        }

        if (this._position.isWhiteToMove()) {
            this._position.setBlackToMove();
        } else {
            this._position.setWhiteToMove();
        }
    }
}

function movePiece(position, startSquare, endSquare, piece) {
    position.setPiece(endSquare, piece);
    position.setPiece(startSquare, new Piece.NullPiece());
    position.enPassantSquare = '';
}

function setNewEnPassantSquare(position, startSquare) {
    let newEnPassantSquare = startSquare.clone(),
        pawnDirection = (startSquare.rank === '2') ? 1 : -1;

    newEnPassantSquare.addRank(pawnDirection);
    position.enPassantSquare = newEnPassantSquare.toString();
}

function promotePawn(position, endSquare, promotionPiece) {
    let color = (endSquare.rank === '8' ? 'w' : 'b');

    if (/^[QRBN]$/.test(promotionPiece)) {
        promotionPiece = promotionPiece.toLowerCase();
        position.setPiece(endSquare, Piece.create(color + promotionPiece));
    }
}

function removeEnPassantPiece(position, endSquare) {
    let enPassantSquare = endSquare.clone(),
        pawnDirection = (endSquare.rank === '6' ? 1 : -1);

    enPassantSquare.addRank(-pawnDirection);
    position.setPiece(enPassantSquare, new Piece.NullPiece());
}

function castleKingsideWithRook(position, startSquare) {
    let rank = startSquare.rank,
        piece = position.getPiece(new Square('h' + rank));

    position.setPiece(new Square('f' + rank), piece);
    position.setPiece(new Square('h' + rank), new Piece.NullPiece);
}

function castleQueensideWithRook(position, startSquare) {
    let rank = startSquare.rank,
        piece = position.getPiece(new Square('a' + rank));

    position.setPiece(new Square('d' + rank), piece);
    position.setPiece(new Square('a' + rank), new Piece.NullPiece);
}

function disableKingsideCastling(position, piece) {
    if (piece.isWhite()) {
        position.setWhiteCastleKingside(false);
    } else {
        position.setBlackCastleKingside(false);
    }
}

function disableQueensideCastling(position, piece) {
    if (piece.isWhite()) {
        position.setWhiteCastleQueenside(false);
    } else {
        position.setBlackCastleQueenside(false);
    }
}

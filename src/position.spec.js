/* eslint-env jasmine */

import { Position } from './position';
import { Square } from './square';
import { Bishop, Rook, King, NullPiece } from './piece';

describe('Position', () => {

    describe('Creating a new position', () => {

        it('is created with an FEN string', () => {
            let fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
                position = new Position(fen);
            expect(position.fen).toBe(fen);
        });

        it('cannot be created with an invalid FEN', () => {
            expect(() => { new Position(); }).toThrow();
            expect(() => { new Position(''); }).toThrow();
            expect(() => { new Position('fen'); }).toThrow();
        });

        it('must include the color to move', () => {
            // Trucated at color to move
            expect(() => { new Position('8/8/8/8/8/8/8/8'); }).toThrow();
            // Omit color to move
            expect(() => { new Position('8/8/8/8/8/8/8/8 - - 0 1'); }).toThrow();
            // Replace color to move with hypen
            expect(() => { new Position('8/8/8/8/8/8/8/8 - - - 0 1'); }).toThrow();
        });

        it('must include the castling options', () => {
            // Truncated at castling options 
            expect(() => { new Position('8/8/8/8/8/8/8/8 w'); }).toThrow();
            // Omit castling options
            expect(() => { new Position('8/8/8/8/8/8/8/8 w - 0 1'); }).toThrow();
        });

        it('allows a hypen in place of castling options', () => {
            expect(() => { new Position('8/8/8/8/8/8/8/8 w - - 0 1'); }).not.toThrow();
        });

        it('allows any combination of castling options', () => {
            expect(() => { new Position('8/8/8/8/8/8/8/8 w K - 0 1'); }).not.toThrow();
            expect(() => { new Position('8/8/8/8/8/8/8/8 w q - 0 1'); }).not.toThrow();
            expect(() => { new Position('8/8/8/8/8/8/8/8 w Qq - 0 1'); }).not.toThrow();
        });

        it('must include the en passant square', () => {
            // Trucated at en passant square
            expect(() => { new Position('8/8/8/8/8/8/8/8 w KQkq'); }).toThrow();
            // Omit en passant square
            expect(() => { new Position('8/8/8/8/8/8/8/8 w KQkq 0 1'); }).toThrow();
        });

        it('accepts an en passant square in algebraic notation', () => {
            expect(() => { new Position('8/8/8/8/8/8/8/8 w KQkq e3 0 1'); }).not.toThrow();
        });

    });

    describe('Querying the position state', () => {

        it('knows which color is to move', () => {
            let position = new Position('8/8/8/8/8/8/8/8 w KQkq - 0 1');
            expect(position.isWhiteToMove()).toBe(true);
            expect(position.isBlackToMove()).toBe(false);

            position = new Position('8/8/8/8/8/8/8/8 b KQkq - 0 1');
            expect(position.isWhiteToMove()).toBe(false);
            expect(position.isBlackToMove()).toBe(true);
        });

        it('can return the color to move', () => {
            let position = new Position('8/8/8/8/8/8/8/8 w KQkq - 0 1');
            expect(position.getColorToMove()).toBe('w');
            expect(position.getColorNotToMove()).toBe('b');
        });

        it('knows which side can castle', () => {
            let position = new Position('8/8/8/8/8/8/8/8 w KQkq - 0 1');
            expect(position.canBlackCastleKingside()).toBe(true);
            expect(position.canBlackCastleQueenside()).toBe(true);
            expect(position.canWhiteCastleKingside()).toBe(true);
            expect(position.canWhiteCastleQueenside()).toBe(true);

            position = new Position('8/8/8/8/8/8/8/8 w - - 0 1');
            expect(position.canBlackCastleKingside()).toBe(false);
            expect(position.canBlackCastleQueenside()).toBe(false);
            expect(position.canWhiteCastleKingside()).toBe(false);
            expect(position.canWhiteCastleQueenside()).toBe(false);
        });

        it('knows the en passant square', () => {
            let position = new Position('8/8/8/8/8/8/8/8 w KQkq d3 0 1');
            expect(position.enPassantSquare).toBe('d3');
        });

    });

    describe('Changing the position state', () => {

        it('can set the color to move', () => {
            let position = new Position('8/8/8/8/8/8/8/8 w - - 0 1');

            position.setBlackToMove();
            expect(position.isBlackToMove()).toBe(true);

            position.setWhiteToMove();
            expect(position.isWhiteToMove()).toBe(true);
        });

        it('can set the castling options', () => {
            let position = new Position('8/8/8/8/8/8/8/8 w - - 0 1');

            position.setBlackCastleKingside(true);
            position.setBlackCastleQueenside(true);
            position.setWhiteCastleKingside(true);
            position.setWhiteCastleQueenside(true);

            expect(position.canBlackCastleKingside()).toBe(true);
            expect(position.canBlackCastleQueenside()).toBe(true);
            expect(position.canWhiteCastleKingside()).toBe(true);
            expect(position.canWhiteCastleQueenside()).toBe(true);
        });

    });

    describe('Changing the location of the pieces', () => {

        it('can retrieve the piece on a given square', () => {
            let position = new Position('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'),
                piece = position.getPiece(new Square('a1'));

            expect(piece.equals(new Rook('w'))).toBe(true);
        });

        it('can retrieve a null piece on an empty square', () => {
            let position = new Position('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'),
                piece = position.getPiece(new Square('e4'));

            expect(piece instanceof NullPiece).toBe(true);
        });

        it('can add pieces', () => {
            let position = new Position('8/8/8/8/8/8/8/8 w - - 0 1'),
                square = new Square('e1'),
                piece = new King('w');

            position.setPiece(square, piece);
            expect(position.getPiece(square).equals(piece)).toBe(true);
        });

        it('can return a list of squares containing a given piece', () => {
            let position = new Position('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'),
                squares = position.findPiece(new Bishop('w'));

            expect(squares.length).toBe(2);
            expect(squares[0].name).toBe('c1');
            expect(squares[1].name).toBe('f1');
        });

        it('updates the fen after the position has changed', () => {
            let position = new Position('8/8/8/8/8/8/8/8 w - - 0 1');
            position.setPiece(new Square('a1'), new Rook('w'));
            position.setPiece(new Square('h1'), new Rook('w'));
            position.setPiece(new Square('a8'), new Rook('b'));
            position.setPiece(new Square('h8'), new Rook('b'));
            expect(position.fen).toBe('r6r/8/8/8/8/8/8/R6R w - - 0 1');
        });

        it('allows string representations of squares and pieces', () => {
            let position = new Position('8/8/8/8/8/8/8/8 w - - 0 1');
            position.setPiece('a1', 'wr');
            position.setPiece('a8', 'br');
            expect(position.fen).toBe('r7/8/8/8/8/8/8/R7 w - - 0 1');

            position.setPiece('a1', '');
            position.setPiece('a8', '');
            expect(position.fen).toBe('8/8/8/8/8/8/8/8 w - - 0 1');
        });

    });

});

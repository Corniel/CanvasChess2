/* eslint-env jasmine */

import { Piece, Pawn, Knight, Bishop, Rook, Queen, King, NullPiece } from './piece';

describe('Piece', () => {

    it('has a color', () => {
        let bishop = new Bishop('w');

        expect(bishop.isWhite()).toBe(true);
        expect(bishop.isBlack()).toBe(false);

        expect(bishop.isColor('w')).toBe(true);
        expect(bishop.isColor('b')).toBe(false);

        expect(bishop.color).toBe('w');
    });

    it('cannot have an invalid color', () => {
        expect(() => { new Pawn(''); }).toThrow();
        expect(() => { new Knight('W'); }).toThrow();
        expect(() => { new Bishop('black'); }).toThrow();
    });

    it('has a type', () => {
        expect(new Pawn('w').type).toBe('p');
        expect(new Knight('w').type).toBe('n');
        expect(new Bishop('w').type).toBe('b');
        expect(new Rook('w').type).toBe('r');
        expect(new Queen('w').type).toBe('q');
        expect(new King('w').type).toBe('k');
        expect(new NullPiece().type).toBe('');
    });

    it('can create a piece from a string', () => {
        let pawn = Piece.create('wp'),
            knight = Piece.create('bn'),
            bishop = Piece.create('wb'),
            rook = Piece.create('br'),
            queen = Piece.create('wq'),
            king = Piece.create('bk'),
            nullPiece = Piece.create('');

        expect(pawn instanceof Pawn).toBe(true);
        expect(knight instanceof Knight).toBe(true);
        expect(bishop instanceof Bishop).toBe(true);
        expect(rook instanceof Rook).toBe(true);
        expect(queen instanceof Queen).toBe(true);
        expect(king instanceof King).toBe(true);
        expect(nullPiece instanceof NullPiece).toBe(true);
    });

    it('can be compared to another piece for logical equality', () => {
        let whiteQueen = new Queen('w'),
            whiteRook = new Rook('w'),
            blackQueen = new Queen('b'),
            anotherWhiteQueen = new Queen('w');

        expect(whiteQueen.equals(whiteRook)).toBe(false);
        expect(whiteQueen.equals(blackQueen)).toBe(false);
        expect(whiteQueen.equals(anotherWhiteQueen)).toBe(true);
    });

});

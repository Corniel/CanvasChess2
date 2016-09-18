/* eslint-env jasmine */

import { Pawn, Knight, Bishop } from './piece';

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

});

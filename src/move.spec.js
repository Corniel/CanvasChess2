/* eslint-env jasmine */

import { Move } from './move';
import { Square } from './square';

describe('Move', () => {

    it ('sets the start and end squares', () => {
        let startSquare = new Square('a1'),
            endSquare = new Square('a2'),
            move = new Move(startSquare, endSquare);

        expect(move.startSquare).toBe(startSquare);
        expect(move.endSquare).toBe(endSquare);
    });

    it ('throws an error when squares are not set', () => {
        expect(() => { new Move(); }).toThrow();
        expect(() => { new Move(new Square('a1')); }).toThrow();
        expect(() => { new Move('', ''); }).toThrow();
    });

    it ('must be initialized with Square objects', () => {
        expect(() => { new Move('a1', 'a2'); }).toThrow();
    });

});

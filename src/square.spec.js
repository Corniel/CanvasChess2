/* eslint-env jasmine */

import { Square } from './square';

describe('Square', () => {

    describe('Creating a square with a name', () => {

        it('has a name', () => {
            let square = new Square('e4');
            expect(square.name).toBe('e4');
        });

        it('must have a name', () => {
            expect(() => { new Square(); }).toThrow();
            expect(() => { new Square(''); }).toThrow();
        });

        it('cannot have its name removed', () => {
            let square = new Square('e4');
            expect(() => { square.name = ''; }).toThrow();
        });

        it('must have a valid square name', () => {
            expect(() => { new Square('4e'); }).toThrow();
            expect(() => { new Square('e10'); }).toThrow();
        });

        it('cannot have capital letters', () => {
            expect(() => { new Square('E4'); }).toThrow();
        });

        it('cannot have its name changed to an invalid name', () => {
            let square = new Square('e4');
            expect(() => { square.name = '4e'; }).toThrow();
        });

        it('can be turned into a string', () => {
            let square = new Square('e4');
            expect('name: ' + square).toBe('name: e4');
        });

    });

    describe('Modifying file and/or rank', () => {

        it('can return its file', () => {
            let square = new Square('a1');
            expect(square.file).toBe('a');
        });

        it('can change its file', () => {
            let square = new Square('a1');
            square.file = 'h';
            expect(square.name).toBe('h1');
        });

        it('cannot change its file to an invalid file', () => {
            let square = new Square('a1');
            expect(() => { square.file = 'i'; }).toThrow();
        });

        it('can return its rank', () => {
            let square = new Square('a1');
            expect(square.rank).toBe('1');
        });

        it('can change its rank', () => {
            let square = new Square('a1');
            square.rank = '8';
            expect(square.name).toBe('a8');
        });

        it('cannot accept a numeric rank', () => {
            let square = new Square('a1');
            expect(() => { square.rank = 2; }).toThrow();
        });

        it('cannot change its rank to an invalid rank', () => {
            let square = new Square('a1');
            expect(() => { square.rank = '9'; }).toThrow();
        });

        it('can increment its file', () => {
            let square = new Square('a1');
            square.addFile(4);
            expect(square.name).toBe('e1');
        });

        it('cannot increment its file past the edge of the board', () => {
            let square = new Square('h1');
            expect(() => { square.addFile(1); }).toThrow();
        });

        it('can decrement its file', () => {
            let square = new Square('h1');
            square.addFile(-4);
            expect(square.name).toBe('d1');
        });

        it('cannot decrement its file past the edge of the board', () => {
            let square = new Square('a1');
            expect(() => { square.addFile(-1); }).toThrow();
        });

        it('can increment its rank', () => {
            let square = new Square('a1');
            square.addRank(4);
            expect(square.name).toBe('a5');
        });

        it('cannot increment its rank past the edge of the board', () => {
            let square = new Square('a8');
            expect(() => { square.addRank(1); }).toThrow();
        });

        it('can decrement its rank', () => {
            let square = new Square('a8');
            square.addRank(-4);
            expect(square.name).toBe('a4');
        });

        it('cannot decrement its rank past the edge of the board', () => {
            let square = new Square('a1');
            expect(() => { square.addRank(-1); }).toThrow();
        });

    });

    describe('Comparisons', () => {

        it('can check if two squares have the same file', () => {
            let square1 = new Square('e1'),
                square2 = new Square('e8'),
                square3 = new Square('f1');

            expect(square1.isSameFile(square2)).toBe(true);
            expect(square1.isSameFile(square3)).toBe(false);
        });

        it('can check if two squares have the same rank', () => {
            let square1 = new Square('a4'),
                square2 = new Square('h4'),
                square3 = new Square('a5');

            expect(square1.isSameRank(square2)).toBe(true);
            expect(square1.isSameRank(square3)).toBe(false);
        });

        it('can count the number of files between two squares', () => {
            let square1 = new Square('a1'),
                square2 = new Square('h1');

            expect(square1.diffFile(square2)).toBe(7);
        });

        it('can count the number of files (and direction) between two squares', () => {
            let square1 = new Square('a1'),
                square2 = new Square('h1');

            expect(square2.diffFile(square1)).toBe(-7);
        });

        it('can count the number of ranks between two squares', () => {
            let square1 = new Square('a1'),
                square2 = new Square('a8');

            expect(square1.diffRank(square2)).toBe(7);
        });

        it('can count the number of ranks (and direction) between two squares', () => {
            let square1 = new Square('a1'),
                square2 = new Square('a8');

            expect(square2.diffRank(square1)).toBe(-7);
        });

        it('can determine if a square is a bishop move away', () => {
            let square1 = new Square('e4'),
                square2 = new Square('d3'),
                square3 = new Square('g2'),
                square4 = new Square('h7'),
                square5 = new Square('a8'),
                square6 = new Square('e5');

            expect(square1.isBishopMove(square2)).toBe(true);
            expect(square1.isBishopMove(square3)).toBe(true);
            expect(square1.isBishopMove(square4)).toBe(true);
            expect(square1.isBishopMove(square5)).toBe(true);
            expect(square1.isBishopMove(square6)).toBe(false);
            expect(square1.isBishopMove(square1)).toBe(false);
        });

        it('can determine if a square is a king move away', () => {
            let square1 = new Square('e4'),
                square2 = new Square('e5'),
                square3 = new Square('f5'),
                square4 = new Square('f4'),
                square5 = new Square('f3'),
                square6 = new Square('e3'),
                square7 = new Square('d3'),
                square8 = new Square('d4'),
                square9 = new Square('d5'),
                square10 = new Square('e8');

            expect(square1.isKingMove(square2)).toBe(true);
            expect(square1.isKingMove(square3)).toBe(true);
            expect(square1.isKingMove(square4)).toBe(true);
            expect(square1.isKingMove(square5)).toBe(true);
            expect(square1.isKingMove(square6)).toBe(true);
            expect(square1.isKingMove(square7)).toBe(true);
            expect(square1.isKingMove(square8)).toBe(true);
            expect(square1.isKingMove(square9)).toBe(true);
            expect(square1.isKingMove(square10)).toBe(false);
            expect(square1.isKingMove(square1)).toBe(false);
        });

        it('can determine if a square is a knight move away', () => {
            let square1 = new Square('e4'),
                square2 = new Square('f6'),
                square3 = new Square('g5'),
                square4 = new Square('g3'),
                square5 = new Square('f2'),
                square6 = new Square('d2'),
                square7 = new Square('c3'),
                square8 = new Square('c5'),
                square9 = new Square('d6'),
                square10 = new Square('e5'),
                square11 = new Square('f5'),
                square12 = new Square('c4');

            expect(square1.isKnightMove(square2)).toBe(true);
            expect(square1.isKnightMove(square3)).toBe(true);
            expect(square1.isKnightMove(square4)).toBe(true);
            expect(square1.isKnightMove(square5)).toBe(true);
            expect(square1.isKnightMove(square6)).toBe(true);
            expect(square1.isKnightMove(square7)).toBe(true);
            expect(square1.isKnightMove(square8)).toBe(true);
            expect(square1.isKnightMove(square9)).toBe(true);
            expect(square1.isKnightMove(square10)).toBe(false);
            expect(square1.isKnightMove(square11)).toBe(false);
            expect(square1.isKnightMove(square12)).toBe(false);
            expect(square1.isKnightMove(square1)).toBe(false);
        });

        it('can determine if a square is a queen move away', () => {
            let square1 = new Square('e4'),
                square2 = new Square('d3'),
                square3 = new Square('g2'),
                square4 = new Square('h7'),
                square5 = new Square('a8'),
                square6 = new Square('e3'),
                square7 = new Square('g4'),
                square8 = new Square('e7'),
                square9 = new Square('a4'),
                square10 = new Square('d5'),
                square11 = new Square('c3');

            expect(square1.isQueenMove(square2)).toBe(true);
            expect(square1.isQueenMove(square3)).toBe(true);
            expect(square1.isQueenMove(square4)).toBe(true);
            expect(square1.isQueenMove(square5)).toBe(true);
            expect(square1.isQueenMove(square6)).toBe(true);
            expect(square1.isQueenMove(square7)).toBe(true);
            expect(square1.isQueenMove(square8)).toBe(true);
            expect(square1.isQueenMove(square9)).toBe(true);
            expect(square1.isQueenMove(square10)).toBe(true);
            expect(square1.isQueenMove(square11)).toBe(false);
            expect(square1.isQueenMove(square1)).toBe(false);
        });

        it('can determine if a square is a rook move away', () => {
            let square1 = new Square('e4'),
                square2 = new Square('e3'),
                square3 = new Square('g4'),
                square4 = new Square('e7'),
                square5 = new Square('a4'),
                square6 = new Square('d5');

            expect(square1.isRookMove(square2)).toBe(true);
            expect(square1.isRookMove(square3)).toBe(true);
            expect(square1.isRookMove(square4)).toBe(true);
            expect(square1.isRookMove(square5)).toBe(true);
            expect(square1.isRookMove(square6)).toBe(false);
            expect(square1.isRookMove(square1)).toBe(false);
        });

    });

    it('can produce a clone of itself', () => {
        let square = new Square('a1'),
            clone = square.clone();
        expect(clone.name).toBe('a1');
    });

    it('can advance one step toward a new square', () => {
        let square = new Square('a1'),
            destination = new Square('h8');
        square.stepTo(destination);
        expect(square.name).toBe('b2');
    });

    it('cannot advance toward a square that is not a queen move away', () => {
        let square = new Square('a1'),
            destination = new Square('e8');
        expect(square.stepTo(destination)).toBe(false);
    });

    it('can return all 64 squares', () => {
        let squares = Square.getAllSquares();
        expect(squares.length).toBe(64);
        expect(squares).toEqual(jasmine.arrayContaining(
            [new Square('a1'), new Square('c3'), new Square('f6'), new Square('h8')]
        ));
    });

});

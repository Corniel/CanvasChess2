/* eslint-env jasmine */

import { Square } from './square';
import { Move } from './move';
import { Position } from './position';
import { PieceMover } from './pieceMover';

describe('PieceMover', () => {

    it('can move a pawn one square', () => {
        let position = new Position('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'),
            pieceMover = new PieceMover(position);

        // White
        pieceMover.playMove(getMove('e2', 'e3'));
        expect(position.fen).toBe('rnbqkbnr/pppppppp/8/8/8/4P3/PPPP1PPP/RNBQKBNR b KQkq - 0 1');

        // Black
        pieceMover.playMove(getMove('e7', 'e6'));
        expect(position.fen).toBe('rnbqkbnr/pppp1ppp/4p3/8/8/4P3/PPPP1PPP/RNBQKBNR w KQkq - 0 1');
    });

    it('can move a pawn two squares', () => {
        let position = new Position('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'),
            pieceMover = new PieceMover(position);

        // White
        pieceMover.playMove(getMove('e2', 'e4'));
        expect(position.fen).toBe('rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1');

        // Black
        pieceMover.playMove(getMove('e7', 'e5'));
        expect(position.fen).toBe('rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 1');
    });

    it('can promote a pawn to a queen by default', () => {
        let position = new Position('8/4P2k/8/8/8/8/3p3K/8 w - - 0 1'),
            pieceMover = new PieceMover(position);

        // White
        pieceMover.playMove(getMove('e7', 'e8'));
        expect(position.fen).toBe('4Q3/7k/8/8/8/8/3p3K/8 b - - 0 1');

        // Black
        pieceMover.playMove(getMove('d2', 'd1'));
        expect(position.fen).toBe('4Q3/7k/8/8/8/8/7K/3q4 w - - 0 1');
    });

    it('can capture a pawn en passant', () => {
        let position,
            pieceMover;

        // White
        position = new Position('4k3/8/8/5pP1/8/8/8/4K3 w - f6 0 1');
        pieceMover = new PieceMover(position);
        pieceMover.playMove(getMove('g5', 'f6'));
        //expect(position.fen).toBe('4k3/8/5P2/8/8/8/8/4K3 b - - 0 1');

        // Black
        position = new Position('4k3/8/8/8/1pP5/8/8/4K3 b - c3 0 1');
        pieceMover = new PieceMover(position);
        pieceMover.playMove(getMove('b4', 'c3'));
        expect(position.fen).toBe('4k3/8/8/8/8/2p5/8/4K3 w - - 0 1');
    });

    it('can castle kingside', () => {
        let position,
            pieceMover;

        // White
        position = new Position('r3k2r/8/8/8/8/8/8/R3K2R w K - 0 1');
        pieceMover = new PieceMover(position);
        pieceMover.playMove(getMove('e1', 'g1'));
        expect(position.fen).toBe('r3k2r/8/8/8/8/8/8/R4RK1 b - - 0 1');

        // Black
        position = new Position('r3k2r/8/8/8/8/8/8/R3K2R b k - 0 1');
        pieceMover = new PieceMover(position);
        pieceMover.playMove(getMove('e8', 'g8'));
        expect(position.fen).toBe('r4rk1/8/8/8/8/8/8/R3K2R w - - 0 1');
    });

    it('can castle queenside', () => {
        let position,
            pieceMover;

        // White
        position = new Position('r3k2r/8/8/8/8/8/8/R3K2R w Q - 0 1');
        pieceMover = new PieceMover(position);
        pieceMover.playMove(getMove('e1', 'c1'));
        expect(position.fen).toBe('r3k2r/8/8/8/8/8/8/2KR3R b - - 0 1');

        // Black
        position = new Position('r3k2r/8/8/8/8/8/8/R3K2R b q - 0 1');
        pieceMover = new PieceMover(position);
        pieceMover.playMove(getMove('e8', 'c8'));
        expect(position.fen).toBe('2kr3r/8/8/8/8/8/8/R3K2R w - - 0 1');
    });

    it('can lose castling ability', () => {
        let position,
            pieceMover;

        // White
        position = new Position('r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1');
        pieceMover = new PieceMover(position);
        pieceMover.playMove(getMove('h1', 'h8'));
        expect(position.fen).toBe('r3k2R/8/8/8/8/8/8/R3K3 b Qq - 0 1');

        // Black
        position = new Position('r3k2r/8/8/8/8/8/8/R3K2R b KQkq - 0 1');
        pieceMover = new PieceMover(position);
        pieceMover.playMove(getMove('a8', 'a1'));
        expect(position.fen).toBe('4k2r/8/8/8/8/8/8/r3K2R w Kk - 0 1');
    });

});

function getMove(startSquare, endSquare) {
    return new Move(new Square(startSquare), new Square(endSquare));
}

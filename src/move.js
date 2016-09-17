import { Square } from './square';

export class Move {
    constructor(startSquare, endSquare) {
        if (!startSquare || !endSquare) {
            throw new Error('A move must have a start square and an end square');
        }
        if (!(startSquare instanceof Square && endSquare instanceof Square)) {
            throw new Error('Squares must be of type Square');
        }
        this.startSquare = startSquare;
        this.endSquare = endSquare;
    }
}

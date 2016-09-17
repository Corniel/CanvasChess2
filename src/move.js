export class Move {
    constructor(startSquare, endSquare) {
        if (!startSquare || !endSquare) {
            throw new Error('A move must have a start square and an end square.');
        }
        this.startSquare = startSquare;
        this.endSquare = endSquare;
    }
}

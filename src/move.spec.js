import { Move } from './move';

describe('Move', () => {
  it ('sets the start and end squares', () => {
    let startSquare = 'a1',
        endSquare = 'a2',
        move = new Move(startSquare, endSquare);
    expect(move.startSquare).toBe(startSquare);
    expect(move.endSquare).toBe(endSquare);
  });

  it ('throws an error when squares are not set', () => {
    expect(() => { let move = new Move(); }).toThrow();
    expect(() => { let move = new Move('a1'); }).toThrow();
    expect(() => { let move = new Move('', ''); }).toThrow();
  });

});

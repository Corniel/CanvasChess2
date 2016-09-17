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
    expect(() => { let move = new Move(); }).toThrow();
    expect(() => { let move = new Move(new Square('a1')); }).toThrow();
    expect(() => { let move = new Move('', ''); }).toThrow();
  });

  it ('must be initialized with Square objects', () => {
    expect(() => { let move = new Move('a1', 'a2'); }).toThrow();
  });

});

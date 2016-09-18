/**
 * A class representing a square on a chessboard.
 *
 * A square contains an internal _name property, which must be valid algebraic notation ('e2', 'd5', etc). This
 * property must be set through the constructor, but can be changed later:
 *
 *   let square = new Square('f1');
 *   square.name = 'f2';
 *
 * A square is able to compare itself to other squares, in terms of its spatial relationship. For instance, it knows if
 * it is on the same file, a knight-move away, etc.
 *
 * Since squares are not immutable, a clone() method is provided for creating defensive copies. If a class holds a
 * square reference and does not want external code to be able to directly modify it, then any method in the class
 * that returns the square should instead return a copy.
 */
export class Square {
    /**
     * Create a square.
     * @param {string} name - The name of the square, in algebraic notation.
     * @throws Will throw an error if name is not provided, or is not a valid square name.
     */
    constructor(name) {
        if (!name) {
            throw new Error('Square must have a name');
        }
        if (!validSquareName(name)) {
            throw new Error('Invalid square name');
        }
        this._name = name;
    }

    /**
     * Get the square's name.
     * @return {string} The name of the square, in algebraic notation.
     */
    get name() {
        return this._name;
    }

    /**
     * Set the square's name.
     * @param {string} name - The name of the square, in algebraic notation.
     * @throws Will throw an error if newName is not a valid square name.
     */
    set name(newName) {
        if (!validSquareName(newName)) {
            throw new Error('Invalid square name');
        }
        this._name = newName;
    }

    /**
     * Get the square's file.
     * @return {string} The letter of the square's file.
     */
    get file() {
        return this._name.substr(0, 1);
    }

    /**
     * Set the square's file.
     * @param {string} newFile - The lowercase letter of the new file.
     */
    set file(newFile) {
        let name = newFile + this.rank;
        this.name = name;
    }

    /**
     * Get the square's rank.
     * @return {string} The square's rank number, as a string.
     */
    get rank() {
        return this._name.substr(1, 1);
    }

    /**
     * Set the square's rank.
     * @param {string} newRank - The number of the new rank, as a string.
     * @throws Will throw an error if newRank is of type Number, rather than String.
     */
    set rank(newRank) {
        let name;

        if (typeof newRank === 'number') {
            throw new Error('Rank must be a string, not a number');
        }

        name = this.file + newRank;
        this.name = name;
    }

    /**
     * Increment the square's file. Can be negative.
     * @param {number} i - The number of files to increment the current file.
     */
    addFile(i) {
        let newFile;

        if (typeof i !== 'number' || isNaN(i)) {
            return false;
        }

        if (Math.abs(i > 7)) {
            return false;
        }

        newFile = addNumberToCharacter(i, this.file);
        this.name = newFile + this.rank;
    }

    /**
     * Increment the square's rank. Can be negative.
     * @param {number} i - The number of ranks to increment the current rank.
     */
    addRank(i) {
        let newName = this.file + (parseInt(this.rank, 10) + i);
        this.name = newName;
    }

    /**
     * Determine if this square's file is the same as another square's file.
     * @param {Square} square - The square to use for comparison.
     * @return {boolean} True if the squares have the same file, otherwise false.
     */
    isSameFile(square) {
        return (this.file === square.file);
    }

    /**
     * Determine if this square's rank is the same as another square's rank.
     * @param {Square} square - The square to use for comparison.
     * @return {boolean} True if the squares have the same rank, otherwise false.
     */
    isSameRank(square) {
        return (this.rank === square.rank);
    }

    /**
     * Calculate the number of files between this square and the provided square.
     * @param {Square} square - The square to use for the calculation.
     * @return {number} the number of files. Can be negative, depending on the order of subtraction.
     */
    diffFile(square) {
        return (convertCharacterToNumber(square.file) - convertCharacterToNumber(this.file));
    }

    /**
     * Calculate the number of ranks between this square and the provided square.
     * @param {Square} square - The square to use for the calculation.
     * @return {number} the number of ranks. Can be negative, depending on the order of subtraction.
     */
    diffRank(square) {
        return (parseInt(square.rank, 10) - parseInt(this.rank, 10));
    }

    /**
     * Determine if the two squares are a bishop-move apart.
     * @param {Square} square - The square to use for comparison.
     * @return {boolean}
     */
    isBishopMove(square) {
        if (this.equals(square)) {
            return false;
        }
        return (Math.abs(this.diffRank(square)) === Math.abs(this.diffFile(square)));
    }

    /**
     * Determine if the two squares are a king-move apart.
     * @param {Square} square - The square to use for comparison.
     * @return {boolean}
     */
    isKingMove(square) {
        if (this.equals(square)) {
            return false;
        }
        return (Math.abs(this.diffRank(square)) < 2 && Math.abs(this.diffFile(square)) < 2);
    }

    /**
     * Determine if the two squares are a knight-move apart.
     * @param {Square} square - The square to use for comparison.
     * @return {boolean}
     */
    isKnightMove(square) {
        if (this.equals(square)) {
            return false;
        }
        return (Math.abs(this.diffRank(square)) === 1 && Math.abs(this.diffFile(square)) === 2) ||
            (Math.abs(this.diffRank(square)) === 2 && Math.abs(this.diffFile(square)) === 1);
    }

    /**
     * Determine if the two squares are a queen-move apart.
     * @param {Square} square - The square to use for comparison.
     * @return {boolean}
     */
    isQueenMove(square) {
        if (this.equals(square)) {
            return false;
        }
        return (this.isRookMove(square) || this.isBishopMove(square));
    }

    /**
     * Determine if the two squares are a rook-move apart.
     * @param {Square} square - The square to use for comparison.
     * @return {boolean}
     */
    isRookMove(square) {
        if (this.equals(square)) {
            return false;
        }
        return (this.isSameRank(square) || this.isSameFile(square));
    }

    /**
     * Change this square's value to the next square on the path between this square and the destination square.
     * Ex.
     *   let s = new Square('a1');
     *   s.stepTo(new Square('h8'));
     *   s.name; // 'b2'
     * @param {Square} square - The destination square.
     * @return {boolean} True if the step succeeded, otherwise false.
     */
    stepTo(square) {
        let fileDiff,
            rankDiff;

        if (!this.isQueenMove(square)) {
            return false;
        }

        fileDiff = this.diffFile(square);
        fileDiff = Math.abs(fileDiff) / fileDiff;
        this.addFile(fileDiff);

        rankDiff = this.diffRank(square);
        rankDiff = Math.abs(rankDiff) / rankDiff;
        this.addRank(rankDiff);

        return true;
    }

    /**
     * Create a copy of this square.
     * @return {Square} The new square.
     */
    clone() {
        return new Square(this._name);
    }

    /**
     * Compare two squares for logical equality.
     * @param {Square} square - The square to use for comparison.
     * @return {boolean} True if both squares have the same name, otherwise false.
     */
    equals(square) {
        return (this._name === square.name);
    }

    /**
     * Allow this square to be treated as a string.
     * @return {string} The name of this square.
     */
    toString() {
        return this._name;
    }

    /**
     * Get an array containing all squares on a chessboard.
     * @return {Square[]} A list of squares.
     */
    static getAllSquares() {
        let squareList = [];

        for (let i = 1; i <= 8; i++) {
            for (let j = 1; j <= 8; j++) {
                let square = new Square(String.fromCharCode(i + 96) + j);
                squareList.push(square);
            }
        }

        return squareList;
    }

}

function validSquareName (squareName) {
    return (/^[a-h][1-8]$/.test(squareName));
}

function addNumberToCharacter (number, character) {
    let currentFileNumber,
        newFileNumber,
        fileCharacter;

    currentFileNumber = convertCharacterToNumber(character);
    newFileNumber = currentFileNumber + number;
    fileCharacter = convertNumberToCharacter(newFileNumber);

    return fileCharacter;
}

function convertNumberToCharacter (number) {
    return String.fromCharCode(number + 96);
}

function convertCharacterToNumber (character) {
    return (character.charCodeAt(0) - 96);
}

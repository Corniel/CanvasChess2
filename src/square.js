export class Square {
    constructor(name) {
        if (!name) {
            throw new Error('Square must have a name');
        }
        if (!validSquareName(name)) {
            throw new Error('Invalid square name');
        }
        this._name = name;
    }

    get name() {
        return this._name;
    }

    set name(newName) {
        if (!validSquareName(newName)) {
            throw new Error('Invalid square name');
        }
        this._name = newName;
    }

    toString() {
        return this._name;
    }

    get file() {
        return this._name.substr(0, 1);
    }

    set file(newFile) {
        name = newFile + this.rank;
        this.name = name;
    }

    get rank() {
        return this._name.substr(1, 1);
    }

    set rank(newRank) {
        if (typeof newRank === 'number') {
            throw new Error('Rank must be a string, not a number');
        }
        name = this.file + newRank;
        this.name = name;
    }

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

    addRank(i) {
        let newName = this.file + (parseInt(this.rank, 10) + i);
        this.name = newName;
    }

    isSameFile(square) {
        return (this.file === square.file);
    }

    isSameRank(square) {
        return (this.rank === square.rank);
    }

    diffFile(square) {
        return (convertCharacterToNumber(square.file) - convertCharacterToNumber(this.file));
    }

    diffRank(square) {
        return (parseInt(square.rank, 10) - parseInt(this.rank, 10));
    }

    isBishopMove(square) {
        if (this.equals(square)) {
            return false;
        }
        return (Math.abs(this.diffRank(square)) === Math.abs(this.diffFile(square)));
    }

    isKingMove(square) {
        if (this.equals(square)) {
            return false;
        }
        return (Math.abs(this.diffRank(square)) < 2 && Math.abs(this.diffFile(square)) < 2);
    }

    isKnightMove(square) {
        if (this.equals(square)) {
            return false;
        }
        return (Math.abs(this.diffRank(square)) === 1 && Math.abs(this.diffFile(square)) === 2) ||
            (Math.abs(this.diffRank(square)) === 2 && Math.abs(this.diffFile(square)) === 1);
    }

    isQueenMove(square) {
        if (this.equals(square)) {
            return false;
        }
        return (this.isRookMove(square) || this.isBishopMove(square));
    }

    isRookMove(square) {
        if (this.equals(square)) {
            return false;
        }
        return (this.isSameRank(square) || this.isSameFile(square));
    }

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

    clone() {
        return new Square(this._name);
    }

    equals(square) {
        return (this._name === square.name);
    }

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
};

function addNumberToCharacter (number, character) {
    let currentFileNumber,
        newFileNumber,
        fileCharacter;

    currentFileNumber = convertCharacterToNumber(character);
    newFileNumber = currentFileNumber + number;
    fileCharacter = convertNumberToCharacter(newFileNumber)

    return fileCharacter;
}

function convertNumberToCharacter (number) {
    return String.fromCharCode(number + 96);
}

function convertCharacterToNumber (character) {
    return (character.charCodeAt(0) - 96);
}

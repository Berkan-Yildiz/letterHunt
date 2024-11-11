class FallingLettersGame {
    constructor(frameId, gameOverTextId, restartButtonId, scoreDisplayId) {
        this.characterFrame = document.getElementById(frameId);
        this.gameOverText = document.getElementById(gameOverTextId);
        this.restartButton = document.getElementById(restartButtonId);
        this.scoreDisplay = document.getElementById(scoreDisplayId);
        this.frameWidth = this.characterFrame.clientWidth;
        this.frameHeight = this.characterFrame.clientHeight;
        this.characters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
        this.activeCharacters = [];
        this.activeLetters = [];
        this.isGameOver = false;
        this.letterCreationInterval = null;
        this.score = 0;

        this.startGame();
        this.setupEventListeners();
    }

    getRandomIndex(arrayLength) {
        return Math.floor(Math.random() * arrayLength);
    }

    getRandomLetter() {
        let character;
        do {
            character = this.characters[this.getRandomIndex(this.characters.length)];
        } while (this.activeLetters.includes(character));
        this.activeLetters.push(character);
        return character;
    }

    getRandomPosition(max) {
        return Math.floor(Math.random() * max) * 30;
    }

    createCharacters() {
        if (this.isGameOver) return;

        const character = document.createElement('div');
        character.className = 'letter';
        character.textContent = this.getRandomLetter();
        character.style.left = this.getRandomPosition(Math.floor(this.frameWidth / 30)) + 'px';
        character.style.top = '0px';
        this.characterFrame.appendChild(character);
        this.activeCharacters.push(character);
        this.fall(character);
    }

    fall(character) {
        const fallSpeed = 1;
        const interval = setInterval(() => {
            if (this.isGameOver) {
                clearInterval(interval);
                return;
            }
            let top = parseInt(character.style.top, 10);
            character.style.top = (top + fallSpeed) + 'px';

            if (top >= (this.frameHeight - 30)) {
                clearInterval(interval);
                if (this.activeCharacters.includes(character)) {
                    this.gameOver();
                }
                this.removeCharacter(character);
            }
        }, 15);
    }

    removeCharacter(character) {
        character.remove();
        this.activeCharacters = this.activeCharacters.filter(l => l !== character);
        this.activeLetters = this.activeLetters.filter(l => l !== character.textContent);
    }

    updateScore() {
        this.score += 100;
        this.scoreDisplay.textContent = `Skor: ${this.score}`;
    }

    gameOver() {
        if (this.isGameOver) return;
        this.isGameOver = true;
        this.gameOverText.classList.remove('hidden');
        this.gameOverText.textContent = 'Game Over';
        this.activeCharacters = [];
        this.activeLetters = [];
        clearInterval(this.letterCreationInterval);
    }

    handleKeydown(e) {
        if (this.isGameOver) return;

        const key = e.key.toUpperCase();
        this.activeCharacters.forEach(character => {
            if (key === character.textContent) {
                this.updateScore();
                this.removeCharacter(character);
            }
        });
    }

    restartGame() {
        this.isGameOver = false;
        this.gameOverText.classList.add('hidden');
        this.characterFrame.innerHTML = '';
        this.activeCharacters = [];
        this.activeLetters = [];
        this.score = 0;
        this.scoreDisplay.textContent = `Skor: ${this.score}`;
        clearInterval(this.letterCreationInterval);
        this.startGame();
    }

    startGame() {
        this.letterCreationInterval = setInterval(() => {
            if (!this.isGameOver) {
                this.createCharacters();
            }
        }, 1500);
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => this.handleKeydown(e));
        this.restartButton.addEventListener('click', () => this.restartGame());
    }
}

const game = new FallingLettersGame('letterFrame', 'gameOver', 'restartButton', 'scoreDisplay');

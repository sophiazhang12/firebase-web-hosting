class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.score = 0;

        this.snake = [{ x: 100, y: 100, width: 20, height: 20 }];
        this.snakeTail = [];

        this.direction = 'right';
        this.moveInterval = 5;
        this.lastMoveTime = 0;

        this.collectibles = [];
        // Call it initially to generate collectibles.
        this.generateCollectibles();
        
        // Initialize the game
        this.update();
        document.addEventListener('keydown', (e) => this.handleInput(e));

        const firebaseConfig = {
            apiKey: "AIzaSyBeEjuYK24GtSdcXaV1uZG-r8Bd2qFg1GY",
            authDomain: "whateverprojectsophiazhang.firebaseapp.com",
            projectId: "whateverprojectsophiazhang",
            storageBucket: "whateverprojectsophiazhang.appspot.com",
            messagingSenderId: "664431008269",
            appId: "1:664431008269:web:dce6f1dee7c4b5c9821344",
            measurementId: "G-4ZQYQV644W"
        };

        const app = firebase.initializeApp(firebaseConfig);
        this.db = app.firestore(app);
    }

    displayScore() {
        this.ctx.font = "24px Arial";
        this.ctx.fillStyle = "black";
        this.ctx.fillText("Score: " + this.score, 20, 30);
    }

    submitScore(playerInitials, playerScore) {
        this.db.collection('scores').add({
            initials: playerInitials,
            score: playerScore,
        })
        .then((docRef) => {
            console.log('Score submitted with ID: ', docRef.id);
        })
        .catch((error) => {
            console.error('Error submitting score: ', error);
        });
    }

    gameOver() {
        cancelAnimationFrame(this.animationFrameId);

        this.ctx.font = "30px Arial";
        this.ctx.fillStyle = "red";
        this.ctx.fillText("Game Over", this.canvas.width / 2 - 70, this.canvas.height / 2);

        const playerInitials = prompt('Game over! Enter your initials (3 letters):');
        if (playerInitials && playerInitials.length === 3) {
            this.submitScore(playerInitials, this.score);
        } else {
            console.log('Invalid initials or user canceled submission.');
        }
    }

    redraw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
        // Draw collectibles
        this.ctx.fillStyle = "red"; // Set the color you want for collectibles
        for (const collectible of this.collectibles) {
            this.ctx.fillRect(collectible.x, collectible.y, collectible.width, collectible.height);
        }
    
        // Draw the snake's head
        this.ctx.fillStyle = "blue"; // Change color as needed
        for (const segment of this.snake) {
            this.ctx.fillRect(segment.x, segment.y, segment.width, segment.height);
        }
    
        // Draw the snake's tail
        this.ctx.fillStyle = "green"; // Change color as needed
        for (const segment of this.snakeTail) {
            this.ctx.fillRect(segment.x, segment.y, segment.width, segment.height);
        }
    
        this.displayScore();
    }
    

    handleInput(e) {
        switch (e.key) {
            case 'ArrowUp':
                if (this.direction !== 'down') {
                    this.direction = 'up';
                }
                break;
            case 'ArrowDown':
                if (this.direction !== 'up') {
                    this.direction = 'down';
                }
                break;
            case 'ArrowLeft':
                if (this.direction !== 'right') {
                    this.direction = 'left';
                }
                break;
            case 'ArrowRight':
                if (this.direction !== 'left') {
                    this.direction = 'right';
                }
                break;
            default:
                // Ignore other keys
                break;
        }
    }
    

    generateCollectibles() {
        const desiredCount = 2;
        while (this.collectibles.length < desiredCount) {
            const randomX = Math.floor(Math.random() * this.canvas.width);
            const randomY = Math.floor(Math.random() * this.canvas.height);
            const collectible = { x: randomX, y: randomY, width: 20, height: 20 };
            this.collectibles.push(collectible);
        }
    }    

    checkCollision() {
        for (let i = this.collectibles.length - 1; i >= 0; i--) {
            const collectible = this.collectibles[i];
            if (
                this.snake[0].x < collectible.x + collectible.width &&
                this.snake[0].x + this.snake[0].width > collectible.x &&
                this.snake[0].y < collectible.y + collectible.height &&
                this.snake[0].y + this.snake[0].height > collectible.y
            ) {
                this.score++;
                this.collectibles.splice(i, 1);
                this.generateCollectibles();
            }
        }
    }

    moveSnake() {
        const newHead = { ...this.snake[0] };
    
        switch (this.direction) {
            case 'up':
                newHead.y -= 2;
                break;
            case 'down':
                newHead.y += 2;
                break;
            case 'left':
                newHead.x -= 2;
                break;
            case 'right':
                newHead.x += 2;
                break;
        }
    
        this.snake.unshift(newHead);
    
        while (this.snake.length > this.score + 1) {
            this.snake.pop();
        }
    
        this.snakeTail = this.snake.slice(1);
    }
    

    update() {
        this.redraw();
    
        if (this.score >= 3) {
            this.gameOver();
            return;
        }
    
        // Call checkCollision here before updating the snake's position
        this.checkCollision();
    
        const currentTime = performance.now();
        if (currentTime - this.lastMoveTime > this.moveInterval) {
            this.lastMoveTime = currentTime;
            this.moveSnake();
        }
    
        requestAnimationFrame(() => this.update());
    }
}

document.myGame = new Game();

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.score = 0;

        // Define the shapes array and initialize it
        this.shapes = [];

        // Initialize the snake with a single segment
        this.snake = [{ x: 100, y: 100, width: 20, height: 20 }];

        // Set the initial direction of the snake
        this.direction = 'right';

        // Start game loop
        this.update();

        // Handle keyboard input
        document.addEventListener('keydown', (e) => this.handleInput(e));

                // Your web app's Firebase configuration
        // For Firebase JS SDK v7.20.0 and later, measurementId is optional
        const firebaseConfig = {
            apiKey: "AIzaSyBeEjuYK24GtSdcXaV1uZG-r8Bd2qFg1GY",
            authDomain: "whateverprojectsophiazhang.firebaseapp.com",
            projectId: "whateverprojectsophiazhang",
            storageBucket: "whateverprojectsophiazhang.appspot.com",
            messagingSenderId: "664431008269",
            appId: "1:664431008269:web:dce6f1dee7c4b5c9821344",
            measurementId: "G-4ZQYQV644W"
        };


        // Initialize Firebase
        const app = firebase.initializeApp(firebaseConfig);

        // Initialize Cloud Firestore and get a reference to the service
        this.db = app.firestore(app);
    }

    displayScore() {
        this.ctx.font = "24px Arial"; // Set the font size and type
        this.ctx.fillStyle = "black"; // Set the text color
        this.ctx.fillText("Score: " + this.score, 20, 30); // Draw the score on the canvas

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
        // Stop the game loop (update function)
        cancelAnimationFrame(this.animationFrameId);

        // Display a game over message
        this.ctx.font = "30px Arial";
        this.ctx.fillStyle = "red";
        this.ctx.fillText("Game Over", this.canvas.width / 2 - 70, this.canvas.height / 2);

        // Submit the score to Firestore
        const playerInitials = prompt('Game over! Enter your initials (3 letters):');
        if (playerInitials && playerInitials.length === 3) {
            this.submitScore(playerInitials, this.score);
        } else {
            console.log('Invalid initials or user canceled submission.');
        }
    }


    redraw() {
        // Clear the canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw the snake
        for (const segment of this.snake) {
            this.ctx.fillStyle = "green";
            this.ctx.fillRect(segment.x, segment.y, segment.width, segment.height);
        }

        this.displayScore();
    }

    handleInput(e) {
        switch (e.key) {
            case 'ArrowUp':
            case 'ArrowDown':
            case 'ArrowLeft':
            case 'ArrowRight':
                this.direction = e.key;
                break;
            default:
                // Ignore other keys
                break;
        }
    }    

    // Add a new method to move the snake
    moveSnake() {
        const head = { ...this.snake[0] };
        switch (this.direction) {
            case 'ArrowUp':
                head.y -= 2;
                break;
            case 'ArrowDown':
                head.y += 2;
                break;
            case 'ArrowLeft':
                head.x -= 2;
                break;
            case 'ArrowRight':
                head.x += 2;
                break;
        }
        this.snake.unshift(head);
        this.snake.pop();
    }    

    
    update() {
        this.redraw();

        if (this.score >= 3) {
            this.gameOver();
            return;
        }

        // Call moveSnake before collision detection
        this.moveSnake();

        // Your collision detection logic for the snake goes here

        // Use requestAnimationFrame for smooth animations
        requestAnimationFrame(() => this.update());
    }
    
    

}

// Initialize the game
document.myGame = new Game();

// log the score once every second
setInterval(() => console.log(document.myGame.score), 1000);

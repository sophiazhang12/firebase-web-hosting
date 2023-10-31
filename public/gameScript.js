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
        
        this.gameOverFlag = false; // Set this to false to start the game.
    
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
        this.gameOverFlag = true;
            // Stop the game loop
            cancelAnimationFrame(this.animationFrameId);
        
            this.ctx.font = "30px Arial";
            this.ctx.fillStyle = "red";
            this.ctx.fillText("Game Over", this.canvas.width / 2 - 70, this.canvas.height / 2);
        
            // Display the scoreboard at the end of the game
            this.populateScoreboard();

            const initialsInput = document.getElementById('initialsInput');
            initialsInput.style.display = 'block';
            initialsInput.focus();
        
            const replayButton = document.getElementById('replayButton');
            replayButton.style.display = 'block';
            replayButton.addEventListener('click', () => {
                const playerInitials = initialsInput.value;
                if (playerInitials.length === 3) {
                    this.submitScore(playerInitials, this.score);
                    initialsInput.style.display = 'none';
                    replayButton.style.display = 'none';
                    this.restartGame();
                } else {
                    console.log('Invalid initials. Please enter 3 letters.');
                }
            });
    }
    
    
    restartGame() {
        this.gameOverFlag = false;
        this.score = 0;
        this.snake = [{ x: 100, y: 100, width: 20, height: 20 }];
        this.snakeTail = [];
        this.direction = 'right';
        this.collectibles = [];
        this.generateCollectibles();
        this.update(); // Start the game over
    
        const replayButton = document.getElementById('replayButton');
        const initialsInput = document.getElementById('initialsInput');
        replayButton.style.display = 'none'; // Hide the replay button
        initialsInput.style.display = 'none'; // Hide the initials input
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
            const randomX = Math.floor(Math.random() * (this.canvas.width - 20)); // Subtract 20 to keep it within the canvas
            const randomY = Math.floor(Math.random() * (this.canvas.height - 20)); // Subtract 20 to keep it within the canvas
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
    
        // Update the position of the new head based on the current direction
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
    
        // Check if the new head is out of bounds
        if (
            newHead.x < 0 ||
            newHead.x + newHead.width > this.canvas.width ||
            newHead.y < 0 ||
            newHead.y + newHead.height > this.canvas.height
        ) {
            this.gameOver();
            return;
        }
    
        this.snake.unshift(newHead);
    
        while (this.snake.length > this.score + 1) {
            this.snake.pop();
        }
    
        this.snakeTail = this.snake.slice(1);
    }
    
    

    update() {
        this.redraw();
    
        if (this.gameOverFlag)
        {
            return;
        }
    
        // Call checkCollision here before updating the snake's position
        this.checkCollision();
    
        const currentTime = performance.now();
        if (currentTime - this.lastMoveTime > this.moveInterval) {
            this.lastMoveTime = currentTime;
            this.moveSnake();
        }
    
        this.animationFrameId = requestAnimationFrame(() => this.update());
    }

    async getTopScores() {
        try {
            const scores = await this.db.collection('scores')
                .orderBy('score', 'desc')
                .limit(10)
                .get();

            const topScores = scores.docs.map(doc => doc.data());
            return topScores;
        } catch (error) {
            console.error('Error retrieving top scores:', error);
            return [];
        }
    }

    //gets top scores from firebase and populates scoreboard
    async populateScoreboard() {
        const topScores = await this.getTopScores();
        const scoreboardBody = document.getElementById('scoreboard-body');
    
        // Clear any previous scoreboard entries
        scoreboardBody.innerHTML = '';
    
        // Loop through the top scores and create scoreboard entries
        topScores.forEach((score, index) => {
            const row = document.createElement('tr');
            const rankCell = document.createElement('td');
            const initialsCell = document.createElement('td');
            const scoreCell = document.createElement('td');
    
            rankCell.textContent = index + 1;
            initialsCell.textContent = score.initials;
            scoreCell.textContent = score.score;
    
            row.appendChild(rankCell);
            row.appendChild(initialsCell);
            row.appendChild(scoreCell);
            scoreboardBody.appendChild(row);
        });
    }    

}

document.myGame = new Game();

// Assuming you have already created an instance of your game
const myGame = document.myGame;

// //authentication stuff
//     // User registration
//     function registerUser(email, password) {
//         return firebase.auth().createUserWithEmailAndPassword(email, password);
//       }
      
//       // User login
//       function loginUser(email, password) {
//         return firebase.auth().signInWithEmailAndPassword(email, password);
//       }
      
//       // User logout
//       function logoutUser() {
//         return firebase.auth().signOut();
//       }
  
      
//gets top scores from firebase and fills up the scoreboard, then updates it periodically
setInterval(() => {
    myGame.populateScoreboard()
      .then(topScores => {
        console.log('Top Scores:', topScores);
      })
      .catch(error => {
        console.error('Error while retrieving top scores:', error);
      });
  }, 5000); // Refresh the scoreboard every 5 seconds (adjust as needed)



class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.score = 0;

        // Define the shapes (example rectangles here)
        this.shapes = [
            { x: 50, y: 50, width: 50, height: 50, name: 'Main' },
            { x: 150, y: 150, width: 50, height: 50, name: 'collectable' },
            { x: 250, y: 250, width: 50, height: 50, name: 'collectable' }
        ];

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
      

    displayScore() {
        this.ctx.font = "24px Arial"; // Set the font size and type
        this.ctx.fillStyle = "black"; // Set the text color
        this.ctx.fillText("Score: " + this.score, 20, 30); // Draw the score on the canvas

    }

    gameOver() {
        // Stop the game loop (update function)
        cancelAnimationFrame(this.animationFrameId);

        // Get user initials
        const playerInitials = prompt('Game over! Enter your initials (3 letters):');

        // Check if the player entered initials
        if (playerInitials && playerInitials.length === 3) {
            // Submit the score to Firestore
            this.submitScore(playerInitials, this.score);
        } else {
            console.log('Invalid initials or user canceled submission.');
        }
    }

    redraw() {
        // Clear the canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw each shape
        for (const shape of this.shapes) {
            this.ctx.fillRect(shape.x, shape.y, shape.width, shape.height);
        }

        this.displayScore();
    }

    handleInput(e) {
        const player = this.shapes[0];
        const canvasWidth = this.canvas.width;
        const canvasHeight = this.canvas.height;
        const moveDistance = 10; // Adjust the movement distance as needed
    
        if (e.key === 'ArrowRight') {
            if (player.x + player.width + moveDistance <= canvasWidth) {
                player.x += moveDistance;
            }
        } else if (e.key === 'ArrowDown') {
            if (player.y + player.height + moveDistance <= canvasHeight) {
                player.y += moveDistance;
            }
        } else if (e.key === 'ArrowLeft') {
            if (player.x - moveDistance >= 0) {
                player.x -= moveDistance;
            }
        } else if (e.key === 'ArrowUp') {
            if (player.y - moveDistance >= 0) {
                player.y -= moveDistance;
            }
        }
        // ... You can add more controls here.
    }
    

    checkCollision(obj1, obj2) {
        // Check if the two objects are colliding
        return obj1.x < obj2.x + obj2.width &&
               obj1.x + obj1.width > obj2.x &&
               obj1.y < obj2.y + obj2.height &&
               obj1.y + obj1.height > obj2.y;
    }

    spawnCollectable() {
        let newX, newY;
    
        // Keep generating random positions until a non-overlapping position is found
        do {
            newX = Math.random() * (this.canvas.width - 50); // Adjust the width and height as needed
            newY = Math.random() * (this.canvas.height - 50); // Adjust the width and height as needed
        } while (this.shapes.some(shape => this.checkCollision({ x: newX, y: newY, width: 50, height: 50 }, shape)));
    
        // Add the new "collectable" shape to the array
        this.shapes.push({ x: newX, y: newY, width: 50, height: 50, name: 'collectable' });
    }
    
    
    
    

    update() {
        this.redraw();
    
        // Game over condition (you can adjust this condition based on your game logic)
        if (this.score >= 3) {
            this.gameOver();
            return;
        }

        for (let i = 1; i < this.shapes.length; i++) {
            if (this.checkCollision(this.shapes[0], this.shapes[i]) && this.shapes[i].name === 'collectable') {
                console.log('Collision detected between Main and collectable shape ' + i);
    
                // Increase the score
                this.score++;
    
                // Remove the collectable shape from the array
                this.shapes.splice(i, 1);
                i--; // Decrement i to account for the removed element

                // Spawn a new "collectable" shape
                this.spawnCollectable();
            }
        }
    
        // Use requestAnimationFrame for smooth animations
        requestAnimationFrame(() => this.update());
    }
}    

// Initialize the game
document.myGame = new Game();



// log the score once every second
setInterval(() => console.log(document.myGame.score), 1000);

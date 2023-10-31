# firebase-web-hosting
Provide a brief document in your github README.md explaining how the scoreboard is implemented

In the body of the html there is this: 
<div id="scoreboard">
        <table>
            <thead>
                <tr>
                    <th>Rank</th>
                    <th>Initials</th>
                    <th>Score</th>
                </tr>
            </thead>
            <tbody id="scoreboard-body">
                <!-- This is where the top scores will be dynamically inserted -->
            </tbody>
        </table>
    </div>
which creates the actual scoreboard. the id scoreboard-body refers to where top scores will be added as the game progresses.

In the js file i have this:

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

This method goes through all the scores and lists out the top ten of them. if there is an error,
it will throw an appropriate error. 

I also use this method:

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

    As it's name suggests, this method populates the scoreboard, by calling on getTopScores() and 
    filling up scoreboardBody (by using the id scoreboard-body definined in the html). it is structured like a table format. Both getTopScores() and populateScoreboard() are inside the Game class of the js file (gameScript.js)

    Outside of the Game file, I do this:

    // Assuming you have already created an instance of your game
const myGame = document.myGame;

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

I already put comments in the actual code, but to reiterate, basically, every five seconds the game updates the scoreboard in real time. yay! 


class Main {
    constructor() {
        this.pageViewsKey = 'pageViewsCount';
        this.initializeCounter();
        this.currentCount = 0;
        this.count = 0;
        this.initializeButton();
        //this.displayCount();
    }

    initializeCounter() {
        if (!localStorage.getItem(this.pageViewsKey)) {
            localStorage.setItem(this.pageViewsKey, '0');
        }
    }

    incrementCount() {
        let currentCount = parseInt(localStorage.getItem(this.pageViewsKey));
        currentCount++;
        localStorage.setItem(this.pageViewsKey, currentCount.toString());
    }

    // displayCount() {
    //     this.incrementCount();
    //     // Update count in div id count
    //     document.getElementById('count').innerHTML = 'You have visited this page ' + localStorage.getItem(this.pageViewsKey) + ' times.';
    // }

    // showStrobeLights() {
    //     if (this.count === 10) {
    //         // Create a div to overlay the strobe lights
    //         const overlay = document.createElement("div");
    //         overlay.style.position = "fixed";
    //         overlay.style.top = "0";
    //         overlay.style.left = "0";
    //         overlay.style.width = "100%";
    //         overlay.style.height = "100%";
    //         overlay.style.backgroundColor = "black";
    //         overlay.style.opacity = "0.8";
    //         overlay.style.zIndex = "1000";

    //         // Create an image element for the strobe lights GIF
    //         const strobeLights = document.createElement("img");
    //         strobeLights.src = "strobeLights.gif"; // Replace with the path to your GIF
    //         strobeLights.style.position = "absolute";
    //         strobeLights.style.top = "50%";
    //         strobeLights.style.left = "50%";
    //         strobeLights.style.transform = "translate(-50%, -50%)";
    //         strobeLights.style.zIndex = "1001";

    //         // Append the overlay and the GIF to the document
    //         document.body.appendChild(overlay);
    //         document.body.appendChild(strobeLights);


    //     }
    // }

    switchContent()
    {
        window.location.href = "https://whateverprojectsophiazhang.web.app/index.html"; // Replace with the correct URL for the other page
    }
    initializeButton() {
        const button = document.getElementById("increment-button");
        button.addEventListener("click", () => this.nyanBrush(button));
    }

    showStrobeLights() {
        const strobeLights = document.getElementById('strobe-overlay');
        strobeLights.style.display = 'block';
    }
    nyanBrush(button) {
        this.count++;
        button.textContent = "Number of Power-ups: " + this.count;
        if (this.count === 10) {
            // Play music when count reaches 10
            const audio = new Audio('nyanMeow.mp3'); // Replace 'your-audio-file.mp3' with your audio file path
            audio.play();

            // Show strobe lights when count reaches 10
            this.showStrobeLights();
        }
    }

    setupRainbowTrail(event) {

        const container = document.getElementById('rainbow-trail');

        const flower = document.createElement("img");
        flower.src = "rainbowTrail.png"; // Replace with the path to your rainbow image
    
        // Set the width and height of the rainbow image
        flower.style.width = "100px"; // Adjust the width as needed
        flower.style.height = "100px"; // Adjust the height as needed
    
        flower.style.position = "absolute";
        flower.style.left = (event.pageX - 25) + "px"; // Adjust the values as needed
        flower.style.top = (event.pageY - 25) + "px";
        container.appendChild(flower);
    
        // Remove the flower element after a short duration
        setTimeout(function() {
            container.removeChild(flower);
        }, 700); // Adjust the duration as needed
    }

    setupNyanCat(event) {

        const container1 = document.getElementById('nyan-cat');

        const flower = document.createElement("img");
        flower.src = "nyanCat.png"; // Replace with the path to your Nyan Cat image
    
        // Set the width and height of the Nyan Cat image
        flower.style.width = "100px"; // Adjust the width as needed
        flower.style.height = "100px"; // Adjust the height as needed
    
        flower.style.position = "absolute";
        flower.style.left = (event.pageX - 25) + "px"; // Adjust the values as needed
        flower.style.top = (event.pageY - 25) + "px";
        container1.appendChild(flower);
    
        // Remove the Nyan Cat element after a short duration
        setTimeout(function() {
            container1.removeChild(flower);
        }, 15); // Adjust the duration as needed
    }

}

const mainInstance = new Main();


document.addEventListener('mousemove', (event) => {
    mainInstance.setupRainbowTrail(event);
});
document.addEventListener('mousemove', (event) => {
    mainInstance.setupNyanCat(event);
});

document.getElementById('switch-content').addEventListener('click', () => {
    mainInstance.switchContent();
});
document.getElementById("nyan-brush-count").addEventListener("click", () => mainInstance.nyanBrushCounter());



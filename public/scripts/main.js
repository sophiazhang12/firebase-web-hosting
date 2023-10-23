class Main {
    constructor() {
        this.pageViewsKey = 'pageViewsCount';
        this.initializeCounter();
        this.displayCount();
        this.setupRainbowTrail();
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

    displayCount() {
        this.incrementCount();
        // Update count in div id count
        document.getElementById('count').innerHTML = 'You have visited this page ' + localStorage.getItem(this.pageViewsKey) + ' times.';
    }

    setupRainbowTrail() {
        const container = document.getElementById("rainbow-trail");

        // Correct the event handling
        document.addEventListener("mousemove", (event) => {
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
        });
    }
}

// Create an instance of the Main class
const mainInstance = new Main();

// Bind the event listener to the "mouseover" event
document.getElementById("rainbow-trail").addEventListener("mouseover", () => mainInstance.setupRainbowTrail());

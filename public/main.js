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

    switchContent()
    {
        window.location.href = "https://whateverprojectsophiazhang.web.app/index.html"; // Replace with the correct URL for the other page
    }
    initializeButton() {
        const button = document.getElementById("increment-button");
        button.addEventListener("click", () => this.nyanBrush(button));
    }

    nyanBrush(button) {
        this.count++;
        button.textContent = "Number of Power-ups: " + this.count;
        if (this.count === 10) {
            // Play music when count reaches 10
            const audio = new Audio('nyanMeow.mp3'); // Replace 'your-audio-file.mp3' with your audio file path
            audio.play();
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

// function setupRainbowTrail(container, event) {
//     const flower = document.createElement("img");
//     flower.src = "rainbowTrail.png"; // Replace with the path to your rainbow image

//     // Set the width and height of the rainbow image
//     flower.style.width = "100px"; // Adjust the width as needed
//     flower.style.height = "100px"; // Adjust the height as needed

//     flower.style.position = "absolute";
//     flower.style.left = (event.pageX - 25) + "px"; // Adjust the values as needed
//     flower.style.top = (event.pageY - 25) + "px";
//     container.appendChild(flower);

//     // Remove the flower element after a short duration
//     setTimeout(function() {
//         container.removeChild(flower);
//     }, 700); // Adjust the duration as needed
// }

// function setupNyanCat(container, event) {
//     const flower = document.createElement("img");
//     flower.src = "nyanCat.png"; // Replace with the path to your Nyan Cat image

//     // Set the width and height of the Nyan Cat image
//     flower.style.width = "100px"; // Adjust the width as needed
//     flower.style.height = "100px"; // Adjust the height as needed

//     flower.style.position = "absolute";
//     flower.style.left = (event.pageX - 25) + "px"; // Adjust the values as needed
//     flower.style.top = (event.pageY - 25) + "px";
//     container.appendChild(flower);

//     // Remove the Nyan Cat element after a short duration
//     setTimeout(function() {
//         container.removeChild(flower);
//     }, 15); // Adjust the duration as needed
// }

// Event bindings outside the class
// document.addEventListener("mousemove", function(event) {
//     setupRainbowTrail(document.getElementById("rainbow-trail"), event);
//     setupNyanCat(document.getElementById("nyan-cat"), event);
// });

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



const gameContainer = document.getElementById("game");
const playButton = document.querySelector(".play-button");
const resetButton = document.querySelector(".reset-button");
const guessScore = document.querySelector("#guess-score");
const bestScore = document.querySelector("#best-score");

const COLORS = [
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "red",
  "blue",
  "green",
  "orange",
  "purple"
];

let count = 0;
let score = 0;
let firstCard;
let freezeCards = true;
let shuffledColors = shuffle(COLORS);

playButton.addEventListener("click", e => {
  const cards = document.querySelectorAll("div");
  let colors = shuffle(COLORS);
  for (let i = 0; i < cards.length - 1; i++) {
    cards[i+1].setAttribute("class", colors[i]);
  }
  freezeCards = false;
  e.target.style.display = "none";
  resetButton.style.display = "inline-block";
})

resetButton.addEventListener("click", e => {
  const cards = document.querySelectorAll("div");
  if (gameOver(cards)) {
    if (localStorage.getItem("best-score") === null || score < bestScore.innerText) {
      localStorage.setItem("best-score", score);
      displayBestScore();
    }
  }
  for (let i = 1; i < cards.length; i++) {
    hideCard(cards[i]);
  }
  score = 0;
  guessScore.innerText = score;
  freezeCards = true;
  e.target.style.display = "none";
  playButton.style.display = "inline-block";
})

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

function displayBestScore() {
  bestScore.innerText = localStorage.getItem("best-score") || 0;
}

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(colorArray) {
  for (let color of colorArray) {
    // create a new div
    const newDiv = document.createElement("div");

    // give it a class attribute for the value we are looping over
    newDiv.classList.add(color);

    // call a function handleCardClick when a div is clicked on
    newDiv.addEventListener("click", handleCardClick);

    // append the div to the element with an id of game
    gameContainer.append(newDiv);
  }
}

function gameOver(cards) {
  let count = 0;
  for (let i = 1; i < cards.length; i++) {
    if (cards[i].classList.contains("flipped")) {
      count++;
    }
  }
  return count === 10;
}

function showCard(card) {
  count++;
  card.classList.toggle("flipped");
  card.style.backgroundColor = card.classList[0];
}

function hideCard(card) {
  card.classList.toggle("flipped");
  card.style.backgroundColor = "transparent";
}

// TODO: Implement this function!
function handleCardClick(event) {
  if (freezeCards) return;
  if (event.target.classList.length === 1) {
    showCard(event.target);
  }
  if (count === 1) {
    firstCard = event.target;
  } else {
    freezeCards = true;
    setTimeout(() => {
      if (!(firstCard.classList[0] === event.target.classList[0] && firstCard.classList[1] === event.target.classList[1])) {
        hideCard(firstCard);
        hideCard(event.target);
      }
      freezeCards = false;
    }, 1000)
    count = 0;
    score++;
    guessScore.innerText = score;
  }
}


createDivsForColors(shuffledColors);
displayBestScore();
// Letters
const letters = "abcdefghijklmnopqrstuvwxyz";
const lettersArray = Array.from(letters);
let lettersContainer = document.querySelector(".letters");

// Generate Letters
lettersArray.forEach((letter) => {
  let span = document.createElement("span");
  span.appendChild(document.createTextNode(letter));
  span.className = "letter-box";
  lettersContainer.appendChild(span);
});

// Object Of Words + Categories With Hints
const words = {
  programming: [
    { word: "php", hint: "Server-side scripting language" },
    { word: "javascript", hint: "Language of the web" },
    { word: "python", hint: "Popular language for AI" },
    { word: "Array", hint: "List of values" },
    { word: "Code", hint: "Instructions for the computer" },
    { word: "Bug", hint: "An error in a program" },
    { word: "Debug", hint: "Fix errors in a program" },
    { word: "HTML", hint: "The skeleton of the page" },
    { word: "Css", hint: "used to style and layout HTML elements" },
    { word: "Loop", hint: "Repeats a block of code" },
  ],
  movies: [
    { word: "Inception", hint: "Dream within a dream" },
    { word: "Coco", hint: "Disney movie about family and music" },
    { word: "Actor", hint: "Performs roles in films" },
    { word: "Script", hint: "The written dialogue for a film" },
    { word: "Trailer", hint: "A preview of a movie" },
    { word: "Up", hint: "An old man and a boy go on an adventure" },
    { word: "Memento", hint: "A man with memory loss seeks revenge" },
    {
      word: "Goodfellas",
      hint: "A story about a young man’s life in the mafia",
    },
  ],
  countries: [
    { word: "India", hint: "Home to the Taj Mahal and diverse cultures" },
    { word: "Japan", hint: "Known for sushi" },
    { word: "France", hint: "Known for the Eiffel Tower" },
    { word: "Russia", hint: "The largest country in the world" },
    { word: "China", hint: "Known for the Great Wall and pandas" },
    { word: "Mexico", hint: "Known for tacos" },
    { word: "Portugal", hint: "Known for its beautiful coast" },
    { word: "Palestine", hint: "Known for its rich history" },
    { word: "Syria", hint: "Middle Eastern country" },
    { word: "Egypt", hint: "Home to the pyramids" },
  ],
};

let previousWord = "";
let wrongAttempts = 0;
let maxAttempts = 8;
let guessSpans;
let randomValue;

// Start Game Function
function startGame() {
  let allKeys = Object.keys(words);
  let randomPropName = allKeys[Math.floor(Math.random() * allKeys.length)];
  let randomWords = words[randomPropName];
  randomValue = randomWords[Math.floor(Math.random() * randomWords.length)];

  // Avoid repeating the same word
  if (randomValue.word === previousWord) {
    return startGame();
  }
  previousWord = randomValue.word;

  // Set category and hint
  document.querySelector(".game-info .category span").innerHTML =
    randomPropName;
  document.querySelector("#hint-text").innerHTML = randomValue.hint;

  let lettersGuessContainer = document.querySelector(".letters-guess");
  lettersGuessContainer.innerHTML = "";

  // Create guess spans
  Array.from(randomValue.word).forEach((letter) => {
    let span = document.createElement("span");
    if (letter === " ") span.className = "with-space";
    lettersGuessContainer.appendChild(span);
  });

  guessSpans = document.querySelectorAll(".letters-guess span");
  wrongAttempts = 0;

  // Reset UI
  document.querySelector(".hangman-draw").className = "hangman-draw";
  lettersContainer.classList.remove("finished");
  document
    .querySelectorAll(".letter-box")
    .forEach((box) => box.classList.remove("clicked"));

  // Enable keyboard input
  document.addEventListener("keydown", keyboardHandler);
}

// Keyboard Handler
function keyboardHandler(event) {
  let letter = event.key.toLowerCase();
  if (letters.includes(letter)) {
    let box = Array.from(document.querySelectorAll(".letter-box")).find(
      (span) =>
        span.textContent === letter && !span.classList.contains("clicked")
    );
    if (box) box.click();
  }
}

// Handle Letter Click
document.addEventListener("click", (e) => {
  if (e.target.className === "letter-box") {
    e.target.classList.add("clicked");
    let clickedLetter = e.target.textContent.toLowerCase();
    let wordArray = Array.from(randomValue.word.toLowerCase());
    let correct = false;

    wordArray.forEach((letter, index) => {
      if (clickedLetter === letter) {
        correct = true;
        guessSpans[index].textContent = clickedLetter;
      }
    });

    if (!correct) {
      wrongAttempts++;
      document
        .querySelector(".hangman-draw")
        .classList.add(`wrong-${wrongAttempts}`);
      document.getElementById("fail").play();
      if (wrongAttempts === maxAttempts) endGame(false);
    } else {
      document.getElementById("success").play();
      if (
        Array.from(guessSpans).every(
          (span) =>
            span.textContent.trim() || span.classList.contains("with-space")
        )
      ) {
        endGame(true);
      }
    }
  }
});

// End Game
function endGame(win) {
  document.removeEventListener("keydown", keyboardHandler);
  lettersContainer.classList.add("finished");

  let popup = document.createElement("div");
  popup.className = "popup";
  popup.innerHTML = win
    ? `Congratulations! You guessed the word: "${randomValue.word}"!`
    : `Game Over! The word was: "${randomValue.word}".`;

  let button = document.createElement("button");
  button.textContent = "Play Again";
  button.onclick = () => {
    popup.remove();
    startGame();
  };

  popup.appendChild(button);
  document.body.appendChild(popup);
}

// Initialize Game
startGame();

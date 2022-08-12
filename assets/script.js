const questions = [
  {
    questionText: "Commonly used data types DO NOT include:",
    options: ["1. strings", "2. booleans", "3. alerts", "4. numbers"],
    answer: "3. alerts",
  },
  {
    questionText: "Arrays in JavaScript can be used to store ______.",
    options: [
      "1. numbers and strings",
      "2. other arrays",
      "3. booleans",
      "4. all of the above",
    ],
    answer: "4. all of the above",
  },
  {
    questionText:
      "String values must be enclosed within _____ when being assigned to variables.",
    options: ["1. commas", "2. curly brackets", "3. quotes", "4. parentheses"],
    answer: "3. quotes",
  },
  {
    questionText:
      "A very useful tool used during development and debugging for printing content to the debugger is:",
    options: [
      "1. JavaScript",
      "2. terminal/bash",
      "3. for loops",
      "4. console.log",
    ],
    answer: "4. console.log",
  },
  {
    questionText:
      "Which of the following is a statement that can be used to terminate a loop, switch or label statement?",
    options: ["1. break", "2. stop", "3. halt", "4. exit"],
    answer: "1. break",
  },
];

const scores = [];
const RENDER_EVENT = "render-score";
const SAVED_EVENT = "saved-score";
const STORAGE_KEY = "QUIZ_APP_SCORES";

let questionCount = 0;
let userScore = 0;
let isAnswered = false;

// quiz app elements
const introSection = document.getElementById("introSection");
const quizSection = document.getElementById("quizSection");
quizSection.style.display = "none";
const resultsSection = document.getElementById("resultsSection");
resultsSection.style.display = "none";
const highScoresSection = document.getElementById("highScoresSection");
highScoresSection.style.display = "none";
const timeCountWrapper = document.getElementById("timeCountWrapper");
timeCountWrapper.style.display = "none";
const responseText = document.getElementById("responseText");
const finalScore = document.getElementById("finalScore");

const showIntroSection = () => {
  introSection.style.display = "block";
  quizSection.style.display = "none";
  resultsSection.style.display = "none";
  highScoresSection.style.display = "none";
};

const showQuizSection = () => {
  timeCountWrapper.style.display = "block";
  introSection.style.display = "none";
  quizSection.style.display = "block";
  resultsSection.style.display = "none";
  highScoresSection.style.display = "none";

  showQuestions(questionCount);
  startTimer(10);
};

const showResultsSection = () => {
  timeCountWrapper.style.display = "none";
  introSection.style.display = "none";
  quizSection.style.display = "none";
  resultsSection.style.display = "block";
  highScoresSection.style.display = "none";
  if (!isAnswered) {
    finalScore.innerText = -100;
  }
};

const showHighScoresSection = () => {
  introSection.style.display = "none";
  quizSection.style.display = "none";
  resultsSection.style.display = "none";
  highScoresSection.style.display = "block";
};

// button elements
const startQuizButton = document.getElementById("startQuizButton");
startQuizButton.addEventListener("click", showQuizSection);

const response = document.getElementById("response");

function showQuestions(index) {
  timeCount.innerText = "Time: 00 : 10";

  response.innerText = "";
  const questionText = document.getElementById("questionText");

  questionText.innerText = questions[index].questionText;

  const optionOne = document.getElementById("optionOne");
  optionOne.className = "option";
  optionOne.innerText = questions[index].options[0];

  const optionTwo = document.getElementById("optionTwo");
  optionTwo.className = "option";
  optionTwo.innerText = questions[index].options[1];

  const optionThree = document.getElementById("optionThree");
  optionThree.className = "option";
  optionThree.innerText = questions[index].options[2];

  const optionFour = document.getElementById("optionFour");
  optionFour.className = "option";
  optionFour.innerText = questions[index].options[3];

  const option = optionsWrapper.querySelectorAll(".option");

  responseText.style.display = "none";

  for (let i = 0; i < option.length; i++) {
    option[i].setAttribute("onclick", "checkAnswer(this)");
  }
}

function checkAnswer(answer) {
  clearInterval(counter);
  isAnswered = true;

  responseText.style.display = "block";

  let userAnswer = answer.innerText;
  let correctAnswer = questions[questionCount].answer;
  const allOptions = optionsWrapper.children.length;

  if (userAnswer === correctAnswer) {
    response.innerText = "Correct!";
    userScore += 10;
  } else {
    response.innerText = "Incorrect!";
    userScore -= 5;
  }

  finalScore.innerText = userScore;

  for (let i = 0; i < allOptions; i++) {
    optionsWrapper.children[i].classList.add("disabled");
  }
  setTimeout(() => {
    questionCount++;
    if (questionCount < questions.length) {
      isAnswered = false;
      showQuestions(questionCount);
      startTimer(10);
    } else {
      showResultsSection();
    }
  }, 1000);
}

const timeCount = document.getElementById("time");

function startTimer(time) {
  counter = setInterval(timer, 1000);
  function timer() {
    time--;

    if (time < 10) {
      timeCount.innerText = "Time: 00 : 0" + time;
    }

    if (time < 0) {
      clearInterval(counter);
      timeCount.innerText = "Time Off!";

      setTimeout(() => {
        questionCount++;
        if (questionCount < questions.length) {
          showQuestions(questionCount);
          startTimer(10);
        } else {
          timeCountWrapper.style.display = "none";
          showResultsSection();
        }
      }, 1000);
    }
  }
}

function generateId() {
  return +new Date();
}

function generateScoreItemObject(id, initials, score) {
  return {
    id,
    initials,
    score,
  };
}

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Your browser does not support local storage");
    return false;
  }
  return true;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(scores);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const score of data) {
      scores.push(score);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function makeScore(scoreObject) {
  const { id, initials, score } = scoreObject;

  const userScoreListItem = document.createElement("li");
  userScoreListItem.innerText = `${initials} - ${score}`;
  userScoreListItem.setAttribute("id", `score-${id}`);

  return userScoreListItem;
}

function addScore() {
  const initials = document.getElementById("initials").value;
  const generateID = generateId();
  const score = finalScore.innerText;
  const scoreObject = generateScoreItemObject(generateID, initials, score);
  scores.push(scoreObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("form");

  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addScore();

    setTimeout(() => {
      showHighScoresSection();
    }, 1000);
  });
  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

document.addEventListener(SAVED_EVENT, () => {
  if (scores.length > 0) {
    showHighScoresSection();
  } else {
    showIntroSection();
  }
});

document.addEventListener(RENDER_EVENT, () => {
  const highScoresList = document.getElementById("highScoresList");

  highScoresList.innerHTML = "";

  const sortedScores = scores.sort((a, b) => b.score - a.score);

  for (const score of sortedScores) {
    const userScoreListItem = makeScore(score);
    highScoresList.append(userScoreListItem);
  }
});

const goBackButton = document.getElementById("goBackButton");
goBackButton.addEventListener("click", function () {
  questionCount = 0;
  userScore = 0;
  showIntroSection();
});

const clearScoresButton = document.getElementById("clearScoresButton");
clearScoresButton.addEventListener("click", function () {
  scores.length = 0;

  saveData();
  questionCount = 0;
  userScore = 0;
  highScoresList.innerHTML = "";
});

const leaderboardButton = document.getElementById("leaderboard");
leaderboardButton.addEventListener("click", showHighScoresSection);

/*
* Create a list that holds all of your cards
*/
var allCards = ["diamond",
                "diamond",
                "paper-plane-o",
                "paper-plane-o",
                "anchor",
                "anchor",
                "bolt",
                "bolt",
                "cube",
                "cube",
                "leaf",
                "leaf",
                "bicycle",
                "bicycle",
                "bomb",
                "bomb"],
//    
    cardGame,
    allCardsGame,
    deck = document.querySelector("#deck"),
    restartBtn = document.querySelector("#restart"),
    movesCounter = document.querySelector(".moves"),
    scorePanel = document.querySelector(".stars"),
    stars = scorePanel.querySelectorAll("li"),
    timer = document.querySelector(".timer"),
    congratsModal = document.querySelector(".congrats-modal"),
    closeCongrats = document.querySelector(".close-modal"),
    minutes = document.querySelector("#minutes"),
    seconds = document.querySelector("#seconds"),
    moves = 0,
    sec = 0,
    min = 0,
    interval;


// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

// ---- Creates a new deck of shuffled cards
//clears the deck, moves, stars and timer every time newDeck is called
function newGame(){
  var cardsOnBoard = shuffle(allCards);
  deck.innerHTML = " "; 
  moves = 0;
  movesCounter.innerHTML = moves;
  for (star of stars) {
    star.style.visibility = 'visible';
  }
  resetTimer();

  for(cardIndex = 0; cardIndex < allCards.length; cardIndex++){
    var card = deck.appendChild(document.createElement('li'));
    card.classList.add('card');
    card.innerHTML += '<i class="fa fa-'+ allCards[cardIndex] +'"></i>';
  }
  //transforms an HTML colletion in an array
  cardGame = document.getElementsByClassName("card");
  allCardsGame = [...cardGame];
};

window.onload = newGame();

// ---- Restart button ----
restartBtn.addEventListener("click", newGame);


var cardSelected = "",
    matchCards = [], // stores matched cards
    flippedCards = [];  // keeps track of how many cards were flipped

// evt.target.nodeName: verifies target is desired element ; flippedCards only allow two selections at a time
deck.addEventListener('click', function (evt) {
  var cardTarget = evt.target;
  if (cardTarget.nodeName === 'LI' && flippedCards.length < 2) {
    cardSelected = cardTarget.children[0].classList[1];
    cardTarget.classList.add("open", "show", "disabled");
    flippedCards.push(cardSelected);

    if(flippedCards.length === 2){
      moveCounter();
      if(flippedCards[0] === flippedCards[1]){
        matchCards.push(flippedCards[0], flippedCards[1])
        matched();
      } else {
        unmatched();
      }
    }
  }
  congrats();
});
// ---- END of deck.addEventListener

// ----  when cards are a match ----
var matched = () => {
  flippedCards = [];
  var show = document.querySelectorAll(".show");

  show.forEach(card => {
    card.classList.add("match", "disabled");
    card.classList.remove("open");
  });
};

// ---- when cards are an unmatch ----
var unmatched = () => {
    cardSelected = '';
    flippedCards = [];

  // ---- sets a delay to turn card back in the original position
  setTimeout(function(){
    var selectElem = document.querySelectorAll(".show");
    for (var i=0; i < selectElem.length; i++) {
      enable();
      selectElem[i].classList.remove('show', 'open', 'disabled');
    }
  },700);
};

// ---- disable a second click in a card already selected
function disable(){
  [].filter.call(allCardsGame, function(card) {
    card.classList.add('disabled');
  });
}

function enable(){
  [].filter.call(allCardsGame, function(card) {
    for(var i = 0; i < matchCards.length; i++){
      document.getElementsByClassName("match")[i].classList.add("disabled");
    }
  });
}

// ---- Moves Counter function & Stars Rating based on moves ----
function moveCounter(){
  moves++;
  movesCounter.innerHTML = moves;

  if(moves === 1) {
    timeCounter();
  }

  if (moves === 10) {
    scorePanel.lastElementChild.style.visibility = 'hidden';
  } else if (moves === 20) {
    scorePanel.lastElementChild.previousElementSibling.style.visibility = 'hidden';
  }
}

// ---- Time counter ----
function timeCounter(){
  interval = setInterval(function(){
    sec++;
    seconds.innerHTML = sec;

    if (sec <= 9) {
      seconds.innerHTML = "0" + sec;
    }
    if (sec === 59){
      min++;
      sec = 0;
      minutes.innerHTML = min;

      if (min <= 9) {
        minutes.innerHTML = "0" + min;
      } else if (min > 9) {
        minutes.innerHTML = min;
      }
    }
  },1000);
}

// ---- Restart time counter ----
function resetTimer(){
  sec = 0;
  min = 0;
  clearTimeout(interval);
  seconds.innerHTML = "00";
  minutes.innerHTML = "00";
}

// Congratulations modal when all cards match, show all details
function congrats(){
  if (matchCards.length === 16){
    clearInterval(interval);
    finalTime = timer.innerHTML;

    // Shows modal
    congratsModal.classList.add("show-modal");

    // Declare star rating
    var starRating = document.querySelector(".stars").innerHTML;

    //Display move, rating, time on modal
    document.getElementById("finalMove").innerHTML = moves;
    document.getElementById("starRating").innerHTML = starRating;
    document.getElementById("totalTime").innerHTML = finalTime;

    // Play again
    closeModal();
  };
}

// ---- Close modal ----
function closeModal(){
  closeCongrats.addEventListener("click", function(evt){
    congratsModal.classList.remove("show-modal");
    newGame();
    matchCards = [];
  });
}

    
"use strict";

class Card {
    constructor(value, suit, rank, order, hex, points = 0) {
        this.value = value; // "two", ..., "jack", "queen", "king", "ace"
        this.suit = suit; // "hearts", "spades", "diamonds", "clubs"
        this.rank = rank; // # 1 < 2 < 3 < ... < 14
        this.order = order; // order the cards appear in a player's hand
        this.hex = hex; // unicode for playing card
        this.points = points; // points the card is worth
    }
}

const game = {
    // card construction variables
    cardValues: ["two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "jack", "queen", "king", "ace"],
    cardValueHex: ["2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "D", "E", "1"],
    cardSuits: ["hearts", "spades", "diamonds", "clubs"],
    cardSuitHex: ["B", "A", "C", "D"],

    // specific cards
    faceDownCard: new Card("", "", -1, -1, "1F0A0"),
    queenOfSpades: 0,
    jackOfDiamonds: 0,

    // options
    numberOfPlayers: 4,
    targetScore: 50,
    firstTrickNoPoints: true,
    blackLady: true, // more info at https://en.wikipedia.org/wiki/Black_Lady
    jackOfDiamondsVariation: false, // jack of diamonds worth -10 points
    djTheMoon: false, // require jack of diamonds to shoot the moon
    shootingTheMoon: true,
    shootingTheSun: false,
    newMoon: "never", // "always", "choice", "if necessary", "never"
    computerOpponents: true,
    cardsVisible: false,

    // game initialization
    masterDeck: [[], [], [], []],
    moonThreshold: 0,
    playerNames: [],

    // html elements
    tableDisplay: $("#table"),
    previousTrickDisplay: $("#previous-trick"),
    rulesForm: $("#starting-options form"),
    resignButton: $("button.resign"),
    infoButtonDisplay: $("button.info"),
    infoScreen: $("#info-screen"),

    // sound
    cardSoundArray: $(".card-sound"),
    cardSound: $(".card-sound")[0],

    infoButton() {
        game.infoButtonDisplay.off();
        game.infoButtonDisplay.on("click", () => {
            game.infoScreen.toggle();
        });
    },

    closeInfoScreenButton() {
        game.infoScreen.children("button.close").off();
        game.infoScreen.children("button.close").on("click", () => {
            game.infoScreen.css("display", "none");
        });
    },

    setup() {
        // create (master) deck of cards
        for (let i = 0; i < 4; i++) {
            let p = 0;
            if (i === 0) { // hearts worth 1 point
                p = 1;
            }
            for (let j = 0; j < 13; j++) {
                game.masterDeck[i][j] = new Card(
                                        game.cardValues[j], 
                                        game.cardSuits[i], 
                                        j + 2, 
                                        ((3 - i) * 100) + j + 2, 
                                        "1F0" + game.cardSuitHex[i] + game.cardValueHex[j], 
                                        p)
            }
        }

        // specific cards
        game.queenOfSpades = game.masterDeck[1][10];
        game.jackOfDiamonds = game.masterDeck[2][9];
        
        // play card sound faster
        game.cardSound.playbackRate = 2;

        // resign button
        game.resignButton.off();
        game.resignButton.on("click", () => {

            // clear all cards
            for (let player = 0; player < game.numberOfPlayers; player++) {
                $("#hand-" + player).html("");
                game.tableDisplay.children('.card-' + player).html("");
            }
            game.previousTrickDisplay.html("");

            $("#end-screen p").html("You resigned.");
            game.end();
        });

        // info button
        game.infoButton();

        // close info screen button
        game.closeInfoScreenButton();

        // receive customizations (incomplete)
        game.rulesForm.off();
        game.rulesForm.submit( e => {
            e.preventDefault();

            // hide form
            game.rulesForm.css("display", "none");

            // handle form data
            game.playerNames = [];
            for (let player = 0; player < game.numberOfPlayers; player++) {
                game.playerNames.push($("#player-name-" + player).val());
                if (game.playerNames[player] === "") {
                    game.playerNames[player] = "Player " + (player + 1);
                }
            }

            game.targetScore = $("#target-score").val();
            if (game.targetScore === "") {
                game.targetScore = 50;
            }

            game.blackLady = $("#black-lady").is(":checked");

            game.jackOfDiamondsVariation = $("#jack-of-diamonds-variation").is(":checked");

            game.djTheMoon = $("#dj-the-moon").is(":checked");

            game.shootingTheMoon = $("#shooting-the-moon").is(":checked");

            game.shootingTheSun = $("#shooting-the-sun").is(":checked");

            game.newMoon = $("#new-moon").val();

            game.computerOpponents = $("#computer-opponents").is(":checked");

            game.cardsVisible = $("#cards-visible").is(":checked");

            // prevent softlocking
            if (!game.computerOpponents) {
                game.cardsVisible = true;
            }

            // start game
            game.start();
        });

    },

    start() {
        // process customizations

        //   player names
        for (let player = 0; player < game.numberOfPlayers; player++) {
            $("#score-" + player + " .player-name").html(game.playerNames[player] + ":");
        }

        //   number of players (see roundStart)
        //   target score (see roundEnd)
        //   first trick no points (see checkSelection)

        //   black lady
        if (game.blackLady) {
            game.queenOfSpades.points = 13;
        }

        //   jack of diamonds variation
        if (game.jackOfDiamondsVariation) {
            game.jackOfDiamonds.points = -10;
        }

        //   require jack of diamonds for shooting the moon (see roundEnd)

        //   shooting the moon (see roundEnd)
        //   shooting the sun (see roundEnd)
        if (game.shootingTheMoon || game.shootingTheSun) {

            // determine threshold for shooting the moon
            game.masterDeck.forEach(function(suit) {
                suit.forEach(function(card) {
                    if (card.points > 0) {
                        game.moonThreshold += card.points;
                    }
                })
            });
        }

        //   new moon (see roundEnd)

        game.gameplay();
    },

    gameplay() {

        /*game initialization
        Note: some of these variables are local instead of global in order
              to hide them from console so that players cannot cheat by 
              looking at their opponent's hands */
        let deck = game.masterDeck.flat(); // local copy of flattened masterDeck
        let hand = [];
        let score = [];
        let roundNumber = 1;
        game.tableDisplay.html("");
        for (let player = 0; player < game.numberOfPlayers; player++) {
            hand.push([]);
            score.push(0);
            game.tableDisplay.append('<div class="card-' + player + '"></div>');
        }
        const dealCardDelay = 50;

        // initialize score display
        for (let player = 0; player < game.numberOfPlayers; player++) {
            let playerScoreDisplay = $("#score-" + player);
            playerScoreDisplay.children(".old-score").html(score[player]);
            playerScoreDisplay.children(".new-score").html("");
            playerScoreDisplay.children(".score-change").html("");
        }
        
        // round initialization (values are reset every round)
        let roundScore = [];
        let wonCards = [];
        let selected = [];
        let turn = -1;
        let heartsBroken = false;
        let suit = "clubs";
        let trickNumber = 1;
        let trickWinner = -1;
        let leadingCard = game.jackOfDiamonds;
        let dealCardDelayTracker = 0;

        // trick initialization (values are reset every trick)
        let table = [];
        let turnCounter = 0;
        let playingPlayer = -1;

        // turn initialization (values are reset every turn)
        let play = game.faceDownCard;
        let hasSuit = false;
        let hasNonHeart = false;
        let hasPointless = false;

        // html element for card
        function cardHTML(hex, suit, zIndex) {
            return ('<p class="card ' + suit + " x" + hex +
                    '" style=z-index:' + zIndex + ';>&#x' + hex + ';</p>');
        }

        // add html element for card to hand
        function appendCardToHand(player, hex, suit, zIndex, visible = game.cardsVisible) {
            if ((player != 0) && !visible) {
                $("#hand-" + player).append(cardHTML(game.faceDownCard.hex, game.faceDownCard.suit, zIndex));
            } else {
                $("#hand-" + player).append(cardHTML(hex, suit, zIndex));
            }
        }

        function updateCardClicking(player) {

            if (!game.cardsVisible && (player != 0)) {

            } else {

                // iterate over every card in player's hand
                for (let i = 0; i < hand[player].length; i++) {

                    // clear previous event
                    $(".x" + hand[player][i].hex).off();

                    // update event
                    $(".x" + hand[player][i].hex).on("click", () => {

                        // deselect previous selection display
                        if (selected[player] instanceof Card) {
                            $(".x" + selected[player].hex).removeClass("selected");
                        }

                        // if player is trying to click the previously selected card
                        if (selected[player] === hand[player][i]) {
                            selected[player] = false;

                        // otherwise add card to selection
                        } else {
                            selected[player] = hand[player][i];
                            $(".x" + selected[player].hex).addClass("selected");
                            
                            // check selection if applicable
                            if ((turn === player) && (selected[player] instanceof Card)) {
                                checkSelection(player);
                            }
                        }
                    }); 
                }
            }
        }

        // beginning of a round in a game
        function roundStart() {

            // hide resign button
            game.resignButton.css("display", "none");

            // clear previous trick
            game.previousTrickDisplay.html("");

            // shuffle deck (Fisher–Yates shuffle)
            // more info: https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle#The_modern_algorithm
            for (let i = deck.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                const temp = deck[i];
                deck[i] = deck[j];
                deck[j] = temp;
            }

            // clear display
            for (let player = 0; player < game.numberOfPlayers; player++) {
                $("#hand-" + player).html("");
            }

            // deal cards
            dealCardDelayTracker = 0;
            hand = [];
            for (let player = 0; player < game.numberOfPlayers; player++) {
                hand.push([]);
            }
            for (let i = 0; i < deck.length; i++) {
                let player = i % game.numberOfPlayers;
                let cardPosition = hand[player].length;
                dealCardDelayTracker += dealCardDelay;
                hand[player].push(deck[i]);
                let card = hand[player][cardPosition];
                setTimeout(() => {

                    // play sound when it is player's turn
                    if ((i % game.numberOfPlayers) === 0) {
                        game.cardSoundArray[i / game.numberOfPlayers].play();
                    }

                    // display card
                    appendCardToHand(player, card.hex, card.suit, cardPosition);
                }, dealCardDelayTracker);
            }

            // reset round variables
            roundScore = [];
            wonCards = [];
            selected = [];
            heartsBroken = false;
            suit = "clubs";
            trickNumber = 1;
            trickWinner = -1;
            turn = -1;
            leadingCard = deck[0];
            for (let player = 0; player < game.numberOfPlayers; player++) {
                roundScore.push(0);
                wonCards.push([]);
                selected.push(false);
                hand[player].sort((card1, card2) => card2.order - card1.order);
            }

            setTimeout(() => {

                // display resign button
                game.resignButton.css("display", "block");

                // clear display
                for (let player = 0; player < game.numberOfPlayers; player++) {
                    $("#hand-" + player).html("");
                }

                // update card display
                for (let i = 0; i < hand[0].length; i++) {
                    for (let player = 0; player < game.numberOfPlayers; player++) {
                        appendCardToHand(player, hand[player][i].hex, hand[player][i].suit, i);
                    }
                }

                // make cards clickable
                for (let player = 0; player < game.numberOfPlayers; player++) {
                    updateCardClicking(player);
                }

                // determine which card leads and who goes first
                for (let player = 0; player < game.numberOfPlayers; player++) {
                    hand[player].sort((card1, card2) => card2.order - card1.order);
                    if (hand[player][hand[player].length - 1].order <= leadingCard.order) {
                        leadingCard = hand[player][hand[player].length - 1];
                        trickWinner = player;
                    }
                }
                
                trickStart();

            }, dealCardDelay * deck.length + 500);
        }

        function trickStart() {
            turnCounter = 0;
            turnStart();
        }

        function turnStart() {

            // initialize turn
            play = false;
            hasSuit = false;
            hasNonHeart = false;
            hasPointless = false;

            // determine which player is playing
            playingPlayer = (trickWinner + turnCounter) % game.numberOfPlayers;
            
            // if the player has more than one card
            if (hand[playingPlayer].length > 1) {

                // determine which cards the player is allowed to play
                for (let j = 0; j < hand[playingPlayer].length; j++) {
                    if (hand[playingPlayer][j] === leadingCard) {
                        selected[playingPlayer] = leadingCard;
                        break;
                    }
                    if (hand[playingPlayer][j].suit === suit) {
                        hasSuit = true;
                    }
                    if (hand[playingPlayer][j].suit != "hearts") {
                        hasNonHeart = true;
                    }
                    if (hand[playingPlayer][j].points === 0) {
                        hasPointless = true;
                    }
                }

                // check if player already selected a card (QoL improvement)
                if (selected[playingPlayer] instanceof Card) {
                    play = checkSelection(playingPlayer);
                }

                // wait for player to select card
                if (play === false) {
                    turn = playingPlayer;

                    if (game.computerOpponents && playingPlayer != 0) {
                        computerOpponentWrapper(playingPlayer);
                    }
                }

            // if player has only one card (i.e. no choice)
            } else {
                play = hand[playingPlayer][0];
                if (trickWinner === playingPlayer) {
                    suit = play.suit;
                }
                turnEnd();
            }
        }

        // wrapper function for computerOpponent
        function computerOpponentWrapper(player) {
            let tempHand = hand[player].slice();
            setTimeout(() => {computerOpponent(player, tempHand);}, 500);
        }

        // repeatedly tries to select a card until a valid one is selected
        function computerOpponent(player, tempHand) {
            selected[player] = tempHand.splice(Math.floor(Math.random() * tempHand.length), 1)[0];
            if (!checkSelection(player)) {
                setTimeout(() => {computerOpponent(player, tempHand);}, 10);
            }
        }

        // returns true if and only if selection is valid
        function checkSelection(player) {
            
            // update display
            $(".x" + selected[player].hex).removeClass("selected");
            
            // determine which card the player is allowed to play
            // check card is in hand
            if (!hand[player].includes(selected[player])) {
                selected[player] = false;
                return false;

            // trick winner selects leading card
            } else if (trickWinner === player) {
                if ((selected[player].suit === "hearts") && (!heartsBroken) && hasNonHeart) {
                    selected[player] = false;
                    return false;
                } else {
                    play = selected[player];
                    suit = play.suit;
                    
                    // end player's turn
                    turn = -1;
                    turnEnd();
                    return true;
                }

            // other players must follow suit
            } else if ((selected[player].suit != suit) && hasSuit) {
                selected[player] = false;
                return false;
            } else if ((trickNumber === 1) && selected[player].points && hasPointless && game.firstTrickNoPoints) {
                selected[player] = false;
                return false;
            } else {
                play = selected[player];

                // end player's turn
                turn = -1;
                turnEnd();
                return true;
            }
        }

        function turnEnd() {

            // play card sound
            game.cardSound.play();

            // player removes card from their hand and places it on the table
            selected[playingPlayer] = false;
            table[playingPlayer] = play;
            hand[playingPlayer].splice(hand[playingPlayer].indexOf(play), 1);

            // update display            
            game.tableDisplay.children(".card-" + playingPlayer).html(cardHTML(play.hex, play.suit, 0));
            if (!game.cardsVisible && (playingPlayer != 0)) {
                $("#hand-" + playingPlayer + " .x" + game.faceDownCard.hex).first().remove();
            } else {
                $("#hand-" + playingPlayer + " .x" + play.hex).remove();
                updateCardClicking(playingPlayer);
            }

            // check if trick has ended
            turnCounter++;
            if (turnCounter < game.numberOfPlayers) {
                turnStart();
            } else {
                setTimeout(() => {trickEnd();}, 1000);
            }
        }

        function trickEnd() {

            // show previous trick
            game.previousTrickDisplay.html(game.tableDisplay.html());

            // determine who won the trick
            let highest = -1;

            for (let player = 0; player < table.length; player++) {
                if ((table[player].suit === suit) && (table[player].rank > highest)) {
                    highest = table[player].rank;
                    trickWinner = player;
                }
                if (table[player].suit === "hearts") {
                    heartsBroken = true;
                }
            }

            wonCards[trickWinner] = wonCards[trickWinner].concat(table); //add trick to winner's won cards

            // reset table
            table = [];
            for (let player = 0; player < game.numberOfPlayers; player++) {
                table.push(false);
                game.tableDisplay.children('.card-' + player).html("");
            }
            
            trickNumber++;

            if (hand[0].length > 0) {
                trickStart();
            } else {
                roundEnd();
            }
        }

        function roundEnd() {

            // determine scoring for this round
            for (let player = 0; player < game.numberOfPlayers; player++) {
                
                // check if player shot the sun (otherwise check if player shot the moon or calculate the score as usual)
                if (game.shootingTheSun && (wonCards[player].length === deck.length)) {

                    // check if jack of diamonds is required to shoot the sun
                    if (game.jackOfDiamondsVariation && !game.djTheMoon) {
                        roundScore[play] += game.jackOfDiamonds.points;
                    }

                    // determine which type of sun to shoot
                    let sunType = "";

                    if (game.newMoon === "always") {
                        sunType = "new";
                    } else {
                        sunType = "old";
                    }

                    // determine score change based on type of sun shot
                    if (sunType === "new") {
                        roundScore[player] += -2 * game.moonThreshold;
                    } else {
                        for (let j = 0; j < game.numberOfPlayers; j++) {
                            if (j != player) {
                                roundScore[j] += 2 * game.moonThreshold;
                            }
                        }
                    }

                } else {

                    // determine if player shot the moon
                    let moonTest = 0;
                    let moonShot = false;
                    let hasJackOfDiamonds = false;

                    // calculate number of points player won
                    for (let i = 0; i < wonCards[player].length; i++) {
                        if (wonCards[player][i].points > 0) {
                            moonTest += wonCards[player][i].points;
                        }
                        if (wonCards[player][i] === game.jackOfDiamonds) {
                            hasJackOfDiamonds = true;
                        }
                    }

                    // check points againts threshold
                    if (moonTest === game.moonThreshold) {
                        if (game.jackOfDiamondsVariation && game.djTheMoon) {
                            moonShot = hasJackOfDiamonds;
                        } else {
                            moonShot = true;
                        }
                    }

                    // check if player shot the moon (otherwise determine score as usual)
                    if (game.shootingTheMoon && moonShot) {

                        // check if jack of diamonds is required to shoot the moon
                        if (game.jackOfDiamondsVariation && !game.djTheMoon) {
                            roundScore[player] += game.jackOfDiamonds.points;
                        }

                        // determine which type of moon to shoot
                        let moonType = "";

                        if (game.newMoon === "always") {
                            moonType = "new";
                        } else {
                            moonType = "old";
                        }
                        
                        // determine score change based on type of moon shot
                        if (moonType === "new") {
                            roundScore[player] += -1 * game.moonThreshold;
                        } else {
                            for (let j = 0; j < game.numberOfPlayers; j++) {
                                if (j != player) {
                                    roundScore[j] += game.moonThreshold;
                                }
                            }
                        }

                    // otherwise determine score as usual
                    } else {
                        for (let i = 0; i < wonCards[player].length; i++) {
                            roundScore[player] += wonCards[player][i].points;
                        }
                    }
                }

                // filter and sort points cards that each player obtained
                let tempCards = [];
                for (let i = 0; i < wonCards[player].length; i++) {
                    if (wonCards[player][i].points != 0) {
                        tempCards.push(wonCards[player][i]);
                    }
                }
                tempCards.sort((card1, card2) => card2.order - card1.order);
                wonCards[player] = tempCards.slice();

            }

            // update scores for this round
            for (let player = 0; player < game.numberOfPlayers; player++) {
                let playerScoreDisplay = $("#score-" + player);
                playerScoreDisplay.children(".old-score").html(score[player]);
                score[player] += roundScore[player];
                playerScoreDisplay.children(".new-score").html(" &#x2192; " + score[player]);
                if (roundScore[player] < 0) {
                    playerScoreDisplay.children(".score-change").html(" (" + roundScore[player] + ")");
                } else {
                    playerScoreDisplay.children(".score-change").html(" (+" + roundScore[player] + ")");
                }
                
                // display points cards that each player won
                for (let i = 0; i < wonCards[player].length; i++) {
                    appendCardToHand(player, wonCards[player][i].hex, 
                                     wonCards[player][i].suit, i, true);
                }
            }

            roundNumber++;
            
            // start another round if no one reached target score
            if (Math.max(...score) < game.targetScore) {
                setTimeout(() => {roundStart();}, 6000);
                
            // otherwise end the game
            } else {

                // hide resign button (prevent bad sportsmanship)
                game.resignButton.css("display", "none");

                // determine which player(s) won the game
                const winningScore = Math.min(...score);
                let winners = [];
                for (let player = 0; player < game.numberOfPlayers; player++) {
                    if (score[player] === winningScore) {
                        winners.push(player);
                    }
                }

                if (winners.length === 1) {
                    $("#end-screen p").html(game.playerNames[winners[0]] + " wins!");
                } else {
                    for (let player = 0; player < (winners.length - 1); player++) {
                        $("#end-screen p").append(game.playerNames[winners[player]] + ", ");
                    }
                    $("#end-screen p").append("and " + game.playerNames[winners[winners.length - 1]] + " win!");
                }
                
                setTimeout(() => {game.end();}, 3000);
            }
        }
        
        roundStart();
        
    },

    end() {

        // hide resign button
        game.resignButton.css("display", "none");

        // display end screen
        $("#end-screen").css("display", "block");

        // play again with same rules
        $("#end-screen button.same").off();
        $("#end-screen button.same").on("click", () => {
            $("#end-screen").css("display", "none");
            $("#end-screen p").html("");
            game.gameplay();
        });

        // play again with new rules
        $("#end-screen button.new").off();
        $("#end-screen button.new").on("click", () => {
            $("#end-screen").css("display", "none");
            $("#end-screen p").html("");
            game.rulesForm.css("display", "block");
            game.setup();
        });
    },
};

$(() => {
    game.setup();
});
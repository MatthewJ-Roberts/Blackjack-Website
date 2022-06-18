var player = document.getElementById("player");
var dealer = document.getElementById("dealer");

var playerNumber = 0;
var balance = 100;
var betTotal = 0;

var playerAce = 0;
var dealerAce = 0;

var numPlays = 0;
var doubleBet = false;

var flatBonus = 0;
var percentBonus = 0;

var numItems = [0, 0];

//Source: https://www.thatsoftwaredude.com/content/6417/how-to-code-blackjack-using-javascript
var suits = ["♠", "♥", "♦", "♣"];
var values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
var deck = [];

function createDeck() {

    deck = [];

    for (var i = 0 ; i < values.length; i++) {

        for(var x = 0; x < suits.length; x++) {
            var weight = parseInt(values[i]);
            if (values[i] == "J" || values[i] == "Q" || values[i] == "K")
                weight = 10;
            if (values[i] == "A")
                weight = 11;
            var card = { Value: values[i], Suit: suits[x], Weight: weight };
            deck.push(card);
        }
    }
}

window.onload = function WindowLoad(event) {
    
    for (let index = 1; index < player.childNodes.length-2; index+=2) {
        const element = player.childNodes[index];
        element.style.display = "none";
    }

    for (let index = 1; index < dealer.childNodes.length-2; index+=2) {
        const element = dealer.childNodes[index];
        element.style.display = "none";
    }

    if (numPlays === 3) {
        balance = balance + 50;
        numPlays = 0;
    }

    document.getElementById("playerTotal").textContent = 0;
    document.getElementById("dealerTotal").textContent = 0;
    playerNumber = 0;
    betTotal = 0;
    playerAce = 0;
    dealerAce = 0;
    balance = balance + flatBonus;
    numPlays = numPlays + 1;
    document.getElementById("bet").textContent = "Bet: " + 0;
    document.getElementById("balance").textContent = "Coins: " + balance;
    createDeck();

}

//Source: https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function bet() {

    var val = document.getElementById("betAmount").value;

    if (playerNumber > 0 && !doubleBet) {
        return;
    }

    var betAmount = document.getElementById("bet");

    if ((betTotal + Number(val)) > balance) {
        return;
    } else {
        betTotal = betTotal + Number(val);
        betAmount.textContent = "Bet: " + betTotal;
    }

}

async function hit() {
    var cardIndex = Math.floor((Math.random() * (deck.length-1)) + 1);

    for (let index = 1; index < player.childNodes.length-2; index+=2) {
        const element = player.childNodes[index];

        if (element.style.display === "none") {
            element.textContent = deck[cardIndex].Value + " " + deck[cardIndex].Suit;
            element.style.display = "grid";
            break;
        }

    }

    if (deck[cardIndex].Weight === 11) {
        playerAce = playerAce + 1;
    }

    playerNumber = playerNumber + deck[cardIndex].Weight;
    deck.splice(cardIndex, 1);
    document.getElementById("playerTotal").textContent = playerNumber;
    await sleep(50);

    if (playerNumber > 21 && playerAce > 0) {
        playerAce = playerAce - 1;
        playerNumber = playerNumber - 10;
        document.getElementById("playerTotal").textContent = playerNumber;
    } else if (playerNumber > 21) {
        alert("Player Bust!");
        balance = balance - betTotal;
        dispatchEvent(new Event('load'));
    }

}

async function stand() {

    var cardIndex = 0;
    var number = 0;

    for (let index = 1; index < dealer.childNodes.length-2; index+=2) {
        const element = dealer.childNodes[index];
        cardIndex = Math.floor((Math.random() * (deck.length-1)) + 1);
        
        if (element.style.display === "none") {
            element.textContent = deck[cardIndex].Value + " " + deck[cardIndex].Suit;
            element.style.display = "grid";
        }

        if (deck[cardIndex].Weight === 11) {
            dealerAce = dealerAce + 1;
        }

        number = number + deck[cardIndex].Weight;
        deck.splice(cardIndex, 1);
        document.getElementById("dealerTotal").textContent = number;

        if (number > 21 && dealerAce > 0) {
            dealerAce = dealerAce - 1;
            number = number - 10;
            document.getElementById("dealerTotal").textContent = number;
        }

        await sleep(1000);

        if (number >= 16) {
            break;
        }

    }

    if (number > 21) {
        alert("Dealer Bust! Player Wins!");
        balance = balance + betTotal + (betTotal * percentBonus);
    } else if (number > playerNumber) {
        alert("Dealer Wins!");
        balance = balance - betTotal;
    } else if (number < playerNumber) {
        alert("Player Wins!");
        balance = balance + betTotal + (betTotal * percentBonus);
    } else {
        alert("Draw.");
    }

    //Source: https://stackoverflow.com/questions/9642823/force-a-window-onload-event-in-javascript
    dispatchEvent(new Event('load'));

}

async function double() {
    doubleBet = true;
    bet(betTotal);
    doubleBet = false;
    hit();

    if (playerNumber <= 21) {
        await sleep(1000);
        stand();
    }

}

function store() {

    if (document.getElementById("bet").style.display === "none") {
        player.style.display = "grid";
        dealer.style.display = "grid";
        document.getElementById("choices").style.display = "grid";
        document.getElementById("bet").style.display = "grid";
        document.getElementById("betAmount").style.display = "grid";
        document.getElementById("submitBet").style.display = "grid";
        document.getElementById("items").style.display = "none";
    } else {
        player.style.display = "none";
        dealer.style.display = "none";
        document.getElementById("choices").style.display = "none";
        document.getElementById("bet").style.display = "none";
        document.getElementById("betAmount").style.display = "none";
        document.getElementById("submitBet").style.display = "none";
        document.getElementById("items").style.display = "grid";
    }

}

function buyBackground(val) {
    var item;
    var price;
    item = val.textContent.substring(0, val.textContent.indexOf(" "));
    price = val.textContent.substring(val.textContent.indexOf(":") + 2, val.textContent.lastIndexOf(" "));

    if ((balance - Number(price)) < 0) {
        return;
    }

    document.body.style.background = item;
    balance = balance - Number(price);
    document.getElementById("balance").textContent = "Coins: " + balance;
    document.getElementById(val.id).textContent = 
    val.textContent.substring(0, val.textContent.indexOf(":") + 1) + " 0 coins"; 
}

function buyFlatBonus(val) {
    var price;
    price = val.textContent.substring(val.textContent.indexOf(":") + 2, val.textContent.lastIndexOf(" "));

    if ((balance - Number(price)) < 0) {
        return;
    }

    numItems[0] = numItems[0] + 1

    flatBonus = flatBonus + 10;
    balance = balance - Number(price);
    document.getElementById("balance").textContent = "Coins: " + balance;
    if (numItems[0] <= 1) {
        document.getElementById(val.id).textContent = "(" + numItems[0] + ") " + 
        val.textContent.substring(0, val.textContent.indexOf(":") + 1) + " " + (Number(price) + 100) + " coins";
        return;
    }
    document.getElementById(val.id).textContent = "(" + numItems[0] + ") " + 
    val.textContent.substring(4, val.textContent.indexOf(":") + 1) + " " + (Number(price) + 100) + " coins";

}

function buyPercentBonus(val) {
    var price;
    price = val.textContent.substring(val.textContent.indexOf(":") + 2, val.textContent.lastIndexOf(" "));

    if ((balance - Number(price)) < 0) {
        return;
    }

    numItems[1] = numItems[1] + 1

    percentBonus = percentBonus + 0.5;
    balance = balance - Number(price);
    document.getElementById("balance").textContent = "Coins: " + balance;
    if (numItems[1] <= 1) {
        document.getElementById(val.id).textContent = "(" + numItems[1] + ") " + 
        val.textContent.substring(0, val.textContent.indexOf(":") + 1) + " " + (Number(price) * 2) + " coins";
        return;
    }
    document.getElementById(val.id).textContent = "(" + numItems[1] + ") " + 
    val.textContent.substring(4, val.textContent.indexOf(":") + 1) + " " + (Number(price) * 2) + " coins";

}
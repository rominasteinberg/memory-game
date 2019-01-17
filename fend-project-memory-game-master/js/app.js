/*
 * IMPORTANT! When I started writing my code, I did it in Spanish, since it was easier for me to understand it and carry it out.
My idea was to make the translation once it was finished and working.
Big mistake.
When I wanted to translate it, it started to break everywhere, so I decided to leave it like this and learn for the next projects.
I will try to leave comments throughout the code to make it easy to read. Sorry for the inconvenience.
 */

//GLOBAL
const arrayLike = document.querySelectorAll('.card');
const grid = [];
const deck = document.querySelector('.deck');
const tablero =  document.querySelectorAll('.deck');
let relojApagado = true; //clock Off
let coincidencias = []; //matches
let cartasAbiertas = []; //Open cards
let movimientos = 0; // moves
const stars = document.getElementsByClassName('fa fa-star');
let time = 0;
let segundos = 0; // seconds
let minutos = 0; // minutes
let intervalo; // interval

//EVENTLISTENER FOR REPLAY
const refresh = document.querySelector('.restart');

function shuffleCards () {
	grid.push.apply(grid, arrayLike);
	shuffle(grid);
	//loop through each card and create its HTML
	for (carta of grid) { //card of grid
		deck.appendChild(carta); //add each card's HTML to the page
	}
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
	const startingTime = performance.now();
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

shuffleCards();

refresh.addEventListener('click', playAgain);
//* set up the event listener for a card. If a card is clicked:

for (carta of tablero) { //card of tablero(deck)
	carta.addEventListener('click', function () {
		const cartaClickeada = event.target; //Clicked card
		if (relojApagado) { //clock off
			startTimer();
			relojApagado = false;
			}
		if (conditionsToOpenCard(cartaClickeada)) {
			abrirCarta(cartaClickeada); // open card(clickedCard)
			agregarCartaALista(cartaClickeada); // addCartToList
			agregarMovimientos(cartaClickeada); //addMoves
			cambiarScore(cartaClickeada); //changeScore
			if (cartasAbiertas.length === 2) { //if the list already has another card, check to see if the two cards match
				if (
					cartasAbiertas[0].firstElementChild.className ===
					cartasAbiertas[1].firstElementChild.className) {
					coincidencia(cartaClickeada); // if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
					} else {
					shakeCard();
					setTimeout(noCoinciden,	800); //don't match
				}
			}
		}
		if (coincidencias.length===16) { //match.length
			addModal();
		}

	} )
}

function conditionsToOpenCard(cartaClickeada) {
	return (
		cartaClickeada.classList.contains('card') && //clickedCard
		cartasAbiertas.length < 2 &&	//openCards
		!cartasAbiertas.includes(cartaClickeada) &&
		!coincidencias.includes(cartaClickeada)) //matches
}

//- display the card's symbol (put this functionality in another function that you call from this one)
function abrirCarta (cartaClickeada) { //openCard
	cartaClickeada.classList.toggle('open')
	cartaClickeada.classList.toggle('show');
}
//add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)


function agregarCartaALista (cartaClickeada) { //addCardToAList
	cartasAbiertas.push(cartaClickeada); //openCards.push(clickedCard)
}

function coincidencia (cartaClickeada) { //match
	cartasAbiertas[0].classList.toggle('match');
	cartasAbiertas[1].classList.toggle('match');
	coincidencias.push.apply(coincidencias, cartasAbiertas); //(matches, openCards)
	cartasAbiertas = [];
}


//if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
function noCoinciden (cartaClickeada) { //dontMatch
	abrirCarta(cartasAbiertas[0]);
	abrirCarta(cartasAbiertas[1]);
	shakeCard();
	cartasAbiertas = [];
}

function shakeCard() {
	for(cartaAbierta of cartasAbiertas){
		cartaAbierta.classList.toggle('noCoincide');
	}
}

//increment the move counter and display it on the page (put this functionality in another function that you call from this one)
function agregarMovimientos(cartaClickeada) { //addMoves
	movimientos++ // moves
	const contenidoMovimiento = document.querySelector('.moves'); //moveContent
	contenidoMovimiento.innerText = movimientos;
	if (movimientos === 1) {
		document.querySelector('.textMoves').innerText = ' Move';
	} else {
		document.querySelector('.textMoves').innerText = ' Moves';
	}
}

function cambiarScore(cartaClickeada) { //changeScore
	const stars = document.getElementsByClassName('fa fa-star');
	if (movimientos ===25){
		stars[2].className = 'fa fa-star-o';
	} else if (movimientos ===32) {
		stars[1].className ='fa fa-star-o';
	} else if (movimientos ===40) {
		stars[0].className = 'fa fa-star-o';
	}
}

//THE TIMER


function startTimer () {
	intervalo = setInterval(function() { //Interval
		time++;
		mostrarTiempo(); //showTime
		},1000);
}

function mostrarTiempo () { //showTime
	const timer = document.querySelector('.timer');
	segundos = time % 60;
	minutos = Math.floor(time / 60);
	if (segundos<10){
	timer.innerText = `${minutos}:0${segundos}`;
	} else {
		timer.innerText = `${minutos}:${segundos}`;
	}
}
 function stopTimer() {
	clearInterval(intervalo);
	}


function addModal () {
	const finalTime = document.querySelector('.timer').innerText
	let finalStars = document.querySelectorAll('.fa-star').length;
	const container = document.querySelector('.container');
	const modal =
	`<div class="modal">
		<div class="modalChild">
			<h2 css="title"> Congratulations! You Won!</h2>
				<p class="winInfo"> Time: ${finalTime} </p>
				<p class="winInfo"> Stars: ${finalStars}/3 </p>
			<button class="buttonReplay"> Play Again!</button>
		</div>
	</div>`;
	container.insertAdjacentHTML('beforebegin', modal);
	stopTimer();
	//BUTTON FOR REPLAY
	let buttonReplay = document.querySelector('.buttonReplay');
	buttonReplay.addEventListener('click', function () {
		const modalOff = document.querySelector('.modal');
		modalOff.remove();
		playAgain();

	}
	);
}

function playAgain () {
	resetTime();
	resetMoves();
	resetScore();
	resetCards();
	shuffleCards();
}

function resetTime () {
	stopTimer();
	relojApagado = true; //Clock Off
	time = 0;
	mostrarTiempo(); //show Time
}

function resetMoves () {
	movimientos = 0;
	const contenidoMovimiento = document.querySelector('.moves'); //moveContent
	contenidoMovimiento.innerText = movimientos; //moves
}

function resetScore () {
	const stars = document.getElementsByClassName('fa fa-star-o');
	for (star of stars) {
		star.className = 'fa fa-star';
	}
}

function resetCards () {
	for (let coincidencia of coincidencias) { //(let match of matches)
	coincidencia.className = 'card';
	coincidencias = [];
	}
	if (cartasAbiertas.length>0){
		for (cartaAbierta of cartasAbiertas) {
			abrirCarta(cartaAbierta);
		}
	}
	cartasAbiertas = [];
}

function winTheGame () {
	addModal();
	stopTimer();
}
const grinchBtn = document.querySelector(".grinch-btn");
const santaBtn = document.querySelector(".st-klaus-btn");
const message = document.querySelector(".message");
const cells = document.querySelectorAll(".cell");
const restart = document.querySelector(".restart");
const restartEnd = document.querySelector(".restart-end");
const endModalContainer = document.querySelector(".end-modal");
const endModalMessage = document.querySelector(".congrat-message");

let winningCombinations = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[2, 4, 6],
];

let player = null;
let computer = null;
let currentPlayer = null;

function closeModal() {
	const modal = document.querySelector(".modal");
	modal.style.display = "none";
}

function openModal() {
	const modal = document.querySelector(".modal");
	modal.style.display = "";
}

function updateMessage() {
	message.textContent = `Now it's ${currentPlayer}'s turn!`;
}

// Function defining player's move icon
function setPlayerIcon(cell, player) {
	if (player === "Mr Grinchy") {
		cell.innerHTML = `<img src="images/Grinch-face.png" alt="Face of bad, green monster" class="player-icon"/>`;
	} else {
		cell.innerHTML = `<img src="images/SantaBody.png" alt="Santa Claus icon" class="player-icon"/>`;
	}
}

// Chosing plater buttons
grinchBtn.addEventListener("click", (event) => {
	player = "Mr Grinchy";
	computer = "Santa Claus";
	currentPlayer = player;
	console.log(player);
	closeModal();
	updateMessage();
});

santaBtn.addEventListener("click", (event) => {
	player = "Santa Claus";
	computer = "Mr Grinchy";
	currentPlayer = player;
	console.log(player);
	closeModal();
	updateMessage();
});

// Logic for computer's move
function computerMove() {
	let emptyCells = [];
	cells.forEach((cell) => {
		if (cell.innerHTML === "") {
			emptyCells.push(cell);
		}
	});
	for (const combination of winningCombinations) {
		const [a, b, c] = combination;
		if (
			cells[a].innerHTML === cells[b].innerHTML &&
			cells[a].innerHTML !== "" &&
			cells[c].innerHTML === ""
		) {
			setPlayerIcon(cells[c], computer);
			currentPlayer = player;
			updateMessage();
			return;
		} else if (
			cells[a].innerHTML === cells[c].innerHTML &&
			cells[a].innerHTML !== "" &&
			cells[b].innerHTML === ""
		) {
			setPlayerIcon(cells[b], computer);
			currentPlayer = player;
			updateMessage();
			return;
		} else if (
			cells[b].innerHTML === cells[c].innerHTML &&
			cells[b].innerHTML !== "" &&
			cells[a].innerHTML === ""
		) {
			setPlayerIcon(cells[a], computer);
			currentPlayer = player;
			updateMessage();
			return;
		}
	}

	if (emptyCells.length > 0) {
		let randomIndex = Math.floor(Math.random() * emptyCells.length);
		let chosenCell = emptyCells[randomIndex];
		setPlayerIcon(chosenCell, computer);
	}
	currentPlayer = player;
	updateMessage();
}

// Checking if there is a winner
function checkWinner() {
	winningCombinations.forEach((combination) => {
		const [a, b, c] = combination;
		if (
			cells[a].innerHTML !== "" &&
			cells[a].innerHTML === cells[b].innerHTML &&
			cells[a].innerHTML === cells[c].innerHTML
		) {
			const winner = cells[a].innerHTML.includes("Grinch")
				? "Mr Grinchy"
				: "Santa Claus";
			cells.forEach((cell) => {
				cell.classList.add("disabled");
			});
			message.textContent = `${winner} WON! Congratulations!`;
			setTimeout(() => endModal(winner), 1000);
		}
		const isTie = [...cells].every((cell) => cell.innerHTML !== "");
		if (isTie) {
			message.textContent = "It's a tie! Grinch got a Christmas gift!.";
			cells.forEach((cell) => {
				cell.classList.add("disabled");
			});
			setTimeout(() => endModal(null), 1000);
		}
	});
}

// Gaming logic
cells.forEach((cell) => {
	cell.addEventListener("click", (event) => {
		if (cell.innerHTML == "") {
			if (currentPlayer == "Mr Grinchy") {
				cell.innerHTML = `<img
						src="images/Grinch-face.png"
						alt="Face of bad, green monster"
						class="player-icon"
					/>`;
			} else {
				cell.innerHTML = `<img
						src="images/SantaBody.png"
						alt="Santa Claus icon"
						class="player-icon"
					/>`;
			}
			currentPlayer =
				currentPlayer === "Mr Grinchy" ? "Santa Claus" : "Mr Grinchy";

			updateMessage();

			if (currentPlayer === computer) {
				setTimeout(() => {
					computerMove();
					checkWinner();
				}, 600);
			}
		}
	});
});

// Restart game function
function restartGame() {
	cells.forEach((cell) => {
		cell.innerHTML = "";
		cell.classList.remove("disabled");
	});
	player = null;
	computer = null;
	currentPlayer = null;

	const modal = document.querySelector(".modal");
	modal.style.display = "flex";
}

// Restart button listener
restart.addEventListener("click", restartGame);

// Playing sounds
function playSound(audioFilePath) {
	const audio = new Audio(audioFilePath);
	audio.play().catch((error) => {
		console.error(`Error during audio display`, error);
	});
}

//Ending winner modal function
function endModal(winner) {
	const grinchy = document.getElementsByClassName("monster")[0];
	const santaClaus = document.getElementsByClassName("santa")[0];
	const grinchyBody = document.getElementsByClassName("monster-body")[0];

	if (grinchy) grinchy.style.display = "none";
	if (santaClaus) santaClaus.style.display = "none";
	if (grinchyBody) grinchyBody.style.display = "none";

	endModalContainer.style.display = "flex";
	if (winner === "Mr Grinchy") {
		endModalMessage.textContent =
			"There will be no Christmas. Mr Grinchy destroyed all the decorations";
		if (grinchy) grinchy.style.display = "block";
		playSound("audio/sinister-laugh-140131.mp3");
	} else if (winner === "Santa Claus") {
		endModalMessage.textContent =
			"Santa saved Christmas. There will be presents!";
		if (santaClaus) santaClaus.style.display = "block";
		playSound("audio/ho-ho-ho-merry-christmas-santa-claus-181123.mp3");
	} else {
		endModalMessage.textContent =
			"Mr. Grinchy got a gift. Miracles happen during Christmas.";
		if (grinchyBody) grinchyBody.style.display = "block";
		playSound("audio/christmas-chimes-transitions-264369.mp3");
	}
}

// Closing end modal
function closeEndModal() {
	endModalContainer.style.display = "none";
}

// Restart button on end-modal
restartEnd.addEventListener("click", () => {
	closeEndModal();
	restartGame();
});

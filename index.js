const btnStart = document.getElementById('start-game');
const red_button = document.getElementById('red');
const blue_button = document.getElementById('blue');
const green_button = document.getElementById('green');
const yellow_button = document.getElementById('yellow');
const actual_score = document.getElementById('actual-score');
const best_score = document.getElementById('score');
let points = 0;
let bestScore = [];
const LAST_LEVEL = 10;
class Game {
	constructor() {
		this.start();
		this.start = this.start.bind(this);
		this.generateSequence();
		this.nextLevel();
	}
	togglebtnStart() {
		if (btnStart.classList.contains('hide')) {
			btnStart.classList.remove('hide');
		} else {
			btnStart.classList.add('hide');
		}
	}
	start() {
		this.nextLevel = this.nextLevel.bind(this);
		this.chooseColor = this.chooseColor.bind(this);
		this.togglebtnStart();
		this.level = 1;
		this.colours = {
			red,
			blue,
			green,
			yellow,
		};
	}
	win() {
		swal('Felicidades', 'Has Ganado', 'success', {
			button: 'Regresar',
		}).then(() => {
			this.start();
			this.saveScore(bestScore);
		});
	}
	winToNextLevel() {
		swal('Felicidades', 'Has superado este nivel', 'success', {
			button: 'Avanzar',
		}).then(() => {
			setTimeout(this.nextLevel, 1250);
			this.addScore();
		});
	}
	lose() {
		swal('Oh Vaya!', 'Has Perdido', 'error', {
			button: 'Comenzar de nuevo',
		}).then(() => {
			this.deleteClickEvents();
			this.start();
			this.saveScore(bestScore);
			this.resetScore();
		});
	}
	generateSequence() {
		this.sequence = new Array(LAST_LEVEL)
			.fill(0)
			.map((n) => Math.floor(Math.random() * 4));
	}
	addClickEvents() {
		this.colours.red.addEventListener('click', this.chooseColor);
		this.colours.blue.addEventListener('click', this.chooseColor);
		this.colours.green.addEventListener('click', this.chooseColor);
		this.colours.yellow.addEventListener('click', this.chooseColor);
	}
	deleteClickEvents() {
		this.colours.red.removeEventListener('click', this.chooseColor);
		this.colours.blue.removeEventListener('click', this.chooseColor);
		this.colours.green.removeEventListener('click', this.chooseColor);
		this.colours.yellow.removeEventListener('click', this.chooseColor);
	}
	saveScore(scoreArray) {
		let displayScore = Math.max.apply(null, scoreArray);
		best_score.innerHTML = displayScore;
	}
	addScore() {
		actual_score.innerHTML = points;
		bestScore.push(points);
	}
	resetScore() {
		points = 0;
		actual_score.innerHTML = points;
	}
	chooseColor(ev) {
		const colorName = ev.target.dataset.color;
		const numberColor = this.turnColoursToNumbers(colorName);
		this.ligthColor(colorName);
		if (numberColor === this.sequence[this.subLevel]) {
			this.subLevel++;
			points += 2;
			if (this.subLevel === this.level) {
				this.level++;
				this.deleteClickEvents();
				if (this.level === LAST_LEVEL + 1) {
					this.win();
				} else {
					this.winToNextLevel();
				}
			}
		} else {
			this.lose();
		}
	}
	nextLevel() {
		this.subLevel = 0;
		this.lightSequence();
		this.addClickEvents();
	}
	turnNumbersToColours(number) {
		switch (number) {
			case 0:
				return 'red';
			case 1:
				return 'blue';
			case 2:
				return 'green';
			case 3:
				return 'yellow';
		}
	}
	turnColoursToNumbers(color) {
		switch (color) {
			case 'red':
				return 0;
			case 'blue':
				return 1;
			case 'green':
				return 2;
			case 'yellow':
				return 3;
		}
	}
	turnOffColor(color) {
		this.colours[color].classList.remove('light');
	}
	ligthColor(color) {
		this.colours[color].classList.add('light');
		setTimeout(() => this.turnOffColor(color), 400);
	}
	lightSequence() {
		for (let i = 0; i < this.level; i++) {
			const color = this.turnNumbersToColours(this.sequence[i]);
			setTimeout(() => this.ligthColor(color), 1075 * i);
		}
	}
}
function startGame() {
	window.game = new Game();
}

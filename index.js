const btnStart = document.getElementById('start-game');
const red_button = document.getElementById('red');
const blue_button = document.getElementById('blue');
const green_button = document.getElementById('green');
const yellow_button = document.getElementById('yellow');
const timer = document.getElementById('timer');
const record = document.getElementById('record-time');
let seconds = 0,
	minutes = 0;
let interval;
let record_time;
let displaySeconds, displayMinutes;
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
	timerLogic() {
		seconds++;
		if (seconds / 60 === 1) {
			seconds = 0;
			minutes++;
		}
		if (seconds < 10) {
			displaySeconds = '0' + seconds.toString();
		} else {
			displaySeconds = seconds.toString();
		}
		if (minutes < 10) {
			displayMinutes = '0' + minutes.toString();
		} else {
			displayMinutes = minutes;
		}
		timer.innerHTML = `${displayMinutes}:${displaySeconds}`;
	}
	startTimer() {
		interval = window.setInterval(this.timerLogic, 1000);
	}
	stopTimer() {
		window.clearInterval(interval);
		record_time = `${displayMinutes}:${displaySeconds}`;
		record.innerHTML = record_time;
	}
	resetTimer() {
		seconds = 0;
		minutes = 0;
		displaySeconds = '0' + seconds.toString();
		displayMinutes = '0' + minutes.toString();
		timer.innerHTML = `${displayMinutes}:${displaySeconds}`;
	}
	saveRecordTime() {}
	start() {
		this.nextLevel = this.nextLevel.bind(this);
		this.chooseColor = this.chooseColor.bind(this);
		this.timerLogic = this.timerLogic.bind(this);
		this.stopTimer = this.stopTimer.bind(this);
		this.startTimer = this.startTimer.bind(this);
		this.startTimer();
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
		}).then(this.start);
	}
	winToNextLevel() {
		swal('Felicidades', 'Has superado este nivel', 'success', {
			button: 'Avanzar',
		}).then(() => setTimeout(this.nextLevel, 1250));
	}
	lose() {
		swal('Oh Vaya!', 'Has Perdido', 'error', {
			button: 'Comenzar de nuevo',
		}).then(() => {
			this.deleteClickEvents();
			this.stopTimer();
			this.saveRecordTime();
			this.resetTimer();
			this.start();
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
	chooseColor(ev) {
		const colorName = ev.target.dataset.color;
		const numberColor = this.turnColoursToNumbers(colorName);
		this.ligthColor(colorName);
		if (numberColor === this.sequence[this.subLevel]) {
			this.subLevel++;
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

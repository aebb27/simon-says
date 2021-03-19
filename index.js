const btnStart = document.getElementById('start-game'),
	red_button = document.getElementById('red'),
	blue_button = document.getElementById('blue'),
	green_button = document.getElementById('green'),
	yellow_button = document.getElementById('yellow'),
	timer = document.getElementById('timer'),
	record = document.getElementById('record-time'),
	easy = document.getElementById('easy'),
	intermediate = document.getElementById('intermediate'),
	hard = document.getElementById('hard');
let seconds = 0,
	minutes = 0;
let interval, record_time;
let recordArray = [];
let displaySeconds, displayMinutes;
const easyLvlQty = 5,
	intermediateLvlQty = 15,
	hardLvlQty = 25;
let LAST_LEVEL;
const actual_score = document.getElementById('actual-score');
const best_score = document.getElementById('score');
let points = 0;
let bestScore = [];
class Game {
	constructor() {
		this.startTimer = this.startTimer.bind(this);
		this.start = this.start.bind(this);
		if (LAST_LEVEL === undefined) {
			swal('Oops...', 'Asegurate de escoger un nivel de dificultad', 'warning');
		} else {
			this.start();
			this.startTimer();
			this.generateSequence();
			this.nextLevel();
		}
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
		this.saveRecordTime();
	}
	resetTimer() {
		seconds = 0;
		minutes = 0;
		displaySeconds = '0' + seconds.toString();
		displayMinutes = '0' + minutes.toString();
		timer.innerHTML = `${displayMinutes}:${displaySeconds}`;
	}
	saveRecordTime() {
		if (recordArray.length === 0) {
			recordArray.push(`${displayMinutes}:${displaySeconds}`);
			record.innerHTML = timer.innerHTML;
		} else if (recordArray.length >= 1) {
			recordArray.push(`${displayMinutes}:${displaySeconds}`);
			if (recordArray.length === 1) {
				record.innerHTML = timer.innerHTML;
			} else if (recordArray.length > 1) {
				recordArray.sort();
				record_time = recordArray[recordArray.length - 1];
				record.innerHTML = record_time;
			}
		}
	}
	start() {
		this.nextLevel = this.nextLevel.bind(this);
		this.chooseColor = this.chooseColor.bind(this);
		this.timerLogic = this.timerLogic.bind(this);
		this.stopTimer = this.stopTimer.bind(this);
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
			this.stopTimer();
			this.resetTimer();
			this.start();
			this.saveScore(bestScore);
			this.resetScore();
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
			this.deleteClickEventsColours();
			this.stopTimer();
			this.resetTimer();
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
	addClickEventsColours() {
		this.colours.red.addEventListener('click', this.chooseColor);
		this.colours.blue.addEventListener('click', this.chooseColor);
		this.colours.green.addEventListener('click', this.chooseColor);
		this.colours.yellow.addEventListener('click', this.chooseColor);
	}
	deleteClickEventsColours() {
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
				this.deleteClickEventsColours();
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
		this.addClickEventsColours();
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
function selectDifficulty() {
	easy.addEventListener('click', () => (LAST_LEVEL = easyLvlQty));
	intermediate.addEventListener(
		'click',
		() => (LAST_LEVEL = intermediateLvlQty),
	);
	hard.addEventListener('click', () => (LAST_LEVEL = hardLvlQty));
}
function startGame() {
	window.game = new Game();
}

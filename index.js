const btnStart = document.getElementById('start-game'),
	red_button = document.getElementById('red'),
	blue_button = document.getElementById('blue'),
	green_button = document.getElementById('green'),
	yellow_button = document.getElementById('yellow'),
	timer = document.getElementById('timer'),
	record = document.getElementById('record-time'),
	easy = document.getElementById('easy'),
	intermediate = document.getElementById('intermediate'),
	hard = document.getElementById('hard'),
	actual_score = document.getElementById('actual-score'),
	best_score = document.getElementById('score'),
	darkModeToggle = document.querySelector('#toggle-dark-mode'),
	enableDarkMode = () => {
		document.body.classList.add('dark-mode');
		localStorage.setItem('darkMode', 'enabled');
	},
	disableDarkMode = () => {
		document.body.classList.remove('dark-mode');
		localStorage.setItem('darkMode', null);
	};
let seconds = 0,
	minutes = 0,
	interval,
	record_time,
	recordArray = [],
	displaySeconds,
	displayMinutes,
	LAST_LEVEL,
	points = 0,
	bestScore = [],
	darkMode = localStorage.getItem('darkMode'),
	winner,
	loser,
	lvl,
	targetTile,
	chooseDifficulty,
	startAgain,
	forward,
	backward;
const easyLvlQty = 5,
	intermediateLvlQty = 15,
	hardLvlQty = 25;
class Game {
	constructor() {
		this.startTimer = this.startTimer.bind(this);
		this.start = this.start.bind(this);
		if (LAST_LEVEL === undefined) {
			chooseDifficulty.play();
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
		winner.play();
		swal('Felicidades', 'Has Ganado', 'success', {
			button: 'Regresar',
		}).then(() => {
			this.stopTimer();
			this.resetTimer();
			this.start();
			this.saveScore(bestScore);
			this.resetScore();
			startAgain.play();
		});
	}
	winToNextLevel() {
		lvl.play();
		swal('Felicidades', 'Has superado este nivel', 'success', {
			button: 'Avanzar',
		}).then(() => {
			setTimeout(this.nextLevel, 1250);
			this.addScore();
		});
	}
	lose() {
		loser.play();
		swal('Oh Vaya!', 'Has Perdido', 'error', {
			button: 'Comenzar de nuevo',
		}).then(() => {
			this.deleteClickEventsColours();
			this.stopTimer();
			this.resetTimer();
			this.start();
			this.saveScore(bestScore);
			this.resetScore();
			startAgain.play();
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
			targetTile.play();
			this.subLevel++;
			points += 2;
			if (this.subLevel === this.level) {
				this.level++;
				this.deleteClickEventsColours();
				if (this.level === LAST_LEVEL + 1) {
					this.win();
				} else {
					setTimeout(() => this.winToNextLevel(), 575);
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
	winner = new sound('./sounds/win.wav');
	loser = new sound('./sounds/lose.wav');
	lvl = new sound('./sounds/level.wav');
	startAgain = new sound('./sounds/back-to-start.wav');
	targetTile = new sound('./sounds/target-tile.wav');
	chooseDifficulty = new sound('./sounds/choose-difficulty.wav');
	window.game = new Game();
}
if (darkMode === 'enabled') {
	enableDarkMode();
}
darkModeToggle.addEventListener('click', () => {
	darkMode = localStorage.getItem('darkMode');
	if (darkMode !== 'enabled') {
		forward = new sound('./sounds/forward.wav');
		forward.play();
		enableDarkMode();
	} else {
		backward = new sound('./sounds/backward.wav');
		backward.play();
		disableDarkMode();
	}
});
class sound {
	constructor(src) {
		this.sound = document.createElement('audio');
		this.sound.src = src;
		this.sound.setAttribute('preload', 'auto');
		this.sound.setAttribute('controls', 'none');
		this.sound.style.display = 'none';
		document.body.appendChild(this.sound);
		this.play = function () {
			this.sound.play();
		};
		this.stop = function () {
			this.sound.pause();
		};
	}
}

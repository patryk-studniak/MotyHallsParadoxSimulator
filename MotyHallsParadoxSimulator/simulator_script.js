;(function runSimulator () {
	/**
	 * init buttons listeners
	 */
	document.addEventListener('DOMContentLoaded', function(e) {
		__setListeners();
	}, false);
	/**
	 * Simulations data object - contains info about done Simulations
	 */
	var simulatorData = {
		simulationsTotal: 0,
		sameGateSimulations: {
			simulationsNumber: 0,
			winsCount: 0
		},
		randomGateSimulations: {
			simulationsNumber: 0,
			winsCount: 0
		}
	}
	/**
	 * Starting arrays with all false (looses) insde
	 */
	var gatesArr = [false, false, false];
	/**
	 * Get random number from specified range
	 */
	function _getRandomNumber (min, max) {
		return Math.floor(Math.random() * max) + min;
	}
	/**
	 * Set up gates with one winner gate chosen randomly
	 */
	function _setUpGates () {
		var winnerGate = _getRandomNumber(1, 3);

		for (var i = 0, length = gatesArr.length; i < length; i++) {
			if ((i + 1) == winnerGate) {
				gatesArr[i] = true;
			} else {
				gatesArr[i] = false;
			}
		}
	}
	/**
	 * Get simulations number passed by user into the input field
	 */
	function _getSimulationsNumber () {
		var simulationsSelector = document.getElementById('simulations-number');
		var simulationsNumber = Number(simulationsSelector.value);

		if (simulationsSelector.value.length > 7 || simulationsNumber > 1500000) {
			return alert('Provided simulations number is too high. Please provide lower simulations number and continue');
		}

		simulatorData.simulationsTotal = simulationsNumber;

		return simulationsNumber;
	}
	/**
	 * Open random gate different than choosen one
	 */
	function _openRandomGate (choosenGate, openedGate) {
		var gateToOpen = _getRandomNumber(1, 3);
		
		while (gateToOpen == choosenGate || gateToOpen === openedGate) {
			gateToOpen = _getRandomNumber(1, 3);
		}

		return gatesArr[gateToOpen - 1];
	}
	/**
	 * Choose random gate twice - both choices have to be different
	 */
	function _chooseRandomGate () {
		var firstChoose = _getRandomNumber(1, 3);
		var secondChoose = _getRandomNumber(1, 3);

		while (firstChoose == secondChoose) {
			firstChoose = _getRandomNumber(1, 3);
			secondChoose = _getRandomNumber(1, 3);
		}

		return {
			firstChoose: firstChoose,
			secondChoose: secondChoose
		};
	}
	/**
	 * Choose randomly number and stay with the same choice
	 */
	function _chooseSameGate () {
		var firstChoose = _getRandomNumber(1, 3);
		var secondChoose = firstChoose;

		return {
			firstChoose: firstChoose,
			secondChoose: secondChoose
		};
	}
	/**
	 * Simulate random choices
	 */
	function _simulateRandomChoices () {
		var simulationsCount = Number(simulatorData.simulationsTotal / 2);
		var choosenGates;

		for (var i = 0, length = simulationsCount; i < simulationsCount; i++) {
			_runSimulation('random_choice');
		}
	}
	/**
	 * Simulate same choices games
	 */
	function _simulateSameChoices () {
		var simulationsCount = Number(simulatorData.simulationsTotal / 2);
		var choosenGates;

		for (var i = 0, length = simulationsCount; i < simulationsCount; i++) {
			_runSimulation('same_choice');
		}
	}
	/**
	 * run simulation
	 */
	function _runSimulation (simulationType) {
		var choosenGates;
		var simulationsTypeStr = simulationType.replace('_choice', '') + 'GateSimulations'

		_setUpGates();

		switch (simulationType) {
			case 'same_choice':
				simulatorData.sameGateSimulations.simulationsNumber += 1;
				choosenGates = _chooseSameGate();
				break;
			case 'random_choice':
				simulatorData.randomGateSimulations.simulationsNumber += 1;
				choosenGates = _chooseRandomGate();
		}

		var firstGateOpen = _openRandomGate(choosenGates.firstChoose, null);
		var secondGateOpen = gatesArr[choosenGates.secondChoose];


		if (!firstGateOpen && !secondGateOpen) {
			return;
		} else {
			simulatorData[String(simulationsTypeStr)].winsCount += 1;
		}

	}
	/**
	 * Calculate percentage value of results
	 */
	function _calcResults () {
		var sameChoiceWins = simulatorData.sameGateSimulations.winsCount;
		var randomChoiceWins =  simulatorData.randomGateSimulations.winsCount;
		var simulationsNumber = simulatorData.simulationsTotal / 2;
		var sameChoiceResult = sameChoiceWins / simulationsNumber * 100;
		var randomChoiceResult = randomChoiceWins / simulationsNumber * 100;

		return {
			sameResult: String(sameChoiceResult.toFixed(2) + '%'),
			randomResult: String(randomChoiceResult.toFixed(2) + '%')
		}
	}
	/**
	 * Update calculated data to the view
	 */
	function _updateView (results) {
		var sameValueOutput = document.querySelector('.same__value');
		var sameValueBar = document.querySelector('.same__value--bar-colored');

		var randomValueOutput = document.querySelector('.random__value');
		var randomValueBar = document.querySelector('.random__value--bar-colored');

		sameValueOutput.innerHTML = results.sameResult;
		sameValueBar.style.width = results.sameResult;

		randomValueOutput.innerHTML = results.randomResult;
		randomValueBar.style.width = results.randomResult;
	}
	/**
	 * reset simulators data
	 */
	function _resetSimulator () {
		var sameValueOutput = document.querySelector('.same__value');
		var sameValueBar = document.querySelector('.same__value--bar-colored');

		var randomValueOutput = document.querySelector('.random__value');
		var randomValueBar = document.querySelector('.random__value--bar-colored');

		simulatorData.simulationsTotal = 0;

		simulatorData.sameGateSimulations.simulationsNumber = 0;
		simulatorData.sameGateSimulations.winsCount = 0;

		simulatorData.randomGateSimulations.simulationsNumber = 0;
		simulatorData.randomGateSimulations.winsCount = 0;

		sameValueOutput.innerHTML = '0%';
		randomValueOutput.innerHTML = '0%';

		sameValueBar.style.width = '0%';
		randomValueBar.style.width = '0%';

		gatesArr = [false, false, false];
	}
	/**
	 * Set up listeners to run simulator logic
	 */
	function __setListeners () {
		var buttonRun = document.getElementById('run');
		var buttonReset = document.getElementById('reset');

		buttonRun.addEventListener('click', function(e) {
			_resetSimulator();

			_getSimulationsNumber();

			if (!simulatorData.simulationsTotal) {
				return;
			}

			_simulateRandomChoices();
			_simulateSameChoices();

			_updateView(_calcResults());
		});

		buttonReset.addEventListener('click', function(e) { _resetSimulator(e) });
	}
})();
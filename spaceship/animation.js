

	// http://upshots.org/actionscript/jsas-understanding-easing
	/*
	@t is the current time (or position) of the tween. This can be seconds or frames, steps, seconds, ms, whatever – as long as the unit is the same as is used for the total time [3].
	@b is the beginning value of the property.
	@c is the change between the beginning and destination value of the property.
	@d is the total time of the tween.
	*/
	function noEasing (t, b, c, d) {
		return c * (t / d) + b;
	}

	// http://gsgd.co.uk/sandbox/jquery/easing/
	function easeOutElastic (t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
	}

	function easeInQuint (t, b, c, d) {
		return c*(t/=d)*t*t*t*t + b;
	}

	// KUDOS: https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollY
	function getScrollY() {
		var supportPageOffset = window.pageXOffset !== undefined;
		var isCSS1Compat = ((document.compatMode || "") === "CSS1Compat");
		return supportPageOffset ? window.pageYOffset : isCSS1Compat ? document.documentElement.scrollTop : document.body.scrollTop;
	}

	var spaceship = document.getElementById('spaceship');
	var bridgeshape = document.getElementById('bridgeshape');

	var mouseY;
	var beginning = null;

	var incompleteAnimation = false;

	var SPACESHIP_START = 99;
	var SPACESHIP_END = 154;

	var BRIDGESHAPE_START = 80;
	var BRIDGESHAPE_END = 130;

	var setSpaceshipPosition, getSpaceshipPosition;
	(function() {
		var currentValue;
		setSpaceshipPosition = function(newValue) {
			currentValue = newValue;
			spaceship.style.top = currentValue + 'px';
		}
		getSpaceshipPosition = function() {
			return currentValue;
		}
	})();

	var setBridgeshapePosition, getBridgeshapePosition;
	(function() {
		var currentValue;
		setBridgeshapePosition = function(newValue) {
			currentValue = newValue;
			bridgeshape.setAttribute('d', 'M 0 80 V 0 H 180 V 80 M180 80 Q 95 ' + currentValue + ' 0 80');
		}
		getBridgeshapePosition = function() {
			return currentValue;
		}
	})();


	function step(mouseY) {
		if (!beginning) beginning = mouseY;

		var propertyStart = BRIDGESHAPE_START;
		var propertyDestination = BRIDGESHAPE_END;
		var progress = mouseY - beginning;
		var duration = 200;

		incompleteAnimation = true;

		// If we're done
		if (progress > duration) {
			setTimeout(function() {

				// Animate things back to the top position
				animate(getBridgeshapePosition(), BRIDGESHAPE_START, 1000, setBridgeshapePosition);
				animate(getSpaceshipPosition(), SPACESHIP_START, 1000, setSpaceshipPosition);
			}, 500);
			incompleteAnimation = false;
			return;
		}
		var nextValue = Math.floor(easeInQuint(progress, propertyStart, propertyDestination - propertyStart, duration));

		setBridgeshapePosition(nextValue);

		propertyStart = SPACESHIP_START;
		propertyDestination = SPACESHIP_END;

		nextValue = Math.floor(easeInQuint(progress, propertyStart, propertyDestination - propertyStart, duration));

		setSpaceshipPosition(nextValue);

		console.log('--------------');
		console.log('beginning: ' + beginning);
		console.log('mouseY: ' + mouseY);
		console.log('progress: ' + progress);
		console.log('nextValue: ' + nextValue);
	}

	var mouseIsDown = false;
	document.body.addEventListener('mousedown', function(event) {
		mouseIsDown = true;
	}, false);
	document.body.addEventListener('mouseup', function(event) {
		mouseIsDown = false;
		if (incompleteAnimation) {
			// Animate things back to the top position
			animate(getBridgeshapePosition(), BRIDGESHAPE_START, 1000, setBridgeshapePosition);
			animate(getSpaceshipPosition(), SPACESHIP_START, 1000, setSpaceshipPosition);
		}
	}, false);


	document.body.addEventListener('mousemove', function(event) {
		mouseY = event.clientY;
		console.log('mouseY: ' + mouseY);
		if (mouseIsDown) {
			step(mouseY);
		}
	}, false);


	function animate(propertyStart, propertyDestination, duration, drawFrame, onFinish) {
		var beginning;

		function step(timestamp) {
			if (!beginning) beginning = timestamp;

			var progress = timestamp - beginning;

			var nextValue = Math.floor(easeInQuint(progress, propertyStart, propertyDestination - propertyStart, duration));

			drawFrame(nextValue);

			console.log('--------------');
			console.log('beginning: ' + beginning);
			console.log('timestamp: ' + timestamp);
			console.log('progress: ' + progress);
			console.log('nextValue: ' + nextValue);

			if (progress < duration) {
				requestAnimationFrame(step);
			} else {
				if (onFinish) onFinish();
			}
		}
		requestAnimationFrame(step);
	}



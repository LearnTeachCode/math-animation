(function() {

	var header      = document.querySelector('header');
	var refresh     = document.querySelector('.refresh');
	var bridgeshape = document.getElementById('bridgeshape');
	var spaceship   = document.getElementById('spaceship');

	var refreshHeight = refresh.offsetHeight + 3; // Add a little extra to keep the spaceship out of view

	var SPACESHIP_START = 99;
	var SPACESHIP_END   = 198;

	var BRIDGESHAPE_START = 80;
	var BRIDGESHAPE_END   = 170;

	var REFRESH_MARGIN_START = -176;
	var REFRESH_MARGIN_END   = -90;


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

	var setRefreshMarginPosition, getRefreshMarginPosition;
	(function() {
		var currentValue;
		setRefreshMarginPosition = function(newValue) {
			currentValue = newValue;
			refresh.style.marginBottom = newValue + 'px';
		}
		getRefreshMarginPosition = function() {
			return currentValue;
		}
	})();


	// Add listeners
	/*
	(function() {
		var mouseIsDown = false;

		document.body.addEventListener('mousedown', function(event) {
			mouseIsDown = true;
		}, false);

		document.body.addEventListener('mouseup', function(event) {
			mouseIsDown = false;

			// Animate things back to the top position
			animate(getBridgeshapePosition(), BRIDGESHAPE_START, 1000, setBridgeshapePosition, easeInQuint);
			animate(getSpaceshipPosition(), SPACESHIP_START, 1000, setSpaceshipPosition, easeInQuint);
		}, false);

		document.body.addEventListener('mousemove', function(event) {
			var mouseY = event.clientY;
			// console.log('mouseY: ' + mouseY);
			if (mouseIsDown) {
				animateByMouse(mouseY);
			}
		}, false);
	})();
	*/

	function initialize() {
		var timer;
		var scrollResetAnimation;
		var launching = false;
		window.addEventListener('scroll', function(e) {
			var scrollY = getScrollY();

			// Ignore scroll events if the launch is in progress
			if (launching) return;

			if (scrollY < refreshHeight) {
				animateByScroll(scrollY);
			}

			// Scroll the refresh element out of sight again, after a delay
			// (for the case where the user scrolls a little way, and then stops)
			// if (timer) clearTimeout(timer);
			// timer = setTimeout(function() {
			// 	launching = true;
			// 	animate(getBridgeshapePosition(), BRIDGESHAPE_START , 500, setBridgeshapePosition, easeInQuint);
			// 	animate(getSpaceshipPosition(), SPACESHIP_START, 500, setSpaceshipPosition, easeInQuint);
			// 	animate(getRefreshMarginPosition(), REFRESH_MARGIN_START, 500, setRefreshMarginPosition, easeInQuint);
			//
			// 	animate(scrollY, refreshHeight + REFRESH_MARGIN_START, 500, easeInQuint, function(nextValue) {
			// 		window.scroll(0, nextValue);
			// 	}, function() {
			// 		launching = false;
			// 	});
			// }, 2000);

			if (scrollY <= 0) {

				document.body.classList.add('prelaunch-animation');

				// Wait a half second
				if (timer) clearTimeout(timer);
				timer = setTimeout(function() {

					launching = true;

					// Launch!
					animate(getBridgeshapePosition(), 80 , 1000, setBridgeshapePosition, easeOutElastic);
					animate(getSpaceshipPosition(), -150, 1000, setSpaceshipPosition, easeOutQuint);
					animate(getRefreshMarginPosition(), REFRESH_MARGIN_START, 500, setRefreshMarginPosition, easeOutElastic);


					document.body.classList.remove('prelaunch-animation');

					// Scroll the refresh element out of sight again
					// if (timer) clearTimeout(timer);
					// timer = setTimeout(function() {
					//
					// 	animate(scrollY, refreshHeight + REFRESH_MARGIN_START, 500, function(nextValue) {
					// 		window.scroll(0, nextValue);
					// 	}, function() {
					// 		launching = false;
					// 	});
					// }, 2000);

				}, 500);

			}

		}, false);
	}


	// Scroll down enough for the refresh to be out of view

	window.addEventListener('load', function() {
		setTimeout(function() {
			window.scroll(0, refreshHeight + REFRESH_MARGIN_START);

			// TRICKY: Wait for the automatic scrolling to be fininshed before initalizing the scroll event listeners
			setTimeout(initialize, 100);
		}, 1);
	}, false);
	window.scroll(0, refreshHeight + REFRESH_MARGIN_START);


	var animateByScroll;
	(function() {
		animateByScroll = function(scrollY) {

			var propertyStart, propertyDestination, nextValue;
			var progress = refreshHeight - scrollY;
			var duration = refreshHeight;

			// If we've reached the top of the page
			if (scrollY <= 0) {
				return;
			}

			// Animate the bridge
			propertyStart = BRIDGESHAPE_START;
			propertyDestination = BRIDGESHAPE_END;
			nextValue = Math.floor(easeInQuint(progress, propertyStart, propertyDestination - propertyStart, duration));
			setBridgeshapePosition(nextValue);

			// Animate the refresh container’s margin too, so the list will appear to be the same distance away.
			propertyStart = REFRESH_MARGIN_START;
			propertyDestination = REFRESH_MARGIN_END;
			nextValue = Math.floor(easeInQuint(progress, propertyStart, propertyDestination - propertyStart, duration));
			setRefreshMarginPosition(nextValue);

			// Animate the spaceship
			propertyStart = SPACESHIP_START;
			propertyDestination = SPACESHIP_END;
			nextValue = Math.floor(easeInQuint(progress, propertyStart, propertyDestination - propertyStart, duration));
			setSpaceshipPosition(nextValue);

			/*
			console.log('--------------');
			console.log('beginning: ' + beginning);
			console.log('mouseY: ' + mouseY);
			console.log('progress: ' + progress);
			console.log('nextValue: ' + nextValue);
			*/
		}
	})();


	// var animateByMouse;
	// (function() {
	// 	var beginning;
	// 	animateByMouse = function(mouseY) {
	// 		if (!beginning) beginning = mouseY;
	//
	// 		var propertyStart, propertyDestination, nextValue;
	// 		var progress = mouseY - beginning;
	// 		var duration = 200;
	//
	// 		// If we're done
	// 		if (progress > duration) {
	// 			return;
	// 		}
	//
	// 		// Animate the bridge
	// 		propertyStart = BRIDGESHAPE_START;
	// 		propertyDestination = BRIDGESHAPE_END;
	// 		nextValue = Math.floor(easeInQuint(progress, propertyStart, propertyDestination - propertyStart, duration));
	// 		setBridgeshapePosition(nextValue);
	//
	// 		// Animate the spaceship
	// 		propertyStart = SPACESHIP_START;
	// 		propertyDestination = SPACESHIP_END;
	// 		nextValue = Math.floor(easeInQuint(progress, propertyStart, propertyDestination - propertyStart, duration));
	// 		setSpaceshipPosition(nextValue);
	//
	// 		console.log('--------------');
	// 		console.log('beginning: ' + beginning);
	// 		console.log('mouseY: ' + mouseY);
	// 		console.log('progress: ' + progress);
	// 		console.log('nextValue: ' + nextValue);
	// 	}
	// })();


	function animate(propertyStart, propertyDestination, duration, drawFrame, easeFunction, onFinish) {
		console.log('animate');
		var beginning;
		var stopAnimation = false;

		function step(timestamp) {
			if (!beginning) beginning = timestamp;

			var progress = timestamp - beginning;

			if (progress < duration && !stopAnimation) {
				requestAnimationFrame(step);
			} else {
				drawFrame(propertyDestination);
				if (onFinish) onFinish();
				return;
			}

			var nextValue = Math.floor(easeFunction(progress, propertyStart, propertyDestination - propertyStart, duration));

			drawFrame(nextValue);

			/*
			console.log('--------------');
			console.log('beginning: ' + beginning);
			console.log('timestamp: ' + timestamp);
			console.log('progress: ' + progress);
			console.log('nextValue: ' + nextValue);
			*/
		}
		requestAnimationFrame(step);

		return {
			stop: function() {
				stopAnimation = true;
			}
		}
	}


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

	function easeOutQuint (t, b, c, d) {
		return c*((t=t/d-1)*t*t*t*t + 1) + b;
	}

	// KUDOS: https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollY
	function getScrollY() {
		var supportPageOffset = window.pageXOffset !== undefined;
		var isCSS1Compat = ((document.compatMode || "") === "CSS1Compat");
		return supportPageOffset ? window.pageYOffset : isCSS1Compat ? document.documentElement.scrollTop : document.body.scrollTop;
	}


})();

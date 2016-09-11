// var refresh = document.querySelector('.refresh');
  // document.body.className += ' inactive';
  // setTimeout(function() {
  //   document.body.className += ' animated';
  // }, 1);

  // document.body.addEventListener('click', function() {
  //   document.body.className = document.body.className.replace(/inactive/g, '');
  //   setTimeout(function() {
  //     document.body.className += ' lift-off';
  //     setTimeout(function() {
  //       document.body.className += ' inactive';
  //       document.body.className = document.body.className.replace(/lift-off/g, '');
  //     }, 1000);
  //   }, 1000);
  // }, false);






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

    var beginning = null;

    var bridgeshape = document.getElementById('bridgeshape');

    // function step(timestamp) {
    //   if (!beginning) beginning = timestamp;

    //   var propertyStart = 130;
    //   var propertyDestination = 80;
    //   var progress = timestamp - beginning;
    //   var duration = 1000;

    //   var nextValue = Math.floor(easeInQuint(progress, propertyStart, propertyDestination - propertyStart, duration));

    //   bridgeshape.setAttribute('d', 'M 10 80 V 10 H 180 V 80 M180 80 Q 95 ' + nextValue + ' 10 80');


    //   console.log('--------------');
    //   console.log('beginning: ' + beginning);
    //   console.log('timestamp: ' + timestamp);
    //   console.log('progress: ' + progress);
    //   console.log('nextValue: ' + nextValue);      

    //   if (progress < duration) {
    //     requestAnimationFrame(step);
    //   }
    // }
    // requestAnimationFrame(step);





  function step(timestamp) {
      if (!beginning) beginning = timestamp;

      var propertyStart = 80;
      var propertyDestination = 130;
      var progress = timestamp - beginning;
      var duration = 1000;

      var nextValue = Math.floor(easeInQuint(progress, propertyStart, propertyDestination - propertyStart, duration));

      bridgeshape.setAttribute('d', 'M 0 80 V 0 H 180 V 80 M180 80 Q 95 ' + nextValue + ' 0 80');


      console.log('--------------');
      console.log('beginning: ' + beginning);
      console.log('timestamp: ' + timestamp);
      console.log('progress: ' + progress);
      console.log('nextValue: ' + nextValue);      

      if (progress < duration) {
        requestAnimationFrame(step);
      }
    }
    requestAnimationFrame(step);




    /*
    var start = null;
    var element = document.getElementById("SomeElementYouWantToAnimate");
    element.style.position = 'absolute';

    function step(timestamp) {
      if (!start) start = timestamp;
      var progress = timestamp - start;
      element.style.left = Math.min(progress/10, 200) + "px";
      if (progress < 2000) {
        window.requestAnimationFrame(step);
      }
    }

    window.requestAnimationFrame(step);
    */
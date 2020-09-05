var controllerOptions = {};
var i = 0;
var x = (window.innerWidth)/2;
var y = (window.innerHeight)/2;
var ran;
+
Leap.loop(controllerOptions, function(frame)
	{
		console.log(i);
		i += 1;

		//Math.random() * (max - min) + min;
		ran = Math.random() * 2 - 1;

		circle(x+ran, y, 100);
	}
);


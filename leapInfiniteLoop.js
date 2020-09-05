var controllerOptions = {};
var i = 0;
var x = (window.innerWidth)/2;
var y = (window.innerHeight)/2;
var ran, ran2;

Leap.loop(controllerOptions, function(frame)
	{
		clear();

		console.log(i);
		i+=1;

		//Math.random() * (max - min) + min;
		ran = Math.random() * 2 - 1;
		ran2 = Math.random() * 2 - 1;

		circle(x+ran, y+ran2, 100);
	}
);


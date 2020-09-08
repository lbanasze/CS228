var controllerOptions = {};
var i = 0, x, y, z;
var ran, ran2;
var hand, fingers, finger;

Leap.loop(controllerOptions, function(frame)
	{ 
		clear();
		HandleFrame(frame);
	}
);

function HandleFrame(frame){
	clear();

        if(frame.hands.length == 1)
        	{
			hand = frame.hands[0];
			HandleHand(hand)
                }

}

function HandleHand(hand){
        fingers = hand.fingers;

        for (i = 0; i < fingers.length; i++) {
		HandleFinger(fingers[i]); 
      	}
}

function HandleFinger(finger){	
		x = finger.tipPosition[0];
		y = window.innerHeight - finger.tipPosition[1];
		z = finger.tipPosition[2];

		console.log(1);

		x = (((x + 310) * 1366) / 600); 
		y = (((y - 67) * 355) / 421);
		circle(x, y, 50);
}

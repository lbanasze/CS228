var controllerOptions = {};
var i = 0, x, y, z;
var ran, ran2;
var hand, fingers, finger;
// var rawXMin = 999999, rawXMax = -999999, rawYMin = 999999, rawYMax = -999999;

Leap.loop(controllerOptions, function(frame)
	{ 
		clear();
  
       	 	//console.log(i);
        	//i+=1;

        	//ran = Math.floor(Math.random() * 2 - 1);
        	//ran2 = Math.floor(Math.random() * 2 - 1);

        	//circle((x+ran), (y+ran2), 100);

		HandleFrame(frame);
	}
);

function HandleFrame(frame){
	clear();

        //console.log(i);
        //i+=1;

       	//ran = Math.floor(Math.random() * 2 - 1);
        //ran2 = Math.floor(Math.random() * 2 - 1);

        //circle((x+ran), (y+ran2), 100);

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
	if(finger.type == 1){	
		x = finger.tipPosition[0];
		y = window.innerHeight - finger.tipPosition[1];
		z = finger.tipPosition[2];

		console.log(1);

//		if(x < rawXMin){
//			rawXMin = x;
//			console.log(rawXMin);
//		}

//		if(x > rawXMax){
//			rawXMax = x;
//			console.log(rawXMax);
//		}

//		if(y < rawYMin){
//			rawYMin = x;
//			console.log(rawYMin);
//		}

//		if(y > rawYMax){
//			rawYMax = y;
//			console.log(rawYMax);
//		}

		x = (((x + 310) * 1366) / 600); 
		y = (((y - 67) * 355) / 421);
		circle(x, y, 100);
	}	
}

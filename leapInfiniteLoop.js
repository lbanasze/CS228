var controllerOptions = {};
var i = 0;
var x;
var y;
var z;
var ran;
var ran2;
var hand;
var fingers;
var finger; 

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
		y = finger.tipPosition[1];
		z = finger.tipPosition[2];
		circle(x, y, 100);
	}	
}

var controllerOptions = {};
var i = 0;
var x = (window.innerWidth)/2;
var y = (window.innerHeight)/2;
var ran;
var ran2;
var hand;
var fingers;
var finger; 

Leap.loop(controllerOptions, function(frame)
	{
		HandleFrame(frame);
	}
);

function HandleFrame(frame){
	//clear();

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
		console.log(finger.type);
	}
}

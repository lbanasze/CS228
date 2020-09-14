var controllerOptions = {};
var i = 0, x, y, z;
var ran, ran2;
var hand, fingers, finger, bones, bone;
var rawXMax = -1;
var rawYMax = -1;
var rawXMin = 1;
var rawYMin = 1;

Leap.loop(controllerOptions, function(frame)
	{
		clear();
		HandleFrame(frame);
	}
);

function HandleFrame(frame){

        if(frame.hands.length == 1)
        	{
			hand = frame.hands[0];
			HandleHand(hand);
                }

}

function HandleHand(hand)
{
	fingers = hand.fingers;
      	for (i = 0; i < 5; i++) {
		HandleFinger(fingers[i]);
    	}
}

function HandleFinger(finger){	

	finger.bones.forEach(HandleBone);
}

function HandleBone(bone){
	x = bone.nextJoint[0];
	y = window.innerHeight - bone.nextJoint[1];
	z = bone.nextJoint[2];

	updateRange(x, y);

	x = (x - rawXMin) * (window.innerWidth / (rawXMax - rawXMin));
	y = (y - rawYMin) * (window.innerHeight / (rawYMax - rawYMin));
	circle(x, y, 50);
}

function updateRange(x, y){
	if (x < rawXMin){
		rawXMin = x;
	}

	if (y < rawYMin){
		rawYMin = y;
	}

	if (x > rawXMax){
		rawXMax = x;
	}

	if (y > rawYMax){
		rawYMax = y;
	}

}

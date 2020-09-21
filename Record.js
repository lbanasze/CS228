var controllerOptions = {};
var i = 0, x, y, z;
var ran, ran2;
var hand, fingers, finger, bones, bone;
var rawXMax = -1;
var rawYMax = -1;
var rawXMin = 1;
var rawYMin = 1;
var previousNumHands = 0;
var currentNumHands = 0;

Leap.loop(controllerOptions, function(frame)
	{ 	
		currentNumHands = frame.hands.length;
		clear();
		HandleFrame(frame);
		if (previousNumHands == 2 && currentNumHands == 1){
			RecordData();
		}
		previousNumHands = currentNumHands;
	}
);

function HandleFrame(frame){

        if(frame.hands.length >= 1)
        	{
			hand = frame.hands[0];
			HandleHand(hand);
                }

}

function HandleHand(hand)
{
	fingers = hand.fingers;

      	for (i = 0; i < 4; i++) {
		for (j = 0; j < fingers.length; j++)
		{	if ((fingers[j] == 0) && (i == 3)){
				console.log("nothing!")
			}
			else{
				HandleBone(fingers[j].bones[i]);
			}
		}
    	}
}

function HandleFinger(finger){	

	finger.bones.forEach(HandleBone);
}

function HandleBone(bone){
	x1 = bone.prevJoint[0];
	x2 = bone.nextJoint[0];
	y1 = window.innerHeight - bone.prevJoint[1];
	y2 = window.innerHeight - bone.nextJoint[1];
	z = bone.nextJoint[2];

	[x1, y1] = TransformCoordinates(x1, y1);
	[x2, y2] = TransformCoordinates(x2, y2);

	strokeWeight(8 - (bone.type * 1.5));
	if (currentNumHands == 1){
		stroke(0, (255 - (bone.type + 1.5) * 40), 0); 
	}

	else if (currentNumHands == 2){
		stroke((255 - (bone.type + 1.5) * 40), 0, 0);
	}

	line(x1, y1, x2, y2);
}

function TransformCoordinates(x, y){
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

	x = (x - rawXMin) * (window.innerWidth / (rawXMax - rawXMin));
	y = (y - rawYMin) * (window.innerHeight / (rawYMax - rawYMin));

	return [x, y];

}

function RecordData(){
	background(0);
}

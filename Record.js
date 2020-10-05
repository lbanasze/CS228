
var controllerOptions = {};
var i = 0, x, y, z;
var ran, ran2;
var hand, fingers, finger, bones, bone;
var rawXMax = -1;
var rawYMax = -1;
var rawZMax = -1;
var rawXMin = 1;
var rawYMin = 1;
var rawZMin = 1;
var previousNumHands = 0;
var currentNumHands = 0;
var framesOfData = nj.zeros([5,4,6,2]);
var normalizedPrevJoint, normalizedNextJoint;
var numSamples = 2;
var currentSample = 0;

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

	var InteractionBox = frame.interactionBox
        
	if(frame.hands.length >= 1)
        	{
			hand = frame.hands[0];
			HandleHand(hand, InteractionBox);
                }

}

function HandleHand(hand, InteractionBox)
{
	fingers = hand.fingers;

      	for (i = 3; i >= 0;  i--) {
		for (j = 0; j < fingers.length; j++){
			if(!(fingers[j].type == 0 && i ==3)){
				HandleBone(fingers[j].bones[i], fingers[j].type, InteractionBox);
			}
		}
    	}
}

function HandleFinger(finger){	
	bones = finger.bones;
	bones.forEach(HandleBone(bone, finger.type, InteractionBox));
}

function HandleBone(bone, fingerIndex, InteractionBox){
	normalizedPrevJoint = InteractionBox.normalizePoint(bone.prevJoint, true);
	normalizedNextJoint = InteractionBox.normalizePoint(bone.nextJoint, true);

	framesOfData.set(fingerIndex, bone.type, 0, currentSample, normalizedPrevJoint[0]);
	framesOfData.set(fingerIndex, bone.type, 1, currentSample, normalizedPrevJoint[1]);
	framesOfData.set(fingerIndex, bone.type, 2, currentSample, normalizedPrevJoint[2]);
	framesOfData.set(fingerIndex, bone.type, 3, currentSample, normalizedNextJoint[0]);
	framesOfData.set(fingerIndex, bone.type, 4, currentSample, normalizedNextJoint[1]);
	framesOfData.set(fingerIndex, bone.type, 5, currentSample, normalizedNextJoint[2]);

	x1 = window.innerWidth * normalizedPrevJoint[0];
	x2 = window.innerWidth * normalizedNextJoint[0];
	y1 = window.innerHeight * (1 - normalizedPrevJoint[1]);
	y2 = window.innerHeight * (1 - normalizedNextJoint[1]);
	z1 = normalizedPrevJoint[2];
	z2 = normalizedNextJoint[2];

	strokeWeight(30 - (bone.type * 4.5));
	if (currentNumHands == 1){
		stroke(0, (255 - (bone.type + 1.5) * 40), 0, (200 + (10 * (1+bone.type)))); 
	}

	else if (currentNumHands == 2){
		stroke((255 - (bone.type + 1.5) * 40), 0, 0);
	}

	line(x1, y1, x2, y2);
}

function RecordData(){
	console.log(framesOfData.pick(null, null, null, 1).toString());
	background(0);
}

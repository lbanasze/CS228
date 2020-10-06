var controllerOptions = {};
var x1, y1, z1, x2, y2, z2;
var hand, fingers, finger, bones, bone;
var previousNumHands = 0;
var currentNumHands = 0;
var numSamples = 100;
var framesOfData = nj.zeros([5,4,6,numSamples]);
var normalizedPrevJoint, normalizedNextJoint;
var currentSample = 0;
var arrayDone = false;

nj.config.printThreshold = 1000;

Leap.loop(controllerOptions, function(frame)
	{ 	
		currentNumHands = frame.hands.length;
		clear();
		HandleFrame(frame);
		RecordData();
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
	currentSample ++;
//	if (currentNumHands == 2){
		if( currentSample == numSamples){
			currentSample = 0;
			if (!arrayDone){
				console.log(framesOfData.toString());
				arrayDone = true;
			}
		}
//	}

}


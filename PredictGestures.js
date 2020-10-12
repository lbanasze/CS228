var controllerOptions = {};
var trainingCompleted = false;
var features;
var numSamples = 100;
var predictedLabel;
//var testingSampleIndex = 0;
var oneFrameOfData = nj.zeros([5,4,6]);

const knnClassifier = ml5.KNNClassifier();

function HandleFrame(frame){

	var InteractionBox = frame.interactionBox;
        
	if(frame.hands.length >= 1)
        	{
			hand = frame.hands[0];
			HandleHand(hand, InteractionBox);
			Test();
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

	oneFrameOfData.set(fingerIndex, bone.type, 0, normalizedPrevJoint[0]);
	oneFrameOfData.set(fingerIndex, bone.type, 1, normalizedPrevJoint[1]);
	oneFrameOfData.set(fingerIndex, bone.type, 2, normalizedPrevJoint[2]);
	oneFrameOfData.set(fingerIndex, bone.type, 3, normalizedNextJoint[0]);
	oneFrameOfData.set(fingerIndex, bone.type, 4, normalizedNextJoint[1]);
	oneFrameOfData.set(fingerIndex, bone.type, 5, normalizedNextJoint[2]);

	x1 = window.innerWidth * normalizedPrevJoint[0];
	x2 = window.innerWidth * normalizedNextJoint[0];
	y1 = window.innerHeight * (1 - normalizedPrevJoint[1]);
	y2 = window.innerHeight * (1 - normalizedNextJoint[1]);
	z1 = normalizedPrevJoint[2];
	z2 = normalizedNextJoint[2];

	strokeWeight(30 - (bone.type * 4.5));
	
	stroke((255 - (bone.type + 1.5) * 40), (255 - (bone.type + 1.5) * 40), (255 - (bone.type + 1.5) * 40), (200 + (10 * (1+bone.type)))); 

	line(x1, y1, x2, y2);
}

function Train(){
	for (i = 0; i < train2.shape[3]; i ++){
		features = train2.pick(null, null, null, i);
		features = features.reshape(1, 120);
		knnClassifier.addExample(features.tolist(), 2);
		features = train3.pick(null,null,null, i);
		features = features.reshape(1, 120);
		knnClassifier.addExample(features.tolist(), 3);
	}
}

function Test(){
		
	oneFrameOfData = oneFrameOfData.reshape(1,120);
	predictedLabel = knnClassifier.classify(oneFrameOfData.tolist(), GotResults);
}

function GotResults(err, result){
	
	console.log(parseInt(result.label));
}

Leap.loop(controllerOptions, function(frame){
	
	clear();

	if (!trainingCompleted){
		Train();
		trainingCompleted = true;
	}

	HandleFrame(frame);
});

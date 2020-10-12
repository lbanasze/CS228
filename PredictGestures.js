var controllerOptions = {};
var trainingCompleted = false;
var features;
var predictedLabel;
var oneFrameOfData = nj.zeros([5,4,6]);
var n = 0;
var m = 1;
var d = 3;

const knnClassifier = ml5.KNNClassifier();

function HandleFrame(frame){

	var InteractionBox = frame.interactionBox;
        
	if(frame.hands.length >= 1)
        	{
			hand = frame.hands[0];
			HandleHand(hand, InteractionBox);
			CenterXData();
			CenterYData();
			CenterZData();
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

function CenterXData(){
	var xValues = oneFrameOfData.slice([], [], [0,6,3]);
	var currentMean = xValues.mean();
	var horizontalShift = 0.5 - currentMean;

	var currentX;
	var shiftedX;
	for(i = 0; i < 5; i++){
		for(j = 0; j < 4; j++){
			currentX = oneFrameOfData.get(i, j, 0);
			shiftedX = currentX + horizontalShift;
			oneFrameOfData.set(i, j, 0, shiftedX);
			
			currentX = oneFrameOfData.get(i, j, 1);
			shiftedX = currentX + horizontalShift;
			oneFrameOfData.set(i, j, 1, shiftedX);
		}
	}

	currentMean = xValues.mean();
}

function CenterYData(){
	var yValues = oneFrameOfData.slice([], [], [1,6,3]);
	var currentMean = yValues.mean();
	var horizontalShift = 0.5 - currentMean;

	var currentY;
	var shiftedY;
	for(i = 0; i < 5; i++){
		for(j = 0; j < 4; j++){
			currentY = oneFrameOfData.get(i, j, 2);
			shiftedY = currentY + horizontalShift;
			oneFrameOfData.set(i, j, 2, shiftedY);
			
			currentY = oneFrameOfData.get(i, j, 3);
			shiftedY = currentY + horizontalShift;
			oneFrameOfData.set(i, j, 3, shiftedY);
		}
	}

	currentMean = yValues.mean();
}

function CenterZData(){
	var zValues = oneFrameOfData.slice([], [], [2,6,3]);
	var currentMean = zValues.mean();
	var horizontalShift = 0.5 - currentMean;

	var currentZ;
	var shiftedZ;
	for(i = 0; i < 5; i++){
		for(j = 0; j < 4; j++){
			currentZ = oneFrameOfData.get(i, j, 4);
			shiftedZ = currentZ + horizontalShift;
			oneFrameOfData.set(i, j, 4, shiftedZ);
			
			currentZ = oneFrameOfData.get(i, j, 4);
			shiftedZ = currentZ + horizontalShift;
			oneFrameOfData.set(i, j, 4, shiftedZ);
		}
	}

	currentMean = zValues.mean();
}

function Test(){

	for(i = 0; i < oneFrameOfData.shape[2]; i++){	
		var currentSample = oneFrameOfData.pick(null, null, null, i);
		currentSample = currentSample.reshape(1,120);
		predictedLabel = knnClassifier.classify(currentSample.tolist(), GotResults);i
	}
}


function GotResults(err, result){
	n++;
	c = result.label;
	m = ((n-1)*m + (c == d))/n
	console.log(n, m, c);
}

Leap.loop(controllerOptions, function(frame){
	
	clear();

	if (!trainingCompleted){
		Train();
		trainingCompleted = true;
	}

	HandleFrame(frame);
});

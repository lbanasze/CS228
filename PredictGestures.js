var controllerOptions = {};
var trainingCompleted = false;
var features;
var predictedLabel;
var oneFrameOfData = nj.zeros([5,4,6]);
var n = 0;
var m = 1;
var digitsInARow = 0;
var lastDigit;
var programState = 0;
var digitToShow = 0;
var timeSinceLastDigitChange = new Date();

const knnClassifier = ml5.KNNClassifier();

// SIGN IN FUNCTIONS
function IsNewUser(username, list){
	var users = list.children;
	var usernameFound = false;
	for(i = 0; i < users.length; i++){
		if (users[i].innerHTML == username){
			usernameFound = true;
		}
	}

	return usernameFound == false; 
}

function CreateNewUser(username, list){
	item = document.createElement('li');
	item.id = String(username) + "_name";
	item.innerHTML = String(username);
	list.appendChild(item);
}

function CreateSignInItem(username, list){
	item = document.createElement('li');
	item.id = String(username) + "_signins";
	item.innerHTML = 1; 
	list.appendChild(item); 
}

function SignIn(){
	username = document.getElementById('username').value;
	console.log(username);
	var list = document.getElementById('users');
	if (IsNewUser(username, list)){
		CreateNewUser(username, list);
		CreateSignInItem(username, list);
	}
	else{
		ID = String(username) + "_signins";
		listItem = document.getElementById(ID);
		listItem.innerHTML = parseInt(listItem.innerHTML) + 1; 
	}
	console.log(list.innerHTML);
	return false;

}


// DRAWING FUNCTIONS
function HandleFrame(frame){

	var InteractionBox = frame.interactionBox;
       
	if(frame.hands.length >= 1)
        	{
			hand = frame.hands[0];
			HandleHand(hand, InteractionBox);
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
			oneFrameOfData.set(i, j, 3, shiftedX);
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
			currentY = oneFrameOfData.get(i, j, 1);
			shiftedY = currentY + horizontalShift;
			oneFrameOfData.set(i, j, 1, shiftedY);
			
			currentY = oneFrameOfData.get(i, j, 4);
			shiftedY = currentY + horizontalShift;
			oneFrameOfData.set(i, j, 4, shiftedY);
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
			currentZ = oneFrameOfData.get(i, j, 2);
			shiftedZ = currentZ + horizontalShift;
			oneFrameOfData.set(i, j, 2, shiftedZ);
			
			currentZ = oneFrameOfData.get(i, j, 5);
			shiftedZ = currentZ + horizontalShift;
			oneFrameOfData.set(i, j, 5, shiftedZ);
		}
	}

	currentMean = zValues.mean();
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

	x1 = window.innerWidth/2 * normalizedPrevJoint[0];
	x2 = window.innerWidth/2 * normalizedNextJoint[0];
	y1 = window.innerHeight/2 * (1 - normalizedPrevJoint[1]);
	y2 = window.innerHeight/2 * (1 - normalizedNextJoint[1]);
	z1 = normalizedPrevJoint[2];
	z2 = normalizedNextJoint[2];


	strokeWeight(30 - (bone.type * 4.5));
	
	stroke((255 - (bone.type + 1.5) * 40), (255 - (bone.type + 1.5) * 40), (255 - (bone.type + 1.5) * 40), (200 + (10 * (1+bone.type)))); 

	line(x1, y1, x2, y2);
}

// TRAIN FUNCTION
function Train(){
	for (i = 0; i < train2.shape[3]; i ++){
		
		features = train0.pick(null, null, null, i);
		features = features.reshape(1, 120);
		knnClassifier.addExample(features.tolist(), 0);

		features = train1.pick(null, null, null, i);
		features = features.reshape(1, 120);
		knnClassifier.addExample(features.tolist(), 1);

		features = train2.pick(null, null, null, i);
		features = features.reshape(1, 120);
		knnClassifier.addExample(features.tolist(), 2);

		features = train3.pick(null, null, null, i);
		features = features.reshape(1, 120);
		knnClassifier.addExample(features.tolist(), 3);

		features = train4.pick(null, null, null, i);
		features = features.reshape(1, 120);
		knnClassifier.addExample(features.tolist(), 4);

		features = train5.pick(null, null, null, i);
		features = features.reshape(1, 120);
		knnClassifier.addExample(features.tolist(), 5);

		features = train0Bongard.pick(null, null, null, i);
		features = features.reshape(1, 120);
		knnClassifier.addExample(features.tolist(), 0);

		features = train0Allison.pick(null, null, null, i);
		features = features.reshape(1, 120);
		knnClassifier.addExample(features.tolist(), 0);

		features = train1Bongard.pick(null, null, null, i);
		features = features.reshape(1, 120);
		knnClassifier.addExample(features.tolist(), 1);
		
		features = train1Jimmo.pick(null, null, null, i);
		features = features.reshape(1, 120);
		knnClassifier.addExample(features.tolist(), 1);
		
		features = train2Bongard.pick(null, null, null, i);
		features = features.reshape(1, 120);
		knnClassifier.addExample(features.tolist(), 2);
	
		features = train2Jimmo.pick(null, null, null, i);
		features = features.reshape(1, 120);
		knnClassifier.addExample(features.tolist(), 2);

		features = train3Bongard.pick(null,null,null, i);
		features = features.reshape(1, 120);
		knnClassifier.addExample(features.tolist(), 3);
	
/*		features = train4Beattie.pick(null, null, null, i);
		features = features.reshape(1, 120);
		knnClassifier.addExample(features.tolist(), 4);
		
		features = train4Bongard.pick(null, null, null, i);
		features = features.reshape(1, 120);
		knnClassifier.addExample(features.tolist(), 4);
		
		features = train5Bongard.pick(null, null, null, i);
		features = features.reshape(1, 120);
		knnClassifier.addExample(features.tolist(), 5);
		
		features = train6Blewett.pick(null, null, null, i);
		features = features.reshape(1, 120);
		knnClassifier.addExample(features.tolist(), 6);
		
		features = train6Bongard.pick(null, null, null, i);
		features = features.reshape(1, 120);
		knnClassifier.addExample(features.tolist(), 6);
		
		features = train6Fisher.pick(null, null, null, i);
		features = features.reshape(1, 120);
		knnClassifier.addExample(features.tolist(), 6);
		
		features = train7Bongard.pick(null, null, null, i);
		features = features.reshape(1, 120);
		knnClassifier.addExample(features.tolist(), 7);
		
		features = train7Fisher.pick(null, null, null, i);
		features = features.reshape(1, 120);
		knnClassifier.addExample(features.tolist(), 7);
		
		features = train8Bongard.pick(null, null, null, i);
		features = features.reshape(1, 120);
		knnClassifier.addExample(features.tolist(), 8);
		
		features = train8Goldman.pick(null, null, null, i);
		features = features.reshape(1, 120);
		knnClassifier.addExample(features.tolist(), 8);
		
		features = train8Matthews.pick(null, null, null, i);
		features = features.reshape(1, 120);
		knnClassifier.addExample(features.tolist(), 8);
		
		features = train9Bongard.pick(null, null, null, i);
		features = features.reshape(1, 120);
		knnClassifier.addExample(features.tolist(), 9);
	 	
		features = train9Goldman.pick(null, null, null, i);
		features = features.reshape(1, 120);
		knnClassifier.addExample(features.tolist(), 9);
	*/
	}
}

function TrainKnn(){
	if (!trainingCompleted){
		Train();
		trainingCompleted = true;
	}
}

// TESTING FUNCTIONS
function Test(){
	for(i = 0; i < oneFrameOfData.shape[2]; i++){	
		var currentSample = oneFrameOfData.pick(null, null, null, i);
		CenterXData();
		CenterYData();
		CenterZData();
		currentSample = currentSample.reshape(1,120);
		predictedLabel = knnClassifier.classify(currentSample.tolist(), GotResults);
	}
}

function GotResults(err, result){
	n++;
	c = result.label;
	m = ((n-1)*m + (c == digitToShow))/n;
	if (lastDigit != digitToShow){
		digitsInARow = 0;
	}
	if (c == digitToShow){
		digitsInARow += 1; 
	}
	console.log(c, m, digitsInARow);
	lastDigit = c;
}

// DRAWING IMAGES
function DrawArrowLeft(){
	image(imgLeft, window.innerWidth/2, 0, window.innerWidth/2, window.innerHeight/2);
}

function DrawArrowRight(){
	image(imgRight, window.innerWidth/2, 0, window.innerWidth/2, window.innerHeight/2);
}

function DrawArrowUp(){
	image(imgUp, window.innerWidth/2, 0, window.innerWidth/2, window.innerHeight/2);
}

function DrawArrowDown(){
	image(imgDown, window.innerWidth/2, 0, window.innerWidth/2, window.innerHeight/2);
}

function DrawArrowToward(){
	image(imgToward, window.innerWidth/2, 0, window.innerWidth/2, window.innerHeight/2);
}

function DrawArrowAway(){
	image(imgAway, window.innerWidth/2, 0, window.innerWidth/2, window.innerHeight/2);
}

function DrawImage(){
	image(img, 0, 0, window.innerWidth/2, window.innerHeight/2);
}

function DrawLowerRightPanel(){
	if(digitsInARow < 50){
		if (digitToShow == 0){
			image(img0, window.innerWidth/2, window.innerHeight/2, window.innerWidth/2, window.innerHeight/2);
		}
		else if (digitToShow == 1){
			image(img1, window.innerWidth/2, window.innerHeight/2, window.innerWidth/2, window.innerHeight/2);
		}	
		else if (digitToShow == 2){
			image(img2, window.innerWidth/2, window.innerHeight/2, window.innerWidth/2, window.innerHeight/2);
		}
		else if (digitToShow == 3){
			image(img3, window.innerWidth/2, window.innerHeight/2, window.innerWidth/2, window.innerHeight/2);
		}
		else if (digitToShow == 4){
			image(img4, window.innerWidth/2, window.innerHeight/2, window.innerWidth/2, window.innerHeight/2);
		}
		else if (digitToShow == 5){
			image(img5, window.innerWidth/2, window.innerHeight/2, window.innerWidth/2, window.innerHeight/2);
		}
		else if (digitToShow == 6){
			image(img6, window.innerWidth/2, window.innerHeight/2, window.innerWidth/2, window.innerHeight/2);
		}
		else if (digitToShow == 7){
			image(img7, window.innerWidth/2, window.innerHeight/2, window.innerWidth/2, window.innerHeight/2);
		}
		else if (digitToShow == 8){
			image(img8, window.innerWidth/2, window.innerHeight/2, window.innerWidth/2, window.innerHeight/2);
		}
		else if (digitToShow == 9){
			image(img9, window.innerWidth/2, window.innerHeight/2, window.innerWidth/2, window.innerHeight/2);
		}
	}
	else{
		if (digitToShow == 0){
			image(num0, window.innerWidth/2, window.innerHeight/2, window.innerWidth/2, window.innerHeight/2);	
		}
		else if (digitToShow == 1){
			image(num1, window.innerWidth/2, window.innerHeight/2, window.innerWidth/2, window.innerHeight/2);
		}	
		else if (digitToShow == 2){
			image(num2, window.innerWidth/2, window.innerHeight/2, window.innerWidth/2, window.innerHeight/2);
		}
		else if (digitToShow == 3){
			image(num3, window.innerWidth/2, window.innerHeight/2, window.innerWidth/2, window.innerHeight/2);
		}
		else if (digitToShow == 4){
			image(num4, window.innerWidth/2, window.innerHeight/2, window.innerWidth/2, window.innerHeight/2);
		}
		else if (digitToShow == 5){
			image(num5, window.innerWidth/2, window.innerHeight/2, window.innerWidth/2, window.innerHeight/2);
		}
		else if (digitToShow == 6){
			image(num6, window.innerWidth/2, window.innerHeight/2, window.innerWidth/2, window.innerHeight/2);
		}
		else if (digitToShow == 7){
			image(num7, window.innerWidth/2, window.innerHeight/2, window.innerWidth/2, window.innerHeight/2);
		}
		else if (digitToShow == 8){
			image(num8, window.innerWidth/2, window.innerHeight/2, window.innerWidth/2, window.innerHeight/2);
		}
		else if (digitToShow == 9){
			image(num9, window.innerWidth/2, window.innerHeight/2, window.innerWidth/2, window.innerHeight/2);
		}

	}

}

function HandTooFarLeft(){
	var xValues = oneFrameOfData.slice([], [], [0,6,3]);
	var currentMean = xValues.mean();

	if(currentMean < 0.25){
		return true;
	}
	
	return false;
}

function HandTooFarRight(){
	var xValues = oneFrameOfData.slice([], [], [0,6,3]);
	var currentMean = xValues.mean();

	if(currentMean > 0.75){
		return true;
	}

	return false;
}

function HandTooHigh(){
	var yValues = oneFrameOfData.slice([], [], [1,6,3]);
	var currentMean = yValues.mean();
	
	if(currentMean > 0.75){
		return true;
	}

	return false;
}

function HandTooLow(){
	var yValues = oneFrameOfData.slice([], [], [1,6,3]);
	var currentMean = yValues.mean();
	if(currentMean <  0.25){
		return true;
	}

	return false;
}

function HandTooFar(){
	var zValues = oneFrameOfData.slice([], [], [2,6,3]);
	var currentMean = zValues.mean();

	if(currentMean <  0.25){
		return true;
	}

	return false;
}

function HandTooClose(){
	var zValues = oneFrameOfData.slice([], [], [2,6,3]);
	var currentMean = zValues.mean();
	if(currentMean > 0.75){
		return true;
	}

	return false;
}

function HandIsUncentered(){
	if(HandTooFarRight() || HandTooFarLeft() || HandTooHigh() || HandTooLow() || HandTooFar() || HandTooClose()){
		return true;
	}

	return false;
}

function DetermineState(frame){
	if(frame.hands.length == 0){
		programState = 0;
	}

	else if(HandIsUncentered()){
		programState = 1;
	}

	else{
		programState = 2; 
	}
}


// HANDLE STATES
function HandleState0(frame){
	DrawImage();
}

function HandleState1(frame){

	HandleFrame(frame);
	
	if(HandTooFarLeft()){
		DrawArrowRight();
	}

	else if(HandTooFarRight()){
		DrawArrowLeft();
	}

	if(HandTooHigh()){
		DrawArrowDown();
	}

	if(HandTooLow()){
		DrawArrowUp();
	}

	if(HandTooFar()){
		DrawArrowToward();
	}
	
	else if(HandTooClose()){
		DrawArrowAway();
	}


}

function SwitchDigits(){
	if (digitToShow == 0){
		digitToShow = 1;
	}
	else if(digitToShow == 1){
		digitToShow = 2;
	}
	else if(digitToShow == 2){
		digitToShow = 3;
	}
	else if(digitToShow == 3){
		digitToShow = 4;
	}
	else if(digitToShow == 4){
		digitToShow = 5;
	}
	else if(digitToShow == 5){
		digitToShow = 6;
	}
	else if(digitToShow == 6){
		digitToShow = 7;
	}
	else if(digitToShow == 7){
		digitToShow = 8;
	}
	else if(digitToShow == 8){
		digitToShow = 9;
	}
	timeSinceLastDigitChange = new Date();
	n = 0; 
	digitsInARow = 0; 
}

function TimeToSwitchDigits(){
	var currentTime = new Date(); 
	var timeElapsedInMilliseconds = currentTime - timeSinceLastDigitChange; 
	var timeElapsedInSeconds = timeElapsedInMilliseconds/1000;
	if (timeElapsedInSeconds > 5 && digitsInARow >= 200 && m>= 0.5){
		return true; 
	}
	else{
		return false; 
	}
}

function DetermineWhetherToSwitchDigits(){
	if(TimeToSwitchDigits()){
		SwitchDigits();
	}
}

function HandleState2(frame){
	DetermineWhetherToSwitchDigits();
	DrawLowerRightPanel();
	HandleFrame(frame);
}

// LEAP LOOP
Leap.loop(controllerOptions, function(frame){
	
	clear();

	TrainKnn();
	DetermineState(frame);
	if (programState == 0){
		HandleState0(frame);
	}

	else if (programState == 1){
		HandleState1(frame);
	}

	else{
		Test();
		strokeWeight(5);
		stroke(255-255*(m), 255*(m), 0);
		rect(0, 0, window.innerWidth/2, window.innerHeight/2);
		HandleState2(frame);
	}

});
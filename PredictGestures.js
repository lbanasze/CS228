var controllerOptions = {};

// DISPLAY
var username;
var display;
var chart1, chart2, chart3;
var previousState;
var created;
// FRAMES
var zeroFrame = nj.zeros([5, 4, 6]);
var oneFrame = nj.zeros([5, 4, 6]);
var twoFrame = nj.zeros([5, 4, 6]);
var threeFrame = nj.zeros([5, 4, 6]);
var fourFrame = nj.zeros([5, 4, 6]);
var fiveFrame = nj.zeros([5, 4, 6]);
var sixFrame = nj.zeros([5, 4, 6]);
var sevenFrame = nj.zeros([5, 4, 6]);
var eightFrame = nj.zeros([5, 4, 6]);
var nineFrame = nj.zeros([5, 4, 6]);
var oneFrameOfData = nj.zeros([5,4,6]);
var dataSet; 

// MACHINE LEARNING VARIABLES
var c = -1;
var n = 0;
var m = 1;
var mTotal = 0;
const knnClassifier = ml5.KNNClassifier();
var predictedLabel;
var trainingCompleted = false;
var features;

// DIGIT TRACKING
var digitsInARow = 0;
var lastDigit;
var programState = 0;
var digitToShow = 0;
var timeSinceLastDigitChange = new Date();
var displayPrev = false; 
var captured = false;
var correct = [false, false, false, false, false, false, false, false, false, false];

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
	return false;

}


// DRAWING FUNCTIONS
function HandleFrame(frame){

	var InteractionBox = frame.interactionBox;
       
	if(frame.hands.length >= 1)
        	{
			hand = frame.hands[0];
			HandleHand(hand, InteractionBox, oneFrameOfData, false, false);
			if (digitToShow == c && !captured){
				if(digitToShow == 0){
					HandleHand(hand, InteractionBox, zeroFrame, true, true);
				}
				else if(digitToShow == 1){
					HandleHand(hand, InteractionBox, oneFrame, true, true);
				}
				else if(digitToShow == 2){
					HandleHand(hand, InteractionBox, twoFrame, true, true);
				}
				else if(digitToShow == 3){
					HandleHand(hand, InteractionBox, threeFrame, true, true);
				}
				else if(digitToShow == 4){
					HandleHand(hand, InteractionBox, fourFrame, true, true);
				}
				else if(digitToShow == 5){
					HandleHand(hand, InteractionBox, fiveFrame, true, true);
				}
				else if(digitToShow == 6){
					HandleHand(hand, InteractionBox, sixFrame, true, true);
				}
				else if(digitToShow == 7){
					HandleHand(hand, InteractionBox, sevenFrame, true, true);
				}
				else if(digitToShow == 8){
					HandleHand(hand, InteractionBox, eightFrame, true, true);
				}
				else if(digitToShow == 9){
					HandleHand(hand, InteractionBox, nineFrame, true, true);
				}
				captured = true;
			}
			
			if(digitToShow == 0){
				HandleHand(hand, InteractionBox, zeroFrame, true, false);
			}
			else if(digitToShow == 1){
				HandleHand(hand, InteractionBox, oneFrame, true, false);
			}
			else if(digitToShow == 2){
				HandleHand(hand, InteractionBox, twoFrame, true, false);
			}
			else if(digitToShow == 3){
				HandleHand(hand, InteractionBox, threeFrame, true, false);
			}
			else if(digitToShow == 4){
				HandleHand(hand, InteractionBox, fourFrame, true, false);
			}
			else if(digitToShow == 5){
				HandleHand(hand, InteractionBox, fiveFrame, true, false);
				}
			else if(digitToShow == 1){
				HandleHand(hand, InteractionBox, oneFrame, true, false);
			}
			else if(digitToShow == 2){
				HandleHand(hand, InteractionBox, twoFrame, true, false);
			}
			else if(digitToShow == 3){
				HandleHand(hand, InteractionBox, threeFrame, true, false);
			}
			if(digitToShow == 4){
				HandleHand(hand, InteractionBox, fourFrame, true, false);
			}
			if(digitToShow == 5){
				HandleHand(hand, InteractionBox, fiveFrame, true, false);
				}
                }

}

function CenterXData(dataSet){
	var xValues = dataSet.slice([], [], [0,6,3]);
	var currentMean = xValues.mean();
	var horizontalShift = 0.5 - currentMean;

	var currentX;
	var shiftedX;
	for(i = 0; i < 5; i++){
		for(j = 0; j < 4; j++){
			currentX = dataSet.get(i, j, 0);
			shiftedX = currentX + horizontalShift;
			oneFrameOfData.set(i, j, 0, shiftedX);
			currentX = dataSet.get(i, j, 1);
			shiftedX = currentX + horizontalShift;
			dataSet.set(i, j, 3, shiftedX);
		}
	}


	currentMean = xValues.mean();
}

function CenterYData(dataSet){
	var yValues = dataSet.slice([], [], [1,6,3]);
	var currentMean = yValues.mean();
	var horizontalShift = 0.5 - currentMean;
	var currentY;
	var shiftedY;
	for(i = 0; i < 5; i++){
		for(j = 0; j < 4; j++){
			currentY = dataSet.get(i, j, 1);
			shiftedY = currentY + horizontalShift;
			dataSet.set(i, j, 1, shiftedY);
			
			currentY = dataSet.get(i, j, 4);
			shiftedY = currentY + horizontalShift;
			dataSet.set(i, j, 4, shiftedY);
		}
	}

	currentMean = yValues.mean();
}

function CenterZData(dataSet){
	var zValues = dataSet.slice([], [], [2,6,3]);
	var currentMean = zValues.mean();
	var horizontalShift = 0.5 - currentMean;

	var currentZ;
	var shiftedZ;
	for(i = 0; i < 5; i++){
		for(j = 0; j < 4; j++){
			currentZ = dataSet.get(i, j, 2);
			shiftedZ = currentZ + horizontalShift;
			dataSet.set(i, j, 2, shiftedZ);
			
			currentZ = dataSet.get(i, j, 5);
			shiftedZ = currentZ + horizontalShift;
			dataSet.set(i, j, 5, shiftedZ);
		}
	}

	currentMean = zValues.mean();
}

function HandleHand(hand, InteractionBox, dataSet, rightPanel, captureNeeded)
{
	fingers = hand.fingers;

      	for (i = 3; i >= 0;  i--) {
		for (j = 0; j < fingers.length; j++){
			if(!(fingers[j].type == 0 && i ==3)){
				HandleBone(fingers[j].bones[i], fingers[j].type, InteractionBox, dataSet, rightPanel, captureNeeded);
			}
		}
    	}
}

function HandleBone(bone, fingerIndex, InteractionBox, dataSet, rightPanel, captureNeeded){
	normalizedPrevJoint = InteractionBox.normalizePoint(bone.prevJoint, true);
	normalizedNextJoint = InteractionBox.normalizePoint(bone.nextJoint, true);

	if((rightPanel && captureNeeded) || !rightPanel){
		dataSet.set(fingerIndex, bone.type, 0, normalizedPrevJoint[0]);
		dataSet.set(fingerIndex, bone.type, 1, normalizedPrevJoint[1]);
		dataSet.set(fingerIndex, bone.type, 2, normalizedPrevJoint[2]);
		dataSet.set(fingerIndex, bone.type, 3, normalizedNextJoint[0]);
		dataSet.set(fingerIndex, bone.type, 4, normalizedNextJoint[1]);
		dataSet.set(fingerIndex, bone.type, 5, normalizedNextJoint[2]);
	}
	

	if(!rightPanel){
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
}

function DrawPrevious(dataSet){
	for(i = 0; i < dataSet.shape[0]; i++){
		for(j = dataSet.shape[1]; j >= 0; j--){
				x1 = window.innerWidth/8 * dataSet.get(i, j, 0);
				y1 = window.innerHeight/8 * (1- dataSet.get(i, j, 1));
				x2 = window.innerWidth/8 * dataSet.get(i, j, 3);
				y2 = window.innerHeight/8 *(1- dataSet.get(i, j, 4));
			

				strokeWeight(10 - (j*1.5));
				stroke(0, 255 - (j + 1.5) * 40, 0, (200+10*(1+j))); 
				
				if(x1 > 0 && x2 > 0){
					displayPrev = true; 
					line(x1, y1, x2, y2);
				}
				else{
					displayPrev = false; 
				}
		}
	}

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
		CenterXData(oneFrameOfData);
		CenterYData(oneFrameOfData);
		CenterZData(oneFrameOfData);
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
		correct[digitToShow - 1] = true;
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

function DrawTopLeftPanel(){
	if (digitToShow == 1){
		DrawPrevious(zeroFrame);
	}	
	else if (digitToShow == 2){
		DrawPrevious(oneFrame);	
	}
	else if (digitToShow == 3){
		DrawPrevious(twoFrame);	
	}
	else if (digitToShow == 4){
		DrawPrevious(threeFrame);	
	}
	else if (digitToShow == 5){
		DrawPrevious(fourFrame);	
	}
	else if (digitToShow == 6){
		DrawPrevious(fiveFrame);
	}	
	else if (digitToShow == 7){
		DrawPrevious(sixFrame);	
	}
	else if (digitToShow == 8){
		DrawPrevious(sevenFrame);	
	}
	else if (digitToShow == 9){
		DrawPrevious(eightFrame);	
	}
}

function DrawTopRightPanel(){
	image(imgInfo, window.innerWidth/2, 0, window.innerWidth/2, window.innerHeight/2);
}

function DrawLowerRightPanel(dataSet){
	display = false; 
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
	else if(!captured){
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
	previousState = programState;

	if(frame.hands.length == 0){
		programState = 0;
		if (previousState == 2){
			chart3.destroy();
		}
	}

	else if(HandIsUncentered() && frame.hands.length == 1){
		programState = 1;
		if (previousState == 2){
			chart3.destroy();
		}
	}

	else if(frame.hands.length == 2){
		programState = 2;
		if (previousState == 3 && digitToShow > 0){
			chart1.destroy();
			chart2.destroy();
		}
	}

	else{
		programState = 3; 
		if (previousState == 2){
			chart3.destroy();
		}
	}
}


// HANDLE STATES
function HandleState0(frame){
		//DrawUserSigns();
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
	mTotal += m;
	DrawGraphs("chartContainer1", "chartContainer2");
	timeSinceLastDigitChange = new Date();
	n = 0; 
	digitsInARow = 0; 
	captured = false; 
}

function TimeToSwitchDigits(){
	var currentTime = new Date(); 
	var timeElapsedInMilliseconds = currentTime - timeSinceLastDigitChange; 
	var timeElapsedInSeconds = timeElapsedInMilliseconds/1000;
	var max = 10 - (5*(mTotal/(digitToShow+1)));
	if (timeElapsedInSeconds > max){
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

function DrawGraphs(c1, c2){
	/*
	var usersList = document.getElementById("users");
	var users = usersList.children;
	var usersData = []; 
	var sessionsData = []; 
	for(let i = 0; i < users.length - 2; i+=3){
		usersData.push(users[i].innerHTML);
		sessionsData.push(users[i+2].innerHTML);
	}
*/
	var accuracy = mTotal / (digitToShow + 1);
	
	var correct = mTotal / (digitToShow + 1);
	var incorrect = 1 - correct; 

	chart1 = new CanvasJS.Chart(c1,
	    {
		animationEnabled: true,
		title: {
		    text: "Current Session",
		},
		data: [
		{
		    type: "pie",
		    showInLegend: true,
		    dataPoints: [
			{ y: correct, legendText: "Correct", color:"green" },
			{ y: incorrect, legendText: "Incorrect", color: "red"},        
		    ]
		},
		]
	    });
	chart1.render();

	chart2 = new CanvasJS.Chart(c2,
	    {
		animationEnabled: true,
		title: {
		    text: "Accuracy By Session"
		},
		axisX: {
		    interval: 1,
		},
		axisY: {
			minimum: 0,
			maximum: 1
		},
		data: [
		{
		    type: "splineArea",
		    color: "rgba(0,255,0,.3)",
		    type: "splineArea",
		    dataPoints: [
			{ x: 1, y: 0.5},
			{ x: 2, y: 0.8 },
			{ x: 3, y: accuracy}

		    ]
		},
		]
	    });
	chart2.render();


}

function HandleState2(frame){
	DetermineWhetherToSwitchDigits();
	if(digitToShow == 0){
		DrawLowerRightPanel(zeroFrame);
	}
	else if(digitToShow == 1){
		DrawLowerRightPanel(oneFrame);
	}
	else if(digitToShow == 2){
		DrawLowerRightPanel(twoFrame);
	}
	else if(digitToShow == 3){
		DrawLowerRightPanel(threeFrame);
	}
	else if(digitToShow == 4){
		DrawLowerRightPanel(fourFrame);
	}
	else if(digitToShow == 5){
		DrawLowerRightPanel(fiveFrame);
	}
	else if(digitToShow == 6){
		DrawLowerRightPanel(sixFrame);
	}
	else if(digitToShow == 7){
		DrawLowerRightPanel(sevenFrame);
	}
	else if(digitToShow == 8){
		DrawLowerRightPanel(eightFrame);
	}
	else if(digitToShow == 9){
		DrawLowerRightPanel(nineFrame);
	}

	DrawTopLeftPanel();
	DrawTopRightPanel();
	HandleFrame(frame);
}

function DrawSignImages(){
	image(imgNums, window.innerWidth/2, window.innerHeight/2, window.innerWidth/2, window.innerHeight/2);
}

function DrawUserSigns(){
	image(imgAll, 0, 0, window.innerWidth, window.innerHeight/5);
}

function DrawLargeGraph(){
	
//	image(imgChart, 0, window.innerHeight/3, window.innerWidth/2, window.innerHeight/3);

	var accuracy = mTotal / (digitToShow + 1);
	//chart3.reset();
	chart3  = new CanvasJS.Chart("largeContainer1",
	    {
		animationEnabled: true,
		title: {
		    text: "Accuracies of All Users"
		},
		axisX: {
		    interval: 10,
		},
		axisY: {
			minimum: 0,
			maximum: 1
		},
		data: [
		{
		    type: "column",
		    legendMarkerType: "triangle",
		    legendMarkerColor: "green",
		    color: "rgba(0,255,50, 0.3)",
		    showInLegend: true,
		    legendText: "Average Accuracy",
		    dataPoints: [
			{ x: 10, y: 0.45, label: "Laura" },
			{ x: 20, y: 0.6, label: "Laura1" },
			{ x: 30, y: 0.7, label: "Laura2" },

		    ]
		},
		]
	    });
	chart3.render();

}
function HandleState3(frame){
	DrawLargeGraph();
	DrawUserSigns();
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
	
	else if(programState == 2){
		HandleState3(frame); 
	}

	else{
		Test();
		strokeWeight(5);
		stroke(255-255*(m), 255*(m), 0);
		rect(0, 0, window.innerWidth/2, window.innerHeight/2);

		if(digitToShow > 0 && displayPrev){
			strokeWeight(2.5);
			stroke(0, 0, 0);
			rect(0, 0, window.innerWidth/7.9, window.innerHeight/7.9);
		}

		else if(digitToShow > 0){
			strokeWeight(2.5);
			stroke(255, 0, 0);
			rect(0, 0, window.innerWidth/7.9, window.innerHeight/7.9);
		}

		HandleState2(frame);
	}

});

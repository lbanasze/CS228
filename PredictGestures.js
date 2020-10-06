var trainingCompleted = false;
var features;
var numSamples = 100;
var predictedLabel;
var testingSampleIndex = 0;

const knnClassifier = ml5.KNNClassifier();

function draw(){
	clear();
	if (!trainingCompleted){
		Train();
		trainingCompleted = true;
	}
	
	Test();
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
	for (i = 0; i < test.shape[3]; i++){
		features = test.pick(null, null, null, i);
		features = features.reshape(1, 120);
		predictedLabel = knnClassifier.classify(features.tolist(), GotResults);
	}
}

function GotResults(err, result){
	testingSampleIndex += 1; 
	if (testingSampleIndex == numSamples){
		testingSampleIndex = 0;
	}

	console.log(parseInt(result.label));
}


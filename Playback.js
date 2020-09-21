var xStart, yStart, zStart, xEnd, yEnd, zEnd;
var frameIndex = 0;
var timer = 0;
var oneFrameOfData = nj.array([[[ 800.73071, 234.40124, 237.94318, 800.73071, 234.40124, 237.94318],
        [ 800.73071, 234.40124, 237.94318, 596.76165,  220.0619, 203.48499],
        [ 596.76165,  220.0619, 203.48499, 539.96081, 216.92902, 162.26014],
        [ 539.96081, 216.92902, 162.26014, 508.31121,  215.3464, 133.34151]],
       [[ 824.86119, 212.94262, 229.06503, 639.76249, 205.06189, 147.19903],
        [ 639.76249, 205.06189, 147.19903, 570.38643, 196.79298,  95.97059],
        [ 570.38643, 196.79298,  95.97059,  533.1273, 197.88911,  66.39126],
        [  533.1273, 197.88911,  66.39126, 509.12009,  202.0808,  46.03205]],
       [[ 878.10069, 209.98392, 221.30223, 747.41924, 201.67893, 138.55152],
        [ 747.41924, 201.67893, 138.55152, 674.59851, 194.97396,  80.05318],
        [ 674.59851, 194.97396,  80.05318, 628.65378, 196.92859,  45.47544],
        [ 628.65378, 196.92859,  45.47544, 597.72937, 201.37285,  23.38085]],
       [[ 935.66577, 209.95033, 214.58611, 865.21125, 202.03103, 136.81729],
        [ 865.21125, 202.03103, 136.81729, 789.92942, 199.45804,  82.70116],
        [ 789.92942, 199.45804,  82.70116, 740.51711,  201.3318,  49.41529],
        [ 740.51711,  201.3318,  49.41529, 706.13224, 204.43606,  27.38245]],
       [[ 996.47104, 216.77971, 209.64103,  972.8656, 206.99786, 136.59567],
        [  972.8656, 206.99786, 136.59567, 928.20795, 203.38223,  92.84692],
        [ 928.20795, 203.38223,  92.84692, 899.18221, 203.80277,  68.80345],
        [ 899.18221, 203.80277,  68.80345, 871.03731, 205.77979,  47.97399]]]);
var anotherFrameOfData = nj.array([[[ 490.33015, 275.39409, 154.40428, 490.33015, 275.39409, 154.40428],
        [ 490.33015, 275.39409, 154.40428,  289.6386, 240.76248, 137.60931],
        [  289.6386, 240.76248, 137.60931, 191.65523, 214.41878,   119.368],
        [ 191.65523, 214.41878,   119.368, 141.56052, 195.84233, 104.60373]],
       [[ 540.48963, 258.90769, 173.13732, 429.31005, 193.29041, 136.48059],
        [ 429.31005, 193.29041, 136.48059, 391.56327, 154.29371, 114.08297],
        [ 391.56327, 154.29371, 114.08297, 370.11865, 133.05753,  99.78414],
        [ 370.11865, 133.05753,  99.78414, 354.88609, 118.48598,  88.74706]],
       [[ 609.85374, 254.95424,   172.764,  560.2425, 191.23467, 136.64464],
        [  560.2425, 191.23467, 136.64464, 511.03726, 147.07532, 113.20385],
        [ 511.03726, 147.07532, 113.20385, 480.56351, 121.57573,   98.0161],
        [ 480.56351, 121.57573,   98.0161, 459.68676, 105.04155,  87.27311]],
       [[ 681.00203, 253.52085, 169.82773, 692.50319, 196.16944, 136.53329],
        [ 692.50319, 196.16944, 136.53329, 646.13823, 154.69432, 116.49759],
        [ 646.13823, 154.69432, 116.49759, 614.99288, 129.62597, 102.43672],
        [ 614.99288, 129.62597, 102.43672, 592.73405, 113.10282,  92.08727]],
       [[ 749.41737,  257.2256, 160.44462, 808.92147, 204.15108, 132.13441],
        [ 808.92147, 204.15108, 132.13441, 830.58173, 170.02299, 119.58663],
        [ 830.58173, 170.02299, 119.58663, 839.52244, 151.46369, 111.27632],
        [ 839.52244, 151.46369, 111.27632, 845.17885,  135.3877, 102.98478]]]);

function draw(){
	clear();
	frameIndex += 1; 
	if (frameIndex == 100){
		frameIndex = 0;
		
		if (timer == 0){
			timer = 1;
		}

		else{
			timer = 0;
		}
	}

	for(i = 0; i < oneFrameOfData.shape[0]; i++){
		for(j = 0; j < oneFrameOfData.shape[1]; j++){
			console.log(timer);
			if (timer == 0){
				xStart = oneFrameOfData.get(i, j, 0);
				yStart = oneFrameOfData.get(i, j, 1);
				zStart = oneFrameOfData.get(i, j, 2);
				xEnd = oneFrameOfData.get(i, j, 3);
				yEnd = oneFrameOfData.get(i, j, 4);
				zEnd = oneFrameOfData.get(i, j, 5);
				line(xStart, yStart, xEnd, yEnd);
			}
			
			else if (timer == 1){
				xStart = anotherFrameOfData.get(i, j, 0);
				yStart = anotherFrameOfData.get(i, j, 1);
				zStart = anotherFrameOfData.get(i, j, 2);
				xEnd = anotherFrameOfData.get(i, j, 3);
				yEnd = anotherFrameOfData.get(i, j, 4);
				zEnd = anotherFrameOfData.get(i, j, 5);
				line(xStart, yStart, xEnd, yEnd);
			}

		}
	}
}

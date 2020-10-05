var xStart, yStart, zStart, xEnd, yEnd, zEnd;
var frameIndex = 0;
var timer = 0;
var oneFrameOfData = nj.array([[[ 0.41533, 0.22647, 0.61479, 0.41533, 0.22647, 0.61479],
        [ 0.41533, 0.22647, 0.61479, 0.42628, 0.19874, 0.27004],
        [ 0.42628, 0.19874, 0.27004, 0.44363, 0.16597, 0.03979],
        [ 0.44363, 0.16597, 0.03979, 0.47262, 0.11992,       0]],
       [[ 0.49402, 0.29198, 0.58778, 0.45975, 0.38729,  0.1009],
        [ 0.45975, 0.38729,  0.1009, 0.38194, 0.45851,       0],
        [ 0.38194, 0.45851,       0,  0.3328, 0.49659,       0],
        [  0.3328, 0.49659,       0,  0.2954, 0.52243,       0]],
       [[ 0.49201, 0.34408, 0.60967, 0.45231, 0.47263, 0.17299],
        [ 0.45231, 0.47263, 0.17299, 0.36738, 0.54305,       0],
        [ 0.36738, 0.54305,       0, 0.31118, 0.58124,       0],
        [ 0.31118, 0.58124,       0, 0.27119, 0.60482,       0]],
       [[ 0.47823,  0.3919, 0.64216, 0.43537, 0.54232, 0.28343],
        [ 0.43537, 0.54232, 0.28343, 0.36425, 0.62401, 0.02404],
        [ 0.36425, 0.62401, 0.02404, 0.31645, 0.67243,       0],
        [ 0.31645, 0.67243,       0, 0.28239, 0.70394,       0]],
       [[ 0.43685, 0.42738, 0.69025, 0.40165, 0.59605, 0.39335],
        [ 0.40165, 0.59605, 0.39335, 0.33713, 0.68924, 0.22542],
        [ 0.33713, 0.68924, 0.22542, 0.29888, 0.73868, 0.13221],
        [ 0.29888, 0.73868, 0.13221, 0.26356, 0.78085, 0.04995]]]);

var anotherFrameOfData = nj.array([[[ 0.04604, 0.51305, 0.66959, 0.04604, 0.51305, 0.66959],
        [ 0.04604, 0.51305, 0.66959,       0, 0.47557, 0.36248],
        [       0, 0.49598, 0.37219,       0, 0.49884, 0.13486],
        [       0, 0.49884, 0.13486,       0, 0.49838,       0]],
       [[ 0.08724, 0.42173, 0.62642, 0.06646,  0.4121, 0.11483],
        [ 0.06646,  0.4121, 0.11483, 0.09096, 0.47298,       0],
        [ 0.13598, 0.48421,       0, 0.14861, 0.52205,       0],
        [ 0.14861, 0.52205,       0, 0.15734, 0.55145,       0]],
       [[ 0.14032, 0.41431, 0.61719, 0.16252, 0.40578, 0.13228],
        [ 0.16252, 0.40578, 0.13228, 0.18824, 0.49379,       0],
        [ 0.23418, 0.49545,       0, 0.24714, 0.54588,       0],
        [ 0.24714, 0.54588,       0, 0.25484, 0.58222,       0]],
       [[ 0.19384, 0.41977, 0.61742, 0.25471, 0.41377, 0.19172],
        [ 0.25471, 0.41377, 0.19172, 0.27594, 0.49616,       0],
        [ 0.32127, 0.50255,       0, 0.33038,  0.5557,       0],
        [ 0.33038,  0.5557,       0,   0.335, 0.59544,       0]],
       [[ 0.24406, 0.45543, 0.63253, 0.33482, 0.44133, 0.25567],
        [ 0.33482, 0.44133, 0.25567,  0.3478, 0.48918, 0.02214],
        [ 0.39939, 0.50838, 0.03176, 0.40564, 0.54176,       0],
        [ 0.40564, 0.54176,       0, 0.40889, 0.57495,       0]]]);

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
				xStart = window.innerWidth * oneFrameOfData.get(i, j, 0);
				yStart = window.innerHeight * oneFrameOfData.get(i, j, 1);
				zStart = oneFrameOfData.get(i, j, 2);
				xEnd = window.innerWidth * oneFrameOfData.get(i, j, 3);
				yEnd = window.innerHeight * oneFrameOfData.get(i, j, 4);
				zEnd = oneFrameOfData.get(i, j, 5);
				line(xStart, yStart, xEnd, yEnd);
			}
			
			else if (timer == 1){
				xStart = window.innerWidth * anotherFrameOfData.get(i, j, 0);
				yStart = window.innerHeight * anotherFrameOfData.get(i, j, 1);
				zStart = anotherFrameOfData.get(i, j, 2);
				xEnd = window.innerWidth * anotherFrameOfData.get(i, j, 3);
				yEnd = window.innerHeight * anotherFrameOfData.get(i, j, 4);
				zEnd = anotherFrameOfData.get(i, j, 5);
				line(xStart, yStart, xEnd, yEnd);
			}

		}
	}
}

function convertCanvasToImage(canvas) {
	// let img = new Image();
	// img.src = canvas.toDataURL("image/png");
	let img = canvas.toDataURL("image/png");
	return img.replace(/^data:image\/(png|jpg);base64,/, "");
}

function rotateElement(element, angle) {
	var properties = ['transform', 'WebkitTransform', 'MozTransform'];
	var p = null;
	var result = null;

	while (p = properties.shift()) {
		if (typeof element.style[p] != 'undefined') {
			result = p;
		}
	}

	if (result != null) {
		element.style[result] = 'rotate(' + angle + 'deg)';
	}
}

function scaleElement(element, scale) {
	element.style.width = (element.offsetWidth * scale) + "px";
	element.style.height = (element.offsetHeight * scale) + "px";
}

// L'angle 0 correspond au nord (vers le haut)
// Exemple : getElementAngle(posElementX, posElementY, posSourisX, posSourisY)
//			 Ceci retournera l'angle de l'�l�ment par rapport � la position de la souris
function getElementAngle(x1, y1, x2, y2) {
	var adj = x2 - x1;
	var opp = y2 - y1;

	var angle = Math.abs(Math.atan(opp / adj) * 180 / Math.PI);

	if (adj > 0 && opp < 0) {
		angle = 90 - angle;
	}
	else if (adj >= 0 && opp >= 0) {
		angle += 90;
	}
	else if (adj < 0 && opp >= 0) {
		angle = 180 + (90 - angle);
	}
	else {
		angle += 270;
	}

	return angle;
}

function randomChance( max, chance){
	let success = false;
	if(Math.round(Math.random() * max) <= chance){
		success = true;
	}
	return success;
}

function randomRound(min, max) {
    return Math.round(Math.random() * max) + min;
}

function lerp(start, end, amt) {
	return (1 - amt) * start + amt * end
}
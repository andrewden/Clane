var validators = {};
exports.validators = function () {
	return validators;
};

validators.RegularExpressionMobileNumberInput = function (txt) {
	var isValid = false;
	let reg = "";
	if (txt.length==11) {
		reg = /^\d{3}\d{3}\d{5}$/;
	}
	else{
		reg = /^\d{3}\d{3}\d{4}$/;
	}
	// var reg = /^\d{3}\d{3}\d{5}$/;
	if (  txt !== null) {
		if (reg.test(txt) === false) {
				isValid = true;
		}
	}
	else{
		isValid = true;
	}
	return isValid;
};

validators.RegularExpressionEmail = function (txt) {
	var isValid = false;
	var reg = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
	if (txt !== '' && txt !== null) {
		if (reg.test(txt) === false) {
			isValid = false;
		} else {
			isValid = true;
		}
	} else {
		isValid = false;
	}
	return isValid;
};

validators.RegularExpressionPassword = function (txt) {
	var isValid = false;
	var str = txt
		.toString()
		.trim();
	var letter = /[a-zA-Z]/;
	var number = /[0-9]/;
	if (str.length >= 7) {
		var _valid = number.test(str) && letter.test(str);
		if (_valid == false) {
			isValid = false;
		} else {
			isValid = true;
		}
	} else {
		isValid = false;
	}
	return isValid;
};

validators.RegularExpressionMobileNumber = function (txt) {
	var isValid = false;
	if (isNaN(txt) === false && txt !== null) {
		if (txt.length === 10) {
			if (txt.trim() !== '') {
				isValid = true;
			}
		}
	}
	return isValid;
};


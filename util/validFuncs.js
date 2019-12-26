exports.hasUpperCase = (str) => (/[A-Z]/.test(str));
exports.hasNumber = (myString) => /\d/.test(myString);
exports.isMinLength = (value, minLength) => value.length >= minLength;
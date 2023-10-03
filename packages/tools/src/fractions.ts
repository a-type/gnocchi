export function fractionToText(decimal: number) {
	let startx = decimal;
	let maxDenominator = 10;
	let sign = 1;

	// erase negativity for now
	if (decimal < 0) {
		sign = -1;
		decimal *= -1;
	}

	let matrix = [
		[1, 0],
		[0, 1],
	];

	let x = decimal;
	let term: number;
	let ai: number;
	let count = 0;

	while (matrix[1][0] * (ai = Math.floor(x)) + matrix[1][1] <= maxDenominator) {
		// avoid infinite loop
		if (count++ > 50) {
			break;
		}

		let term = matrix[0][0] * ai + matrix[0][1];
		matrix[0][1] = matrix[0][0];
		matrix[0][0] = term;
		term = matrix[1][0] * ai + matrix[1][1];
		matrix[1][1] = matrix[1][0];
		matrix[1][0] = term;

		if (x === ai) {
			// don't divide by zero
			break;
		}

		x = 1 / Math.abs(x - ai);
	}

	let numerator = matrix[0][0] * sign;
	let denominator = matrix[1][0];
	let error = startx - matrix[0][0] / matrix[1][0];

	if (numerator === 0) {
		if (error) {
			return error.toFixed(2);
		}
		return '0';
	}

	if (denominator === 1) {
		return numerator.toString();
	}

	// resolve improper fractions
	if (numerator > denominator) {
		let whole = Math.floor(numerator / denominator);
		let remainder = numerator % denominator;
		if (remainder === 0) {
			return whole.toString();
		}
		return `${whole} ${fractionToUnicode(remainder, denominator)}`;
	}

	return fractionToUnicode(numerator, denominator);
}

function fractionToUnicode(numerator: number, denominator: number) {
	// return unicode symbol if possible
	if (numerator === 1 && denominator === 2) {
		return '½';
	}

	if (numerator === 1 && denominator === 4) {
		return '¼';
	}

	if (numerator === 3 && denominator === 4) {
		return '¾';
	}

	if (numerator === 1 && denominator === 8) {
		return '⅛';
	}

	if (numerator === 3 && denominator === 8) {
		return '⅜';
	}

	if (numerator === 5 && denominator === 8) {
		return '⅝';
	}

	if (numerator === 7 && denominator === 8) {
		return '⅞';
	}

	if (numerator === 1 && denominator === 3) {
		return '⅓';
	}

	if (numerator === 2 && denominator === 3) {
		return '⅔';
	}

	if (numerator === 1 && denominator === 5) {
		return '⅕';
	}

	if (numerator === 2 && denominator === 5) {
		return '⅖';
	}

	if (numerator === 3 && denominator === 5) {
		return '⅗';
	}

	if (numerator === 4 && denominator === 5) {
		return '⅘';
	}

	if (numerator === 1 && denominator === 6) {
		return '⅙';
	}

	if (numerator === 5 && denominator === 6) {
		return '⅚';
	}

	if (numerator === 1 && denominator === 7) {
		return '⅐';
	}

	if (numerator === 1 && denominator === 9) {
		return '⅑';
	}

	if (numerator === 1 && denominator === 10) {
		return '⅒';
	}

	return `${numerator}/${denominator}`;
}

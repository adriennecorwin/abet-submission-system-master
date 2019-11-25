const course_portfolio = require('../../../main/lib/course_portfolio')
// const portfolio = require('../models/CoursePortfolio')
const { expect } = require('../../chai')

describe('Lib - CoursePortfolio', () => {

	describe('get', () => {

		it('with id', async () => {
			const portfolio = await course_portfolio.get(1)

			// TODO
		})

	})

	describe('calculate archive date', () => {
		it('fall 2019', async () => {
			const inputSemester = "fall";
			const inputYear = 2019;
			const expected_output = new Date(2019, 12, 26);
			const actual_output = course_portfolio.calculateArchiveDate(inputSemester, inputYear);
			expect(actual_output).deep.equals(expected_output)
		})

		it('spring 2019', async () => {
			const inputSemester = "spring";
			const inputYear = 2019;
			const expected_output = new Date(2019, 5, 19);
			const actual_output = course_portfolio.calculateArchiveDate(inputSemester, inputYear);
			expect(actual_output).deep.equals(expected_output)
		})

		it('summer 1 2019', async () => {
			const inputSemester = "summer 1";
			const inputYear = 2019;
			const expected_output = new Date(2019, 7, 21);
			const actual_output = course_portfolio.calculateArchiveDate(inputSemester, inputYear);
			expect(actual_output).deep.equals(expected_output)
		})

		it('summer 2 2019', async () => {
			const inputSemester = "summer 2";
			const inputYear = 2019;
			const expected_output = new Date(2019, 8, 22);
			const actual_output = course_portfolio.calculateArchiveDate(inputSemester, inputYear);
			expect(actual_output).deep.equals(expected_output)
		})

		it('winter 2019', async () => {
			const inputSemester = "winter";
			const inputYear = 2019;
			const expected_output = new Date(2019, 2, 16);
			const actual_output = course_portfolio.calculateArchiveDate(inputSemester, inputYear);
			expect(actual_output).deep.equals(expected_output)
		})

		it('fall 0', async () => {
			const inputSemester = "none";
			const inputYear = 0;
			const test_function = () => {
				course_portfolio.calculateArchiveDate(inputSemester, inputYear)
			}
			expect(test_function).to.throw(Error, 'Invalid portfolio year')
		})

		it('winter -1', async () => {
			const inputSemester = "winter";
			const inputYear = -1;
			const test_function = () => {
				course_portfolio.calculateArchiveDate(inputSemester, inputYear)
			}
			expect(test_function).to.throw(Error, 'Invalid portfolio year')
		})

		it('none 2019', async () => {
			const inputSemester = "none";
			const inputYear = 2019;
			const test_function = () => {
				course_portfolio.calculateArchiveDate(inputSemester, inputYear)
			}
			expect(test_function).to.throw(Error, 'Invalid portfolio semester')
		})
	})
})
describe('selectStudentIndexes', () => {

	it('should return an array with every student index in the list when numStudents < 10', () => {
		var numStudents = 9;
		var expected = [1, 2, 3, 4, 5, 6, 7, 8, 9];
		var actual = course_portfolio.selectStudentIndexes(numStudents);
		expect(actual).deep.equals(expected);
	})

	it('should return an array with every student index in the list when numStudents = 10', () => {
		var numStudents = 10;
		var expected = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
		var actual = course_portfolio.selectStudentIndexes(numStudents);
		expect(actual).deep.equals(expected);
	})

	it('should return an array with 10 random distinct student indexes in it, when numStudent > 10', () => {
		const sinon = require('sinon')
		const sandbox = sinon.createSandbox()
		var numStudents = 15;
		var expectedLength = 10; // the minimum number of students that should be evaluated
		var expected = [1, 2, 4, 5, 7, 8, 10, 11, 13, 14]
		// stub out math.random
		const stub = sandbox.stub(Math, 'random')
		stub.onCall(0).returns(0);
		stub.onCall(1).returns(0.1);
		stub.onCall(2).returns(0.2);
		stub.onCall(3).returns(0.3);
		stub.onCall(4).returns(0.4);
		stub.onCall(5).returns(0.4);
		stub.onCall(6).returns(0.5);
		stub.onCall(7).returns(0.5);
		stub.onCall(8).returns(0.6);
		stub.onCall(9).returns(0.7);
		stub.onCall(10).returns(0.12);
		stub.onCall(11).returns(0.11);
		stub.onCall(12).returns(0.8);
		stub.onCall(13).returns(0.9);
		stub.onCall(14).returns(0.10);
		var actual = course_portfolio.selectStudentIndexes(numStudents);
		var actualLength = actual.length;
		expect(actualLength).equals(expectedLength);
		expect(actual).deep.equals(expected);
	})

})

describe('calculate course score', () => {

	it('course score calculation integers', () => {
		var input = [90, 80, 70, 60];
		var expected = 75.00;
		var actual = course_portfolio.calculateCourseScore(input);
		expect(actual).deep.equals(expected);
	})

	it('course score calculation floats', () => {
		var input = [90.9, 80.8, 70.7, 60.6];
		var expected = 75.75;
		var actual = course_portfolio.calculateCourseScore(input);
		expect(actual).equals(expected);
	})

	it('course score calculation 1 score', () => {
		var input = [88];
		var expected = 88.00;
		var actual = course_portfolio.calculateCourseScore(input);
		expect(actual).equals(expected);
	})

	it('course score calculation round to 2 decimal places', () => {
		var input = [22.33, 64.5];
		var expected = 43.41;
		var actual = course_portfolio.calculateCourseScore(input);
		expect(actual).equals(expected);
	})

	it('empty input', () => {
		var input = [];
		const test_function = () => {
			course_portfolio.calculateCourseScore(input)
		}
		expect(test_function).to.throw(Error, 'Invalid slo scores')
	})

})

describe('calculate artifact score', () => {

	it('artifact score calculation (no does not apply)', () => {
		var input = [[4, 3, 3, 4], [2, 3, 3, 1], [1, 2, 2, 1], [3, 4, 4, 3]];
		var expected = [50.00, 75.00, 75.00, 50.00];
		var actual = course_portfolio.calculateArtifactScore(input);
		expect(actual).deep.equals(expected);
	})

	it('artifact score calculation round to 2 decimal places', () => {
		var input = [[4, 4, 3, 1], [3, 4, 2, 1], [2, 2, 1, 1]];
		var expected = [66.67, 66.67, 33.33, 0];
		var actual = course_portfolio.calculateArtifactScore(input);
		expect(actual).deep.equals(expected);
	})

	it('1 does not apply', () => {
		var input = [[4, 0, 3, 4], [2, 0, 3, 1], [1, 0, 2, 1], [3, 0, 4, 3]];
		var expected = [50.00, -1, 75.00, 50.00];
		var actual = course_portfolio.calculateArtifactScore(input);
		expect(actual).deep.equals(expected);
	})

	it('2 does not apply', () => {
		var input = [[4, 0, 0, 4], [2, 0, 0, 1], [1, 0, 0, 1], [3, 0, 0, 3]];
		var expected = [50.00, -1, -1, 50.00];
		var actual = course_portfolio.calculateArtifactScore(input);
		expect(actual).deep.equals(expected);
	})

	it('empty input', () => {
		var input = [];
		const test_function = () => {
			course_portfolio.calculateArtifactScore(input)
		}
		expect(test_function).to.throw(Error, 'Invalid evaluations')
	})

	it('different lengths', () => {
		var input = [[4, 4, 3, 1], [3, 4, 2], [2, 2, 1]];
		const test_function = () => {
			course_portfolio.calculateArtifactScore(input)
		}
		expect(test_function).to.throw(Error, 'Invalid evaluations')
	})

	it('different does not apply', () => {
		var input = [[4, 0, 3, 1], [3, 4, 2], [2, 0, 1]];
		const test_function = () => {
			course_portfolio.calculateArtifactScore(input)
		}
		expect(test_function).to.throw(Error, 'Invalid evaluations')
	})

})

describe('calculate slo score', () => {

	it('has an empty array of artifact scores', () => {
		var input = [];
		const test_function = () => {
			course_portfolio.calculateSLOScore(input)
		}
		expect(test_function).to.throw(Error, 'No artifacts to evaluate')
	})

	it('does not have three artifacts', () => {
		var lowInput = [1, 2];
		var highInput = [1, 2, 3, 4];
		const test_function_lowInput = () => {
			course_portfolio.calculateSLOScore(lowInput)
		}
		const test_function_highInput = () => {
			course_portfolio.calculateSLOScore(highInput)
		}
		expect(test_function_lowInput).to.throw(Error, 'Incorrect number of artifacts')
		expect(test_function_highInput).to.throw(Error, 'Incorrect number of artifacts')
	})

	it('calculates artifact scores', () => {
		var input = [50, 75, 100];
		var expected = 75;
		var actual = course_portfolio.calculateSLOScore(input);
		expect(actual).deep.equals(expected);
	})
})


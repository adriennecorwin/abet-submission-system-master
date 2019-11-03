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


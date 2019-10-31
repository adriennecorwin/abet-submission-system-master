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

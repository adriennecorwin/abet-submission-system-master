var express = require('express');
var mustache = require('../common/mustache')
var html = require('../common/html')
var course_portfolio_lib = require('../lib/course_portfolio')
var router = express.Router();

const Department = require('../models/Department')
const CoursePortfolioArtifact = require('../models/CoursePortfolio/Artifact')

const TermType = require('../models/TermType')

const course_manage_page = async (res, course_id) => {
	const a = await (await CoursePortfolioArtifact.query().select().where("portfolio_slo_id", "=", 1));

	var artifacts = [];
	for(var i=0; i<a.length; i++){
		var artifactDict = {};
		artifactDict['name'] = a[i].name;
		var e = await (await CoursePortfolioArtifact.query().findById(a[i].id)).$relatedQuery('evaluations')
		var evaluations = [];
		for (var j=0; j<e.length; j++){
			var evaluationDict = {};
			evaluationDict['index'] = e[j].student_index;

			evaluations.push(evaluationDict);
		}
		artifactDict['evaluations'] = evaluations;
		artifacts.push(artifactDict)
	}
	console.log(artifacts);

	let course_info = {
		student_learning_outcomes: [
			{
				index: 1,
				description: 'n/a',
				metrics: [
					{
						name: 'n/a',
						exceeds: 'n/a',
						meets: 'n/a',
						partially: 'n/a',
						not: 'n/a'
					},
					{
						name: 'n/a',
						exceeds: 'n/a',
						meets: 'n/a',
						partially: 'n/a',
						not: 'n/a'
					},
					{
						name: 'n/a',
						exceeds: 'n/a',
						meets: 'n/a',
						partially: 'n/a',
						not: 'n/a'
					},
					{
						name: 'n/a',
						exceeds: 'n/a',
						meets: 'n/a',
						partially: 'n/a',
						not: 'n/a'
					},
				],
				artifacts: artifacts
			}
		]
	};
	
	res.render('base_template', {
		title: 'CS498 Course Portfolio',
		body: mustache.render('course/manage', course_info)
	})
}

const course_new_page = async (res, department = false) => {
	const departments = await Department.query().select()
	const semesters = await (await TermType.query()
		.findById('semester'))
		.$relatedQuery('terms')
	let student_learning_outcomes = false

	if (department) {
		student_learning_outcomes = await (await Department.query().findById(department))
			.$relatedQuery('student_learning_outcomes')
	}

	console.log(student_learning_outcomes);

	res.render('base_template', {
		title: 'New Course Portfolio',
		body: mustache.render('course/new', {
			departments,
			department,
			student_learning_outcomes,
			semesters
		})
	})
}

/* GET course home page */
router.route('/')
	.get(html.auth_wrapper(async (req, res, next) => {
		res.render('base_template', {
			title: 'Course Portfolios',
			body: mustache.render('course/index')
		})
	}))

/* GET course page */
router.route('/:id')
	.get(html.auth_wrapper(async (req, res, next) => {
		if (req.params.id === 'new') {
			await course_new_page(res)
		} else {
			await course_manage_page(res, req.params.id)
		}
	}))
	.post(html.auth_wrapper(async (req, res, next) => {
		if (req.params.id === 'new') {
			if (req.body.course_submit) {
				const course_portfolio = await course_portfolio_lib.new({
					department_id: req.body.department,
					course_number: req.body.course_number,
					instructor: 1,
					semester: req.body.semester,
					year: req.body.course_year,
					num_students: req.body.num_students,
					student_learning_outcomes: Object.entries(req.body)
						.filter(entry => entry[0].startsWith('slo_') && entry[1] === 'on')
						.map(entry => entry[0].split('_')[1]),
					section: req.body.course_section
				})

				res.redirect(302, `/course/${course_portfolio.id}`)
			} else {
				await course_new_page(res, req.body.department)
			}
		} else {
			await course_manage_page(res, 499)
		}
	}))

module.exports = router;

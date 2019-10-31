const Portfolio = require('../models/CoursePortfolio')

module.exports.new = async ({
	department_id,
	course_number,
	instructor,
	semester,
	year,
	num_students,
	student_learning_outcomes,
	section
}) => {
	// TODO
	return {
		id: 'todo'
	};
}


module.exports.get = async (portfolio_id) => {
	let raw_portfolio = await Portfolio.query()
		.eager({
			owner: {
				owner: true
			},
			instructor: true,
			semester: true,
			outcomes: {
				slo: {
					metrics: true
				},
				artifacts: {
					evaluations: true
				}
			}
		})
		.findById(portfolio_id)

	let portfolio = {
		portfolio_id: raw_portfolio.id,
		course_id: raw_portfolio.course_id,
		instructor: raw_portfolio.instructor,
		num_students: raw_portfolio.num_students,
		outcomes: [],
		course: {
			department: raw_portfolio.owner.owner.identifier,
			number: raw_portfolio.owner.number,
			section: raw_portfolio.section,
			semester: raw_portfolio.semester.value,
			year: raw_portfolio.year
		},
	}

	for (let i in raw_portfolio.outcomes) {
		portfolio.outcomes.push(Object.assign({
			artifacts: raw_portfolio.outcomes[i].artifacts
		}, raw_portfolio.outcomes[i].slo))
	}

	return portfolio
}
module.exports.calculateArchiveDate = (semester, year) => {
	if (year <= 0){
		throw new Error('Invalid portfolio year');
	}
	if(semester == "fall"){
		finalDate = new Date(year, 12, 12);
	}
	else if(semester == "spring"){
		finalDate = new Date(year, 5, 5);
	}
	else if(semester == "summer 1"){
		finalDate = new Date(year, 7, 7);
	}
	else if(semester == "summer 2"){
		finalDate = new Date(year, 8, 8);
	}
	else if(semester == "winter"){
		finalDate = new Date(year, 2, 2);
	}
	else{
		throw new Error('Invalid portfolio semester');
	}
	archiveDate = new Date(finalDate.setDate(finalDate.getDate() + (2 * 7))); //final date plus 2 weeks
	return archiveDate;
}

// module.exports.calculateArchiveDate = (portfolio) => {
// 	if (portfolio.year <= 0){
// 		throw "Invalid portfolio year"
// 	}
// 	if(portfolio.semester == "fall"){
// 		finalDate = new Date(portfolio.year, 12, 12)
// 	}
// 	else if(portfolio.semester == "spring"){
// 		finalDate = new Date(portfolio.year, 5, 5)
// 	}
// 	else if(portfolio.semester == "summer 1"){
// 		finalDate = new Date(portfolio.year, 7, 7)
// 	}
// 	else if(portfolio.semester == "summer 2"){
// 		finalDate = new Date(portfolio.year, 8, 8)
// 	}
// 	else if(portfolio.semester == "winter"){
// 		finalDate = new Date(portfolio.year, 2, 2)
// 	}
// 	else{
// 		throw "Invalid portfolio semester";
// 	}
//     if (finalDate instanceof Date){
//       return new Date(finalDate + 12096e5) //final date plus 2 weeks
//     }
//     else{
//       throw "Not a properly formatted final date";
// 	} 
// }
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
	if (year <= 0) {
		throw new Error('Invalid portfolio year');
	}
	if (semester == "fall") {
		finalDate = new Date(year, 12, 12);
	}
	else if (semester == "spring") {
		finalDate = new Date(year, 5, 5);
	}
	else if (semester == "summer 1") {
		finalDate = new Date(year, 7, 7);
	}
	else if (semester == "summer 2") {
		finalDate = new Date(year, 8, 8);
	}
	else if (semester == "winter") {
		finalDate = new Date(year, 2, 2);
	}
	else {
		throw new Error('Invalid portfolio semester');
	}
	archiveDate = new Date(finalDate.setDate(finalDate.getDate() + (2 * 7))); //final date plus 2 weeks
	return archiveDate;
}

// function to get num students and randomly select indexed
module.exports.selectStudentIndexes = (numStudents) => {
	var minNumStudents = 10;
	if (numStudents <= 10) {
		var studentIndexes = Array(numStudents);
		for (var i = 0; i < numStudents; i++) {
			studentIndexes[i] = i + 1;
		}
		return studentIndexes;
	} else {
		var studentIndexes = Array(minNumStudents);
		for (var j = 0; j < minNumStudents; j++) {
			studentIndexes[j] = Math.floor(Math.random() * numStudents) + 1
		}
		var finalStudentIndexes = [...new Set(studentIndexes)]; //picks out the unique studentIndex values
		while (finalStudentIndexes.length < minNumStudents) {
			finalStudentIndexes.push(Math.floor(Math.random() * numStudents) + 1);
			finalStudentIndexes = [...new Set(finalStudentIndexes)];
		}
	}
	return finalStudentIndexes;
}

// function to calculate course score as average of given array of slo scores
// cut off scores at 2 decimal places
module.exports.calculateCourseScore = (sloScores) => {
	if (sloScores.length == 0) {
		throw new Error('Invalid slo scores');
	}
	var courseScore = 0;
	for(var i=0; i<sloScores.length; i++){
		courseScore += sloScores[i];
	}
	courseScore = parseFloat((courseScore / sloScores.length).toFixed(2))
	return courseScore;
}

//function to calculate artifact score
//input: array of arrays where each subarray represents a student and each element of the subarray 
//represents how well they performed in a category of the rubric (4=exceeds, 3=meets, 2=partially meets, 1=does not meet, 0=does not apply)
//output: array of percentages, representing percentage of students who met or exceeded at each category of the rubric
//if category does not apply, the score for that category is -1
// cut off scores at 2 decimal places
module.exports.calculateArtifactScore = (studentEvals) => {
	//make sure there are evaluations for the calculation
	if (studentEvals.length == 0) {
		throw new Error('Invalid evaluations');
	}

	//make sure every student has the same number of categories in their evaluations
	numRubricCategories = studentEvals[0].length
	for (var i = 1; i < studentEvals.length; i++) {
		if (studentEvals[i].length != numRubricCategories) {
			throw new Error('Invalid evaluations');
		}
	}

	//ensure that if one student has does not apply in a category, all students have does not apply in that category as well
	dnaIndexes = []
	for (var i = 0; i < numRubricCategories; i++) {
		if (studentEvals[0][i] == 0) {
			dnaIndexes.push(i);
		}
	}
	for (var i = 0; i < studentEvals.length; i++) {
		for (var j = 0; j < dnaIndexes.length; j++) {
			if (studentEvals[i][dnaIndexes[j]] != 0) {
				throw new Error('Invalid evaluations');
			}
		}
	}
	var scores = [];
	for (var i = 0; i < numRubricCategories; i++) {
		if (dnaIndexes.includes(i)) {
			scores.push(-1);
		}
		else {
			scores.push(0);
		}
	}
	for (var i = 0; i < studentEvals.length; i++) {
		for (var j = 0; j < studentEvals[i].length; j++) {
			if (!dnaIndexes.includes(j)) {
				if (studentEvals[i][j] >= 3) {
					scores[j] += 1;
				}
			}
		}
	}
	for (var i = 0; i < numRubricCategories; i++) {
		if (!dnaIndexes.includes(i)) {
			scores[i] = parseFloat(((scores[i] / studentEvals.length) * 100).toFixed(2));
		}
	}

	var sumScores = 0;
	var numScoredCategories = 0;
	for(var i=0; i<numRubricCategories; i++){
		if(scores[i] != -1){
			numScoredCategories += 1;
			sumScores += scores[i];
		}
	}

	return parseFloat((sumScores/numScoredCategories).toFixed(2));
}

//function to calculate slo score
//input: array of arrays where each subarray represents an artifact and each element of the subarray 
//represents the overall score for each category of the rubric for that artifact
//output: array of integers representing the avergae score for each category for the provided artifacts
module.exports.calculateSLOScore = (artifactScores) => {
	//make sure there are evaluations for the calculation
	if (artifactScores.length == 0) {
		throw new Error('Invalid artifacts');
	}

	// make sure that all of the artifact scores have the same length
	for(var k = 0; k < artifactScores.length - 1; k++) {
		if(artifactScores[k].length !== artifactScores[k+1].length) {
			throw new Error('Artifact scores have different length');
		}
	}

	var sloScore = [];
	var currentCategoryScore = 0;
	var count = 0;

	// compute the avergae for each category of the given artifacts
	for (var i = 0; i < artifactScores[0].length; i++) {
		artifactScores.forEach(artifact => {
			currentCategoryScore += artifact[i];
			count++;
		});
		currentCategoryScore = currentCategoryScore / count;
		sloScore.push(currentCategoryScore);
		count = 0;
		currentCategoryScore = 0;
	}

	return sloScore;
}

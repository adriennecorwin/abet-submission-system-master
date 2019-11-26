const User = require('../models/User') // relative path to the User model from user.js

// This function was given by 
// https://uk.instructure.com/courses/1957194/pages/final-project-phase-2-example
const is_whitelisted = async (linkblue_username) => {
    // try to pull the user from the user table using the linkblue_username
    const user = await User.query()
        .findById(linkblue_username);
    // if we got a user back return true
    if(user) {
        return true;
    }
    // else return false
    else {
        return false;
    }
}

module.exports.is_whitelisted = is_whitelisted
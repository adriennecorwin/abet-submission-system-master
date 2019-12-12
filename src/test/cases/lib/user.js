const user_lib = require('../../../main/lib/user')
const { expect } = require('../../chai')
const sinon = require('sinon')

const sandbox = sinon.createSandbox();

// These tests were given by 
// https://uk.instructure.com/courses/1957194/pages/final-project-phase-2-example
describe('Lib - User', () => {

    describe('is_whitelisted', () => {

        afterEach(() => {
            sandbox.restore();
        })

        it('returns true when the id is in the table', async () => {
            // Arrange
            const User = require('../../../main/models/User');

            // User.query()
            sandbox.stub(User, "query").returns({
                //User.query().findById()
                findById: sandbox.stub().returns({
                    // An example user object
                    id: 1,
                    linkblue_username: 'egto222'
                })
            })

            // Act
            const result = await user_lib.is_whitelisted('egto222');

            // Assert
            expect(result).to.true;
        })

        it('returns false when the id is not in the table', async () => {
            // Arrange
            const User = require('../../../main/models/User');

            // User.query()
            sandbox.stub(User, "query").returns({
                // User.query().findById() does not return a user object
                findById: sandbox.stub().returns(null)
            })

            // Act
            const result = await user_lib.is_whitelisted('egto222');

            //Assert
            expect(result).to.false;
        })
    })
})
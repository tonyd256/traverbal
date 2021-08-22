const rewire = require("rewire")
const Profile = rewire("./Profile")
const useProfileForm = Profile.__get__("useProfileForm")
// @ponicode
describe("useProfileForm", () => {
    test("0", () => {
        let callFunction = () => {
            useProfileForm("callback detected, not supported yet")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction = () => {
            useProfileForm(undefined)
        }
    
        expect(callFunction).not.toThrow()
    })
})

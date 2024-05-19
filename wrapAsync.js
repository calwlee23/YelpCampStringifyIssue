// this is to catch error arises from async function
// this function accept a function as an argument, execute that function and catch any error and pass it to next()
module.exports = func => {
    return (req, res, next) => {
        func(req, res, next).catch(next);
    }
}

const Datatype = ({db, app}) => {
    return function (req, res, next) {
        req.db = db
        req.app = app
        next()
    }
}

module.exports = Datatype;
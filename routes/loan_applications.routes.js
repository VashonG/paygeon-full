
const loan_applications = require('./../controller/loan_applications')
const _ = require('./../middleware/bypassdb.middleware')
const { verifyJwt, verifyJwtForOpen } = require("./../middleware/verifytoken.middleware")

const routes = ({ db, app }) => {
    const _db = { db, app }
    app.put("/api/v1/open/collection-form/loan_applications/items/:filter", _(_db), verifyJwtForOpen, loan_applications.editItem)
    app.get("/api/v1/open/items/loan_applications/item/:filter", _(_db), verifyJwtForOpen, loan_applications.loan_applicationsDetail)
    app.delete("/api/v1/open/collection-form/loan_applications/items/:filter", _(_db), verifyJwtForOpen, loan_applications.deleteItem)
    app.post("/api/v1/open/collection-form/loan_applications/items/constructor/:filter?", _(_db), verifyJwtForOpen, loan_applications.loan_applicationsStoreData)
    app.get("/api/v1/open/collection-table/loan_applications/finder/:filter/items/count", _(_db), verifyJwtForOpen, loan_applications.loan_applicationsCount)
    app.get("/api/v1/open/collection-table/loan_applications/finder/:filter/items", _(_db), verifyJwtForOpen, loan_applications.loan_applicationsList)
    app.put("/api/v1/collection-form/loan_applications/items/:filter", _(_db), verifyJwt, loan_applications.editItem)
    app.get("/api/v1/items/loan_applications/item/:filter", _(_db), verifyJwt, loan_applications.loan_applicationsDetail)
    app.delete("/api/v1/collection-form/loan_applications/items/:filter", _(_db), verifyJwt, loan_applications.deleteItem)
    app.post("/api/v1/collection-form/loan_applications/items/constructor/:filter?", _(_db), verifyJwt, loan_applications.loan_applicationsStoreData)
    app.get("/api/v1/collection-table/loan_applications/finder/:filter/items/count", _(_db), verifyJwt, loan_applications.loan_applicationsCount)
    app.get("/api/v1/collection-table/loan_applications/finder/:filter/items", _(_db), verifyJwt, loan_applications.loan_applicationsList)
}

module.exports = routes
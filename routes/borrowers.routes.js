
const borrowers = require('./../controller/borrowers')
const _ = require('./../middleware/bypassdb.middleware')
const { verifyJwt, verifyJwtForOpen } = require("./../middleware/verifytoken.middleware")

const routes = ({ db, app }) => {
    const _db = { db, app }
    app.put("/api/v1/open/collection-form/borrowers/items/:filter", _(_db), verifyJwtForOpen, borrowers.editItem)
    app.get("/api/v1/open/items/borrowers/item/:filter", _(_db), verifyJwtForOpen, borrowers.borrowersDetail)
    app.delete("/api/v1/open/collection-form/borrowers/items/:filter", _(_db), verifyJwtForOpen, borrowers.deleteItem)
    app.post("/api/v1/open/collection-form/borrowers/items/constructor/:filter?", _(_db), verifyJwtForOpen, borrowers.borrowersStoreData)
    app.get("/api/v1/open/collection-table/borrowers/finder/:filter/items/count", _(_db), verifyJwtForOpen, borrowers.borrowersCount)
    app.get("/api/v1/open/collection-table/borrowers/finder/:filter/items", _(_db), verifyJwtForOpen, borrowers.borrowersList)
    app.put("/api/v1/collection-form/borrowers/items/:filter", _(_db), verifyJwt, borrowers.editItem)
    app.get("/api/v1/items/borrowers/item/:filter", _(_db), verifyJwt, borrowers.borrowersDetail)
    app.delete("/api/v1/collection-form/borrowers/items/:filter", _(_db), verifyJwt, borrowers.deleteItem)
    app.post("/api/v1/collection-form/borrowers/items/constructor/:filter?", _(_db), verifyJwt, borrowers.borrowersStoreData)
    app.get("/api/v1/collection-table/borrowers/finder/:filter/items/count", _(_db), verifyJwt, borrowers.borrowersCount)
    app.get("/api/v1/collection-table/borrowers/finder/:filter/items", _(_db), verifyJwt, borrowers.borrowersList)
}

module.exports = routes

const user = require('./../controller/user')
const _ = require('./../middleware/bypassdb.middleware')
const { verifyJwt, verifyJwtForOpen } = require("./../middleware/verifytoken.middleware")

const routes = ({ db, app }) => {
    const _db = { db, app }
    app.put("/api/v1/open/collection-form/user/items/:filter", _(_db), verifyJwtForOpen, user.editItem)
    app.get("/api/v1/open/items/user/item/:filter", _(_db), verifyJwtForOpen, user.userDetail)
    app.delete("/api/v1/open/collection-form/user/items/:filter", _(_db), verifyJwtForOpen, user.deleteItem)
    app.post("/api/v1/open/collection-form/user/items/constructor/:filter?", _(_db), verifyJwtForOpen, user.userStoreData)
    app.get("/api/v1/open/collection-table/user/finder/:filter/items/count", _(_db), verifyJwtForOpen, user.userCount)
    app.get("/api/v1/open/collection-table/user/finder/:filter/items", _(_db), verifyJwtForOpen, user.userList)
    app.put("/api/v1/collection-form/user/items/:filter", _(_db), verifyJwt, user.editItem)
    app.get("/api/v1/items/user/item/:filter", _(_db), verifyJwt, user.userDetail)
    app.delete("/api/v1/collection-form/user/items/:filter", _(_db), verifyJwt, user.deleteItem)
    app.post("/api/v1/collection-form/user/items/constructor/:filter?", _(_db), verifyJwt, user.userStoreData)
    app.get("/api/v1/collection-table/user/finder/:filter/items/count", _(_db), verifyJwt, user.userCount)
    app.get("/api/v1/collection-table/user/finder/:filter/items", _(_db), verifyJwt, user.userList)
}

module.exports = routes
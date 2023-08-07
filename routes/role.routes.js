
const role = require('./../controller/role')
const _ = require('./../middleware/bypassdb.middleware')
const { verifyJwt, verifyJwtForOpen } = require("./../middleware/verifytoken.middleware")

const routes = ({ db, app }) => {
    const _db = { db, app }
    app.put("/api/v1/open/collection-form/role/items/:filter", _(_db), verifyJwtForOpen, role.editItem)
    app.get("/api/v1/open/items/role/item/:filter", _(_db), verifyJwtForOpen, role.roleDetail)
    app.delete("/api/v1/open/collection-form/role/items/:filter", _(_db), verifyJwtForOpen, role.deleteItem)
    app.post("/api/v1/open/collection-form/role/items/constructor/:filter?", _(_db), verifyJwtForOpen, role.roleStoreData)
    app.get("/api/v1/open/collection-table/role/finder/:filter/items/count", _(_db), verifyJwtForOpen, role.roleCount)
    app.get("/api/v1/open/collection-table/role/finder/:filter/items", _(_db), verifyJwtForOpen, role.roleList)
    app.put("/api/v1/collection-form/role/items/:filter", _(_db), verifyJwt, role.editItem)
    app.get("/api/v1/items/role/item/:filter", _(_db), verifyJwt, role.roleDetail)
    app.delete("/api/v1/collection-form/role/items/:filter", _(_db), verifyJwt, role.deleteItem)
    app.post("/api/v1/collection-form/role/items/constructor/:filter?", _(_db), verifyJwt, role.roleStoreData)
    app.get("/api/v1/collection-table/role/finder/:filter/items/count", _(_db), verifyJwt, role.roleCount)
    app.get("/api/v1/collection-table/role/finder/:filter/items", _(_db), verifyJwt, role.roleList)
}

module.exports = routes
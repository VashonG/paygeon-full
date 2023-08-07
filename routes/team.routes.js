
const team = require('./../controller/team')
const _ = require('./../middleware/bypassdb.middleware')
const { verifyJwt, verifyJwtForOpen } = require("./../middleware/verifytoken.middleware")

const routes = ({ db, app }) => {
    const _db = { db, app }
    app.put("/api/v1/open/collection-form/team/items/:filter", _(_db), verifyJwtForOpen, team.editItem)
    app.get("/api/v1/open/items/team/item/:filter", _(_db), verifyJwtForOpen, team.teamDetail)
    app.delete("/api/v1/open/collection-form/team/items/:filter", _(_db), verifyJwtForOpen, team.deleteItem)
    app.post("/api/v1/open/collection-form/team/items/constructor/:filter?", _(_db), verifyJwtForOpen, team.teamStoreData)
    app.get("/api/v1/open/collection-table/team/finder/:filter/items/count", _(_db), verifyJwtForOpen, team.teamCount)
    app.get("/api/v1/open/collection-table/team/finder/:filter/items", _(_db), verifyJwtForOpen, team.teamList)
    app.put("/api/v1/collection-form/team/items/:filter", _(_db), verifyJwt, team.editItem)
    app.get("/api/v1/items/team/item/:filter", _(_db), verifyJwt, team.teamDetail)
    app.delete("/api/v1/collection-form/team/items/:filter", _(_db), verifyJwt, team.deleteItem)
    app.post("/api/v1/collection-form/team/items/constructor/:filter?", _(_db), verifyJwt, team.teamStoreData)
    app.get("/api/v1/collection-table/team/finder/:filter/items/count", _(_db), verifyJwt, team.teamCount)
    app.get("/api/v1/collection-table/team/finder/:filter/items", _(_db), verifyJwt, team.teamList)
}

module.exports = routes

const redeem_miles = require('./../controller/redeem_miles')
const _ = require('./../middleware/bypassdb.middleware')
const { verifyJwt, verifyJwtForOpen } = require("./../middleware/verifytoken.middleware")

const routes = ({ db, app }) => {
    const _db = { db, app }
    app.put("/api/v1/open/collection-form/redeem_miles/items/:filter", _(_db), verifyJwtForOpen, redeem_miles.editItem)
    app.get("/api/v1/open/items/redeem_miles/item/:filter", _(_db), verifyJwtForOpen, redeem_miles.redeem_milesDetail)
    app.delete("/api/v1/open/collection-form/redeem_miles/items/:filter", _(_db), verifyJwtForOpen, redeem_miles.deleteItem)
    app.post("/api/v1/open/collection-form/redeem_miles/items/constructor/:filter?", _(_db), verifyJwtForOpen, redeem_miles.redeem_milesStoreData)
    app.get("/api/v1/open/collection-table/redeem_miles/finder/:filter/items/count", _(_db), verifyJwtForOpen, redeem_miles.redeem_milesCount)
    app.get("/api/v1/open/collection-table/redeem_miles/finder/:filter/items", _(_db), verifyJwtForOpen, redeem_miles.redeem_milesList)
    app.put("/api/v1/collection-form/redeem_miles/items/:filter", _(_db), verifyJwt, redeem_miles.editItem)
    app.get("/api/v1/items/redeem_miles/item/:filter", _(_db), verifyJwt, redeem_miles.redeem_milesDetail)
    app.delete("/api/v1/collection-form/redeem_miles/items/:filter", _(_db), verifyJwt, redeem_miles.deleteItem)
    app.post("/api/v1/collection-form/redeem_miles/items/constructor/:filter?", _(_db), verifyJwt, redeem_miles.redeem_milesStoreData)
    app.get("/api/v1/collection-table/redeem_miles/finder/:filter/items/count", _(_db), verifyJwt, redeem_miles.redeem_milesCount)
    app.get("/api/v1/collection-table/redeem_miles/finder/:filter/items", _(_db), verifyJwt, redeem_miles.redeem_milesList)
}

module.exports = routes
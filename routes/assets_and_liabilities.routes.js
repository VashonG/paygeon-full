
const assets_and_liabilities = require('./../controller/assets_and_liabilities')
const _ = require('./../middleware/bypassdb.middleware')
const { verifyJwt, verifyJwtForOpen } = require("./../middleware/verifytoken.middleware")

const routes = ({ db, app }) => {
    const _db = { db, app }
    app.put("/api/v1/open/collection-form/assets_and_liabilities/items/:filter", _(_db), verifyJwtForOpen, assets_and_liabilities.editItem)
    app.get("/api/v1/open/items/assets_and_liabilities/item/:filter", _(_db), verifyJwtForOpen, assets_and_liabilities.assets_and_liabilitiesDetail)
    app.delete("/api/v1/open/collection-form/assets_and_liabilities/items/:filter", _(_db), verifyJwtForOpen, assets_and_liabilities.deleteItem)
    app.post("/api/v1/open/collection-form/assets_and_liabilities/items/constructor/:filter?", _(_db), verifyJwtForOpen, assets_and_liabilities.assets_and_liabilitiesStoreData)
    app.get("/api/v1/open/collection-table/assets_and_liabilities/finder/:filter/items/count", _(_db), verifyJwtForOpen, assets_and_liabilities.assets_and_liabilitiesCount)
    app.get("/api/v1/open/collection-table/assets_and_liabilities/finder/:filter/items", _(_db), verifyJwtForOpen, assets_and_liabilities.assets_and_liabilitiesList)
    app.put("/api/v1/collection-form/assets_and_liabilities/items/:filter", _(_db), verifyJwt, assets_and_liabilities.editItem)
    app.get("/api/v1/items/assets_and_liabilities/item/:filter", _(_db), verifyJwt, assets_and_liabilities.assets_and_liabilitiesDetail)
    app.delete("/api/v1/collection-form/assets_and_liabilities/items/:filter", _(_db), verifyJwt, assets_and_liabilities.deleteItem)
    app.post("/api/v1/collection-form/assets_and_liabilities/items/constructor/:filter?", _(_db), verifyJwt, assets_and_liabilities.assets_and_liabilitiesStoreData)
    app.get("/api/v1/collection-table/assets_and_liabilities/finder/:filter/items/count", _(_db), verifyJwt, assets_and_liabilities.assets_and_liabilitiesCount)
    app.get("/api/v1/collection-table/assets_and_liabilities/finder/:filter/items", _(_db), verifyJwt, assets_and_liabilities.assets_and_liabilitiesList)
}

module.exports = routes
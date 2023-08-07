
const plaid_setting = require('./../controller/plaid_setting')
const _ = require('./../middleware/bypassdb.middleware')
const { verifyJwt, verifyJwtForOpen } = require("./../middleware/verifytoken.middleware")

const routes = ({ db, app }) => {
    const _db = { db, app }
    app.put("/api/v1/open/collection-form/plaid_setting/items/:filter", _(_db), verifyJwtForOpen, plaid_setting.editItem)
    app.get("/api/v1/open/items/plaid_setting/item/:filter", _(_db), verifyJwtForOpen, plaid_setting.plaid_settingDetail)
    app.delete("/api/v1/open/collection-form/plaid_setting/items/:filter", _(_db), verifyJwtForOpen, plaid_setting.deleteItem)
    app.post("/api/v1/open/collection-form/plaid_setting/items/constructor/:filter?", _(_db), verifyJwtForOpen, plaid_setting.plaid_settingStoreData)
    app.get("/api/v1/open/collection-table/plaid_setting/finder/:filter/items/count", _(_db), verifyJwtForOpen, plaid_setting.plaid_settingCount)
    app.get("/api/v1/open/collection-table/plaid_setting/finder/:filter/items", _(_db), verifyJwtForOpen, plaid_setting.plaid_settingList)
    app.put("/api/v1/collection-form/plaid_setting/items/:filter", _(_db), verifyJwt, plaid_setting.editItem)
    app.get("/api/v1/items/plaid_setting/item/:filter", _(_db), verifyJwt, plaid_setting.plaid_settingDetail)
    app.delete("/api/v1/collection-form/plaid_setting/items/:filter", _(_db), verifyJwt, plaid_setting.deleteItem)
    app.post("/api/v1/collection-form/plaid_setting/items/constructor/:filter?", _(_db), verifyJwt, plaid_setting.plaid_settingStoreData)
    app.get("/api/v1/collection-table/plaid_setting/finder/:filter/items/count", _(_db), verifyJwt, plaid_setting.plaid_settingCount)
    app.get("/api/v1/collection-table/plaid_setting/finder/:filter/items", _(_db), verifyJwt, plaid_setting.plaid_settingList)
}

module.exports = routes
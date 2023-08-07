
const news_update = require('./../controller/news_update')
const _ = require('./../middleware/bypassdb.middleware')
const { verifyJwt, verifyJwtForOpen } = require("./../middleware/verifytoken.middleware")

const routes = ({ db, app }) => {
    const _db = { db, app }
    app.put("/api/v1/open/collection-form/news_update/items/:filter", _(_db), verifyJwtForOpen, news_update.editItem)
    app.get("/api/v1/open/items/news_update/item/:filter", _(_db), verifyJwtForOpen, news_update.news_updateDetail)
    app.delete("/api/v1/open/collection-form/news_update/items/:filter", _(_db), verifyJwtForOpen, news_update.deleteItem)
    app.post("/api/v1/open/collection-form/news_update/items/constructor/:filter?", _(_db), verifyJwtForOpen, news_update.news_updateStoreData)
    app.get("/api/v1/open/collection-table/news_update/finder/:filter/items/count", _(_db), verifyJwtForOpen, news_update.news_updateCount)
    app.get("/api/v1/open/collection-table/news_update/finder/:filter/items", _(_db), verifyJwtForOpen, news_update.news_updateList)
    app.put("/api/v1/collection-form/news_update/items/:filter", _(_db), verifyJwt, news_update.editItem)
    app.get("/api/v1/items/news_update/item/:filter", _(_db), verifyJwt, news_update.news_updateDetail)
    app.delete("/api/v1/collection-form/news_update/items/:filter", _(_db), verifyJwt, news_update.deleteItem)
    app.post("/api/v1/collection-form/news_update/items/constructor/:filter?", _(_db), verifyJwt, news_update.news_updateStoreData)
    app.get("/api/v1/collection-table/news_update/finder/:filter/items/count", _(_db), verifyJwt, news_update.news_updateCount)
    app.get("/api/v1/collection-table/news_update/finder/:filter/items", _(_db), verifyJwt, news_update.news_updateList)
}

module.exports = routes
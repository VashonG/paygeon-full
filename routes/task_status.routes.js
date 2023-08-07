
const task_status = require('./../controller/task_status')
const _ = require('./../middleware/bypassdb.middleware')
const { verifyJwt, verifyJwtForOpen } = require("./../middleware/verifytoken.middleware")

const routes = ({ db, app }) => {
    const _db = { db, app }
    app.put("/api/v1/open/collection-form/task_status/items/:filter", _(_db), verifyJwtForOpen, task_status.editItem)
    app.get("/api/v1/open/items/task_status/item/:filter", _(_db), verifyJwtForOpen, task_status.task_statusDetail)
    app.delete("/api/v1/open/collection-form/task_status/items/:filter", _(_db), verifyJwtForOpen, task_status.deleteItem)
    app.post("/api/v1/open/collection-form/task_status/items/constructor/:filter?", _(_db), verifyJwtForOpen, task_status.task_statusStoreData)
    app.get("/api/v1/open/collection-table/task_status/finder/:filter/items/count", _(_db), verifyJwtForOpen, task_status.task_statusCount)
    app.get("/api/v1/open/collection-table/task_status/finder/:filter/items", _(_db), verifyJwtForOpen, task_status.task_statusList)
    app.put("/api/v1/collection-form/task_status/items/:filter", _(_db), verifyJwt, task_status.editItem)
    app.get("/api/v1/items/task_status/item/:filter", _(_db), verifyJwt, task_status.task_statusDetail)
    app.delete("/api/v1/collection-form/task_status/items/:filter", _(_db), verifyJwt, task_status.deleteItem)
    app.post("/api/v1/collection-form/task_status/items/constructor/:filter?", _(_db), verifyJwt, task_status.task_statusStoreData)
    app.get("/api/v1/collection-table/task_status/finder/:filter/items/count", _(_db), verifyJwt, task_status.task_statusCount)
    app.get("/api/v1/collection-table/task_status/finder/:filter/items", _(_db), verifyJwt, task_status.task_statusList)
}

module.exports = routes
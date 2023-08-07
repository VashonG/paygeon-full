
const comment = require('./../controller/comment')
const _ = require('./../middleware/bypassdb.middleware')
const { verifyJwt, verifyJwtForOpen } = require("./../middleware/verifytoken.middleware")

const routes = ({ db, app }) => {
    const _db = { db, app }
    app.put("/api/v1/open/collection-form/comment/items/:filter", _(_db), verifyJwtForOpen, comment.editItem)
    app.get("/api/v1/open/items/comment/item/:filter", _(_db), verifyJwtForOpen, comment.commentDetail)
    app.delete("/api/v1/open/collection-form/comment/items/:filter", _(_db), verifyJwtForOpen, comment.deleteItem)
    app.post("/api/v1/open/collection-form/comment/items/constructor/:filter?", _(_db), verifyJwtForOpen, comment.commentStoreData)
    app.get("/api/v1/open/collection-table/comment/finder/:filter/items/count", _(_db), verifyJwtForOpen, comment.commentCount)
    app.get("/api/v1/open/collection-table/comment/finder/:filter/items", _(_db), verifyJwtForOpen, comment.commentList)
    app.put("/api/v1/collection-form/comment/items/:filter", _(_db), verifyJwt, comment.editItem)
    app.get("/api/v1/items/comment/item/:filter", _(_db), verifyJwt, comment.commentDetail)
    app.delete("/api/v1/collection-form/comment/items/:filter", _(_db), verifyJwt, comment.deleteItem)
    app.post("/api/v1/collection-form/comment/items/constructor/:filter?", _(_db), verifyJwt, comment.commentStoreData)
    app.get("/api/v1/collection-table/comment/finder/:filter/items/count", _(_db), verifyJwt, comment.commentCount)
    app.get("/api/v1/collection-table/comment/finder/:filter/items", _(_db), verifyJwt, comment.commentList)
}

module.exports = routes
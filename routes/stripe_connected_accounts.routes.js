
const stripe_connected_accounts = require('./../controller/stripe_connected_accounts')
const _ = require('./../middleware/bypassdb.middleware')
const { verifyJwt, verifyJwtForOpen } = require("./../middleware/verifytoken.middleware")

const routes = ({ db, app }) => {
    const _db = { db, app }
    app.put("/api/v1/open/collection-form/stripe_connected_accounts/items/:filter", _(_db), verifyJwtForOpen, stripe_connected_accounts.editItem)
    app.get("/api/v1/open/items/stripe_connected_accounts/item/:filter", _(_db), verifyJwtForOpen, stripe_connected_accounts.stripe_connected_accountsDetail)
    app.delete("/api/v1/open/collection-form/stripe_connected_accounts/items/:filter", _(_db), verifyJwtForOpen, stripe_connected_accounts.deleteItem)
    app.post("/api/v1/open/collection-form/stripe_connected_accounts/items/constructor/:filter?", _(_db), verifyJwtForOpen, stripe_connected_accounts.stripe_connected_accountsStoreData)
    app.get("/api/v1/open/collection-table/stripe_connected_accounts/finder/:filter/items/count", _(_db), verifyJwtForOpen, stripe_connected_accounts.stripe_connected_accountsCount)
    app.get("/api/v1/open/collection-table/stripe_connected_accounts/finder/:filter/items", _(_db), verifyJwtForOpen, stripe_connected_accounts.stripe_connected_accountsList)
    app.put("/api/v1/collection-form/stripe_connected_accounts/items/:filter", _(_db), verifyJwt, stripe_connected_accounts.editItem)
    app.get("/api/v1/items/stripe_connected_accounts/item/:filter", _(_db), verifyJwt, stripe_connected_accounts.stripe_connected_accountsDetail)
    app.delete("/api/v1/collection-form/stripe_connected_accounts/items/:filter", _(_db), verifyJwt, stripe_connected_accounts.deleteItem)
    app.post("/api/v1/collection-form/stripe_connected_accounts/items/constructor/:filter?", _(_db), verifyJwt, stripe_connected_accounts.stripe_connected_accountsStoreData)
    app.get("/api/v1/collection-table/stripe_connected_accounts/finder/:filter/items/count", _(_db), verifyJwt, stripe_connected_accounts.stripe_connected_accountsCount)
    app.get("/api/v1/collection-table/stripe_connected_accounts/finder/:filter/items", _(_db), verifyJwt, stripe_connected_accounts.stripe_connected_accountsList)
}

module.exports = routes
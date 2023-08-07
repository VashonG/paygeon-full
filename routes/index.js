
const assets_and_liabilitiesRoute = require('./assets_and_liabilities.routes')
const borrowersRoute = require('./borrowers.routes')
const commentRoute = require('./comment.routes')
const loan_applicationsRoute = require('./loan_applications.routes')
const news_updateRoute = require('./news_update.routes')
const plaid_settingRoute = require('./plaid_setting.routes')
const redeem_milesRoute = require('./redeem_miles.routes')
const roleRoute = require('./role.routes')
const stripe_connected_accountsRoute = require('./stripe_connected_accounts.routes')
const task_statusRoute = require('./task_status.routes')
const teamRoute = require('./team.routes')
const userRoute = require('./user.routes')

const _ = require('./../middleware/bypassdb.middleware')
const routes = ({ db, app }) => {
    const _db = { db, app }
    assets_and_liabilitiesRoute(_db)
borrowersRoute(_db)
commentRoute(_db)
loan_applicationsRoute(_db)
news_updateRoute(_db)
plaid_settingRoute(_db)
redeem_milesRoute(_db)
roleRoute(_db)
stripe_connected_accountsRoute(_db)
task_statusRoute(_db)
teamRoute(_db)
userRoute(_db)

}
module.exports = routes
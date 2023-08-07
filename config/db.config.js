
const dotenv = require('dotenv')
const env = dotenv.config()
const route = require("./../routes/index")
const MongoClient = require('mongodb').MongoClient
const application = require("../application/app.routes")
const auth = require("./../auth/auth.routes")

module.exports = async (app) => {
    try {
        
        MongoClient.connect(process.env.PROJECT_URL, { useUnifiedTopology: true }, async function (err, client1) {
            if (err) throw err;
            const db = client1.db(process.env.PROJECT_DBNAME);

            route({ db: db, app: app })
            application({ db: db, app: app })
            auth({ db: db, app: app })
        })

    } catch (error) {
        console.log("database not connected", error);
    }
}
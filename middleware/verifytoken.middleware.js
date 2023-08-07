
const passport = require("passport")
const { verifyToken } = require("../utils/index")
const plugins = require("../metadata/plugins/plugins.json");
const { findOneuserItemByQuery } = require("../controller/user")

async function verifyJwt(req, res, next) {
    console.log('Verifying JWT Authentication for secure: >> 1');
    if (req.originalUrl.includes('finder')) return next(); // if filter api
    let origin = req.get('origin');
    if (origin && origin.includes('admin')) return next();

    const loginPlugin = plugins.find(_doc => _doc.code === "LOGIN");
    if (!loginPlugin) {
        return next();
    }
    console.log('I have installed login plugin: >>2');

    if (!req.headers.authorization) {
        return res.status(401).send({
            code: 401,
            message: 'No token provided.'
        });
    }
    console.log(':>> 3');
    passport.authenticate('jwt', {
        session: false
    }, async function (err, user, info) {
        if (err) {
            console.log(':>> 4');
            return next(err);
        }
        if (!user) {
            info.code = 403;
            console.log(': >> 5');
            return res.status(403).send(info);
        }
        console.log(': >>');
        const userFromDb = await findOneuserItemByQuery(req.db, req.projectRemoteDb, {
            userName: user.sub,
        });
        console.log('userFromDb :>> ', userFromDb);
        if (!userFromDb) {
            return res.status(401).send({
                code: 403,
                message: 'Invalid token.'
            });
        }
        req.user = userFromDb; // Forward user information to the next middleware
        next();
    })(req, res, next);
}

async function verifyJwtForOpen(req, res, next) {
    console.log('Verifying JWT Authentication for Open: >> 1');
    const authorizationHeader = req.headers.authorization;
    if (authorizationHeader) {
        const token = req.headers.authorization.split(' ')[1]; // Bearer <token>
        try {
            const payload = await verifyToken(token);
            console.log('verifyJwtForOpen payload::::', payload);
            req.user = payload;

            console.log('verifyJwtForOpen :>> 3');
            passport.authenticate('jwt', {
                session: false
            }, async function (err, user, info) {
                if (err) {
                    console.log('verifyJwtForOpen :>> 4');
                    return next(err);
                }
                if (!user) {
                    info.code = 403;
                    console.log('verifyJwtForOpen : >> 5');
                    return res.status(403).send(info);
                }
                console.log('verifyJwtForOpen : >>');
                const userFromDb = await findOneuserItemByQuery(
                    req.db,
                    req.projectRemoteDb,
                    /*userCollectionName,*/ 
                    {
                        userName: user.sub,
                    },
                );
                console.log('verifyJwtForOpen userFromDb :>> ', userFromDb);
                if (!userFromDb) {
                    return res.status(401).send({
                        code: 403,
                        message: 'Invalid token.'
                    });
                }
                req.user = userFromDb; // Forward user information to the next middleware
                next();
            })(req, res, next);
        } catch (err) {
            console.log('verifyJwtForOpen errrrrrrrrrrrrrrrrrrrrrrrrr', err);
            throw new Error(err);
        }
    } else {
        next();
    }
}

module.exports = {
    verifyJwt,
    verifyJwtForOpen
}
/* eslint-disable no-undef */
const passport = require('passport');
const { issueJWTToken } = require('./../utils/index');
const { saveUserWithProvider } = require('./../controller/user');

const login = async (req, res, next) => {
  try {
    const { params } = req;
    const { provider } = params;
    let authType = '';
    if (provider) {
      authType = 'auth-provider';
    } else {
      authType = 'login';
    }

    passport.authenticate(authType, { session: false }, (err, user, info) => {
      if (err) {
        console.log('err loginWithProvider :>> ', err);
        return res.status(err.status).json({ message: err.message });
      }
      if (info !== undefined) {
        return res.status(info.status || 500).json({ message: info.message });
      }
      if (user) {
        req.login(user, { session: false }, async (err) => {
          if (err) {
            return res.status(500).json(err);
          }
          let finalData = {};
          let userDetails = null;
          let role = user.role;
          if (provider) {
            userDetails = user.user;
          } else {
            userDetails = user;
          }
          delete userDetails._id;
          delete userDetails.createdAt;
          delete userDetails.updatedAt;
          delete userDetails.password;
          if (provider) {
            if (provider === PROVIDER_TYPE.FIREBASE) {
              finalData = {
                auth: true,
                token: user.refreshToken,
                expiresIn: user.expiresIn,
                userDetails,
                role,
              };
            } else if (provider === PROVIDER_TYPE.XANO) {
              finalData = {
                auth: true,
                token: user.token,
                expiresIn: 3600,
                userDetails,
                role,
              };
            } else if (provider === PROVIDER_TYPE.BACKENDLESS) {
              finalData = {
                auth: true,
                token: user.token,
                expiresIn: 3600,
                userDetails,
                role,
              };
            }
          } else {
            delete user.role;
            const tokenObject = await issueJWTToken(userDetails);
            finalData = {
              auth: true,
              token: tokenObject.token,
              expiresIn: tokenObject.expires,
              userDetails,
              role,
            };
          }
          return res.status(200).json(finalData);
        });
      }
    })(req, res, next);
  } catch (e) {
    console.log(e);
  }
};

const addUserWithProvider = async (req, res, next) => {
  try {
    const { db, body, projectId, params } = req;
    const { provider } = params;
    const response = await saveUserWithProvider(db, projectId, body, provider);
    return res.status(response.code).send(response.data);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  login,
  addUserWithProvider,
};

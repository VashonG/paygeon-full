/* eslint-disable no-undef */
const axios = require('axios');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const plugins = require('../metadata/plugins/plugins.json');
const { compareBcryptPassword } = require('./../utils/index');
const { findOneuserItemByQuery, findOneroleItemByQuery } = require('./../controller/user');

/**
 * We only need auth folder related code when someone has installed login plugin
 * We can get all plugins from project_config and then check if it contains a plugin
 * with code LOGIN then we will copy auth folder
 */
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'addjsonwebtokensecretherelikeQuiscustodietipsoscustodes',
  algorithms: ['HS256'],
  passReqToCallback: true,
};

const jwtOptionsCallback = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'addjsonwebtokensecretherelikeQuiscustodietipsoscustodes',
  algorithms: ['HS256'],
  // passReqToCallback: true,
};

const localOptions = {
  usernameField: 'userName',
  passwordField: 'password',
  passReqToCallback: true,
};

const fetchUserLoginWithToken = async (req) => {
  const header = {
    headers: {
      'Content-Type': 'application/json',
      authorization: 'Bearer ' + req.body.token,
    },
  };
  const url = getBackendServerUrl() + 'api/v1/auth/login-with-token';
  return axios.post(url, {}, header);
};
const getBackendServerUrl = () => {
  return 'http://localhost:3333/';
};

function initialize(passport) {
  const authenticateJWTLogin = async (req, jwt_payload, done) => {
    try {
      const result = await fetchUserLoginWithToken(req);
      return done(null, result.data);
    } catch (error) {
      const { response } = error;
      if (response) {
        const { status, data } = response;
        if (status === 404) {
          return done(null, false, { message: 'Invalid token.', status: 404 });
        } else if (status === 401) {
          return done(null, false, {
            message: data && data.message ? data.message : 'Invalid token.',
            status: 401,
          });
        } else if (status === 500) {
          return done(error);
        }
      } else {
        return done(error);
      }
    }
  };
  const authenticateUser = async (req, userName, password, done) => {
    const { db, projectRemoteDb, body } = req;
    const { provider } = body;

    //TODO: Need to change in future
    if (provider && provider === 'Github') {
      let response = await githubAuth(body);
      if (response) {
        userName = response.login;
        req.body = response;
      }
    }
    const query = { $or: [{ email: userName }, { userName }] };

    let user = await findOneuserItemByQuery(db, projectRemoteDb, query);

    try {
      /**
       * We will refactor this in future
       */
      if (['Facebook', 'Google', 'Github', 'Twitter', 'Linkedin'].includes(provider)) {
        let response = null;
        if (!user) {
          response = await saveUser(db, projectRemoteDb, body);
        } else {
          response = await updateUserWithSocialProfile(db, body, user.uuid);
        }
        user = response.data;
        return done(null, user);
      }

      if (!user) {
        return done(null, false, {
          message: 'This user does not exists.',
          status: 404,
        });
      }
      const loginPlugin = plugins.find((_doc) => _doc.code === 'LOGIN');
      if (loginPlugin && loginPlugin.setting) {
        const { is_email_verified, is_enabled } = loginPlugin.setting;
        if (is_email_verified && !user.is_email_verified) {
          return done(null, false, {
            message: 'Please verify email first.',
            status: 401,
          });
        }
        if (is_enabled && !user.is_enabled) {
          return done(null, false, {
            message: 'Account is not active.',
            status: 401,
          });
        }
      }

      const validPassword = await compareBcryptPassword(password, user.password);
      if (!validPassword) {
        return done(null, false, {
          message: 'Username or password does not match. Please try again',
          status: 401,
        });
      }

      let role = '';
      if (user.userRoles && user.userRoles.length > 0) {
        role = await findOneroleItemByQuery(db, projectRemoteDb, {
          name: user.userRoles[0],
        });
        // role = await findOneuserItemByQuery(db, projectRemoteDb, { name: user.userRoles[0] })
      }
      return done(null, { ...user, role: role.uuid });
    } catch (error) {
      console.log('error passport :>> ', error);
      done(error);
    }
  };

  const loginStrategy = new LocalStrategy(localOptions, authenticateUser);
  const jwtStrategy = new JwtStrategy(jwtOptions, authenticateJWTLogin);

  passport.use('jwt-login', jwtStrategy);
  passport.use('login', loginStrategy);
  passport.use(
    'jwt',
    new JwtStrategy(jwtOptionsCallback, async (jwt_payload, done) => {
      try {
        return done(null, jwt_payload);
      } catch (error) {
        done(error);
      }
    }),
  );
  passport.serializeUser((user, done) => done(null, user.userDetails));
  passport.deserializeUser(async (req, obj, done) => {
    return done(null, obj);
  });
}

module.exports = initialize;

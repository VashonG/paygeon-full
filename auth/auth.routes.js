const { login, addUserWithProvider } = require('./auth.controller');
const _ = require('./../middleware/bypassdb.middleware');

const Auths = ({ db, app }) => {
  const _db = { db, app };
  app.post('/login/:provider?', _(_db), login);
  app.post('/api/v1/auth/user/:provider?', _(_db), addUserWithProvider);
};

module.exports = Auths;

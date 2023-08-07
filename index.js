
  const express = require('express');
  const cors = require("cors");
  const logger = require('morgan');
  const path = require('path');
  const db = require('./config/db.config');
  const passport = require('passport');
  const session = require('express-session');
  
  require('./auth/passport.config')(passport);
  const app = express()
  const port = 3333
  
  app.use('/resources', express.static(path.join(__dirname, 'views/resources')));
  app.use('/static/747fy36r61t3002j531x9ki1zj15', express.static("views"));
  app.set('views', "views");
  app.set('view engine', 'hbs');
  
  app.use(express.json())
  app.use(express.urlencoded({ extended: false }))
  
  app.use(
    session({
      secret: 'somerandonstuffs',
      // store: new RedisStore({ client: redisClient }),
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 24 * 60 * 60 * 1000 }, // expiration time: 1 day
    }),
  );
  
  app.use(passport.initialize());
  app.use(passport.session());
  
  app.use(cors())
  app.use(logger(':remote-addr - :remote-user :method :url [:date[clf]] :status :res[content-length] - :response-time ms'))
  
  db(app)
  
  app.listen(port, () => {
      console.log('we are live on '+port)
  })
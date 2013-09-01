module.exports = function(app, models) {
  app.post('/userlogin', function(req, res) {
    var email = req.param('email', null);
    var password = req.param('password', null);
  
    if ( null == email || email.length < 1
        || null == password || password.length < 1 ) {
      res.send(400);
      return;
    }
  
    models.UserAccount.userlogin(email, password, function(useraccount) {
      if ( !useraccount ) {
        res.send(401);
        return;
      }
      req.session.loggedIn = true;
      req.session.userAccountId = useraccount._id;
      res.send(useraccount._id);
    });
  });
  
  app.post('/userregister', function(req, res) {
    var firstName = req.param('firstName', '');
    var lastName = req.param('lastName', '');
    var email = req.param('email', null);
    var password = req.param('password', null);
  
    if ( null == email || email.length < 1
         || null == password || password.length < 1 ) {
      res.send(400);
      return;
    }
  
    models.UserAccount.userregister(email, password, firstName, lastName);
    res.send(200);
  });
  
  app.get('/useraccount/authenticated', function(req, res) {
    if ( req.session && req.session.loggedIn ) {
      res.send(req.session.userAccountId);
    } else {
      res.send(401);
    }
  });
  
  app.post('/userforgotpassword', function(req, res) {
    var hostname = req.headers.host;
    var resetPasswordUrl = 'http://' + hostname + '/resetPassword';
    var email = req.param('email', null);
    if ( null == email || email.length < 1 ) {
      res.send(400);
      return;
    }
  
    models.UserAccount.userforgotPassword(email, resetPasswordUrl, function(success){
      if (success) {
        res.send(200);
      } else {
        // Username or password not found
        res.send(404);
      }
    });
  });

  app.get('/resetPassword', function(req, res) {
    var userAccountId = req.param('useraccount', null);
    res.render('resetPassword.jade', {locals:{userAccountId:userAccountId}});
  });
  
  app.post('/resetPassword', function(req, res) {
    var userAccountId = req.param('userAccountId', null);
    var password = req.param('password', null);
    if ( null != userAccountId && null != password ) {
      models.UserAccount.changePassword(userAccountId, password);
    }
    res.render('resetPasswordSuccess.jade');
  });
}
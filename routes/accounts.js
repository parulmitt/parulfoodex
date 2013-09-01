module.exports = function(app, models) {
  app.get('/useraccounts/:id/usercontacts', function(req, res) {
    var userAccountId = req.params.id == 'me'
                       ? req.session.userAccountId
                       : req.params.id;
    models.UserAccount.findById(userAccountId, function(useraccount) {
      res.send(useraccount.usercontacts);
    });
  });
  
  app.get('/useraccounts/:id/activity', function(req, res) {
    var userAccountId = req.params.id == 'me'
                       ? req.session.userAccountId
                       : req.params.id;
    models.UserAccount.findById(userAccountId, function(useraccount) {
      res.send(useraccount.activity);
    });
  });
  
  app.get('/useraccounts/:id/userstatus', function(req, res) {
    var userAccountId = req.params.id == 'me'
                       ? req.session.userAccountId
                       : req.params.id;
    models.UserAccount.findById(userAccountId, function(useraccount) {
      res.send(useraccount.userstatus);
    });
  }); 
  
  app.post('/useraccounts/:id/userstatus', function(req, res) {
    var userAccountId = req.params.id == 'me'
                       ? req.session.userAccountId
                       : req.params.id;
    models.UserAccount.findById(userAccountId, function(useraccount) {
      userstatus = {
        name: useraccount.name,
        userstatus: req.param('userstatus', '')
      };
      useraccount.userstatus.push(userstatus);  
  
      useraccount.activity.push(userstatus);
      useraccount.save(function (err) {
        if (err) {
          console.log('Error saving account: ' + err);
        } else {
          app.triggerEvent('event:' + userAccountId, {
            from: userAccountId,
            data: userstatus,
            action: 'userstatus'
          });
        }
      });
    });
    res.send(200);
  });  
 
  app.delete('/useraccounts/:id/usercontact', function(req,res) {
    var userAccountId = req.params.id == 'me'
                       ? req.session.userAccountId
                       : req.params.id;
    var userContactId = req.param('userContactId', null);     
  
    if ( null == userContactId ) {
      res.send(400);
      return;
    }  
 
    models.UserAccount.findById(userAccountId, function(useraccount) {
      if ( !useraccount ) return;
      models.UserAccount.findById(userContactId, function(usercontact,err) {
        if ( !usercontact ) return;  
 
        models.UserAccount.removeUserContact(useraccount, userContactId);
        models.UserAccount.removeUserContact(usercontact, userAccountId);
      });
    });
 
       res.send(200);
  });
 
  app.post('/useraccounts/:id/usercontact', function(req,res) {
    var userAccountId = req.params.id == 'me'
                       ? req.session.userAccountId
                       : req.params.id;
    var userContactId = req.param('userContactId', null);
  
    if ( null == userContactId ) {
      res.send(400);
      return;
    }
  
    models.UserAccount.findById(userAccountId, function(useraccount) {
      if ( useraccount ) {
        models.UserAccount.findById(userContactId, function(usercontact) {
          models.UserAccount.addUserContact(useraccount, usercontact);
  
          models.UserAccount.addUserContact(usercontact, useraccount);
          useraccount.save();
        });
      }
    });
  

    res.send(200);
  });
  
  app.get('/useraccounts/:id', function(req, res) {
    var userAccountId = req.params.id == 'me'
                       ? req.session.userAccountId
                       : req.params.id;
    models.UserAccount.findById(userAccountId, function(useraccount) {
      if ( userAccountId == 'me' || models.UserAccount.hasContact(useraccount, req.session.userAccountId) ) {
        useraccount.isFriend = true;
      }
      res.send(useraccount);
    });
  });
}
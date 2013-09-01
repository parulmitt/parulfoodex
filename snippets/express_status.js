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
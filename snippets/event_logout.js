socket.on('disconnect', function() {
  sAccount.usercontacts.forEach(function(usercontact) {
    var eventName = 'event:' + usercontact.userAccountId;
    app.removeEventListener(eventName, handleUserContactEvent);
    console.log('Unsubscribing from ' + eventName);
  });
});
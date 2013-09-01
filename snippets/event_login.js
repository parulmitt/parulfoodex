var handleUserContactEvent = function(eventMessage) {
  socket.emit(eventName, eventMessage);
}

var subscribeToUserAccount = function(userAccountId) {
  var eventName = 'event:' + userAccountId;
  app.addEventListener(eventName, handleUserContactEvent);
  console.log('Subscribing to ' + eventName);
};

models.UserAccount.findById(userAccountId, function subscribeToFriendFeeds(useraccount) {
  var subscribedUserAccounts = {};
  sAccount = useraccount;
  useraccount.usercontacts.forEach(function(usercontact) {
    if ( !subscribedUserAccounts[usercontact.userAccountId]) {
      subscribeToUserAccount(usercontact.userAccountId);
      subscribedUserAccounts[usercontact.userAccountId] = true;
    }
  });

  if (!subscribedUserAccounts[userAccountId]) {
    // Subscribe to my own updates
    subscribeToUserAccount(userAccountId);
  }
});

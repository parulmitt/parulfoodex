module.exports = function(app, models) {
  var io = require('socket.io');
  var utils = require('connect').utils;
  var cookie = require('cookie');
  var Session = require('connect').middleware.session.Session;

  var sio = io.listen(app.server)

  sio.configure(function() {
    app.isAccountOnline = function(userAccountId) {
      var clients = sio.sockets.clients(userAccountId);
      return (clients.length > 0);
    };

    sio.set('authorization', function( data, accept) {
      var signedCookies = cookie.parse(data.headers.cookie);
      var cookies = utils.parseSignedCookies(signedCookies,app.sessionSecret);
      data.sessionID = cookies['express.sid'];
      data.sessionStore = app.sessionStore;
      data.sessionStore.get(data.sessionID, function(err, session) {
        if ( err || !session ) {
          return accept('Invalid session', false);
        } else {
          data.session = new Session(data, session);
          accept(null, true);
        }
      });
    });

    sio.sockets.on('connection', function(socket) {
      var session = socket.handshake.session;
      var userAccountId = session.userAccountId;
      var sAccount = null;
      socket.join(userAccountId);

      app.triggerEvent('event:' + userAccountId, {
        from: userAccountId,
        action: 'login'
      });

      var handleContactEvent = function(eventMessage) {
        socket.emit('contactEvent', eventMessage);
      };

      var subscribeToAccount = function(userAccountId) {
        var eventName = 'event:' + userAccountId;
        app.addEventListener(eventName, handleContactEvent);
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
          subscribeToUserAccount(userAccountId);
        }
      });

      socket.on('disconnect', function() {
        sAccount.usercontacts.forEach(function(usercontact) {
          var eventName = 'event:' + usercontact.userAccountId;
          app.removeEventListener(eventName, handleContactEvent);
          console.log('Unsubscribing from ' + eventName);
        });
        app.triggerEvent('event:' + userAccountId, {
          from: userAccountId,
          action: 'logout'
        });
      });

      socket.on('chatclient', function(data) {
        sio.sockets.in(data.to).emit('chatserver', {
          from: userAccountId,
          text: data.text
        });
      });
    });
  });
}
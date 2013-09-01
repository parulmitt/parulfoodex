define(['Sockets', 'models/UserContactCollection', 'views/userchat'],
function(sio, UserContactCollection, UserChatView) {
  var ParulFoodexSockets = function(eDispatcher) {
    var userAccountId = null;

    var socket = null;

    var connectSocket = function(socketUserAccountId) {
      userAccountId = socketUserAccountId;
      socket = io.connect();

      socket
        .on('connect_failed', function(reason) {
          console.error('unable to connect', reason);
        })
        .on('connect', function() {
          eDispatcher.bind('socket:userchat', sendUserChat);
          socket.on('userchatserver', function(data) {
            eDispatcher.trigger('socket:userchat:start:' + data.from );
            eDispatcher.trigger('socket:userchat:in:' + data.from, data);
          });

          socket.on('userContactEvent', handleUserContactEvent);

          var userContactsCollection = new UserContactCollection();
          UsercontactsCollection.url = '/useraccounts/me/usercontacts';
          new UserChatView({collection: userContactsCollection,
                        socketEvents: eDispatcher}).render();
          userContactsCollection.fetch();
        });
    };

    var handleUserContactEvent = function(eventObj) {
      var eventName = eventObj.action + ':' + eventObj.from;
      eDispatcher.trigger(eventName, eventObj);

      if ( eventObj.from == userAccountId ) {
        eventName = eventObj.action + ':me';
        eDispatcher.trigger(eventName, eventObj);
      }
    };

    var sendUserChat = function(payload) {
      if ( null != socket ) {
        socket.emit('userchatclient', payload);
      }
    };

    eDispatcher.bind('app:loggedin', connectSocket);
  }

  return {
    initialize: function(eDispatcher) {
      ParulFoodexSockets(eDispatcher);
    }
  };
});

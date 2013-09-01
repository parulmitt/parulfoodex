socket.on('disconnect', function() {
  app.triggerEvent('event:' + userAccountId, {
    from: useraccountId,
    action: 'logout'
  });
});
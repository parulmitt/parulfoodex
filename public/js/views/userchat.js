define(['ParulFoodexView', 'views/userchatsession', 'views/userchatitem', 'text!templates/userchat.html'],
function(ParulFoodexView, UserChatSessionView, UserChatItemView, userchatItemTemplate) {
  var userchatView = ParulFoodexView.extend({
    el: $('#userchat'),

    userChatSessions: {},

    initialize: function(options) {
      this.socketEvents = options.socketEvents;
      this.collection.on('reset', this.renderCollection, this);
    },

    render: function() {
      this.$el.html(userChatItemTemplate);
    },

    startUserChatSession: function(model) {
      var userAccountId = model.get('userAccountId');
      if ( !this.userChatSessions[userAccountId]) {
        var userChatSessionView = new UserChatSessionView({model:model, socketEvents: this.socketEvents});
        this.$el.prepend(userChatSessionView.render().el);
        this.userChatSessions[userAccountId] = userChatSessionView;
      }
    },

    renderCollection: function(collection) {
      var that = this;
      $('.userchat_list').empty();
      collection.each(function(usercontact) {
        var userChatItemView = new ChatItemView({ socketEvents: that.socketEvents, model: usercontact });
        userChatItemView.bind('userchat:start', that.startUserChatSession, that);
        var userstatusHtml = (userChatItemView).render().el;
        $(userstatusHtml).appendTo('.userchat_list');
      });
    }
  });

  return userchatView;
});

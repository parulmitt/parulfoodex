define(['ParulFoodexView', 'text!templates/userchatsession.html'],
function(ParulFoodexView, userChatItemTemplate) {
  var userChatItemView = ParulFoodexView.extend({
    tagName: 'div',

    className: 'userchat_session',

    $el: $(this.el),

    events: {
      'submit form': 'sendUserChat'
    },

    initialize: function(options) {
      this.socketEvents = options.socketEvents;
      var userAccountId = this.model.get('userAccountId');
      this.socketEvents.on('socket:userchat:in:' + userAccountId, this.receiveChat, this);
      this.socketEvents.bind(
        'login:' + userAccountId,
        this.handleUserContactLogin,
        this
      );
      this.socketEvents.bind(
        'logout:' + userAccountId,
        this.handleUserContactLogout,
        this
      );
    },

    handleUserContactLogin: function() {
      this.$el.find('.online_indicator').addClass('online');
      this.model.set('online', true);
    },

    handleUserContactLogout: function() {
      this.model.set('online', false);
      $onlineIndicator = this.$el.find('.online_indicator');
      while ( $onlineIndicator.hasClass('online') ) {
        $onlineIndicator.removeClass('online');
      }
    },

    receiveUserChat: function(data) {
      var userChatLine = this.model.get('name').first + ': ' + data.text;
      this.$el.find('.userchat_log').append($('<li>' + userChatLine + '</li>'));
    },

    sendUserChat: function() {
      var userChatText = this.$el.find('input[name=userchat]').val();
      if ( userChatText && /[^\s]+/.test(userChatText) ) {
        var userChatLine = 'Me: ' + userChatText;
        this.$el.find('.userchat_log').append($('<li>' + userChatLine + '</li>'));
        this.socketEvents.trigger('socket:userchat', {
          to: this.model.get('userAccountId'),
          text: userChatText
        });
      }
      return false;
    },

    render: function() {
      this.$el.html(_.template(userChatItemTemplate, {
        model: this.model.toJSON()
      }));
      if ( this.model.get('online') ) this.handleUserContactLogin();
      return this;
    }
  });

  return userChatItemView;
});
define(['ParulFoodexView', 'text!templates/userchatitem.html'],
function(ParulFoodexView, userchatItemTemplate) {
  var userchatItemView = ParulFoodexView.extend({
    tagName: 'li',

    $el: $(this.el),

    events: {
      'click': 'startUserChatSession',
    },

    initialize: function(options) {
      var userAccountId = this.model.get('userAccountId');
      options.socketEvents.bind(
        'login:' + userAccountId,
        this.handleUserContactLogin,
        this
      );
      options.socketEvents.bind(
        'logout:' + userAccountId,
        this.handleUserContactLogout,
        this
      );
      options.socketEvents.bind(
        'socket:userchat:start:' + userAccountId,
        this.startUserChatSession,
        this
      );
    },

    handleUserContactLogin: function() {
      this.model.set('online', true);
      this.$el.find('.online_indicator').addClass('online');
    },

    handleUserContactLogout: function() {
      this.model.set('online', false);
      $onlineIndicator = this.$el.find('.online_indicator');
      while ( $onlineIndicator.hasClass('online') ) {
        $onlineIndicator.removeClass('online');
      }
    },

    startUserChatSession: function() {
      this.trigger('userchat:start', this.model);
    },

    render: function() {
      this.$el.html(_.template(userchatItemTemplate, {
        model: this.model.toJSON()
      }));
      if ( this.model.get('online') ) this.handleUserContactLogin();
      return this;
    }
  });

  return userChatItemView;
});
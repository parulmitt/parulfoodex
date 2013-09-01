define(['ParulFoodexView', 'text!templates/userprofile.html',
        'text!templates/userstatus.html', 'models/UserStatus',
        'views/userstatus'],
function(ParulFoodexView,  userprofileTemplate,
         userstatusTemplate, UserStatus, UserStatusView)
{
  var userprofileView = ParulFoodexView.extend({
    el: $('#content'),

    events: {
      "submit form": "postStatus"
    },

    initialize: function (options) {
      this.socketEvents = options.socketEvents;
      this.model.bind('change', this.render, this);
    },

    postStatus: function() {
      var that = this;
      var userStatusText = $('input[name=userstatus]').val();
      var userStatusCollection = this.collection;
      $.post('/useraccounts/' + this.model.get('_id') + '/userstatus', {
        userstatus: userStatusText
      });
      return false;
    },

    onSocketUserStatusAdded: function(data) {
      var newUserStatus = data.data;
      this.prependUserStatus(new UserStatus({userstatus:newUserStatus.userstatus,name:newUserStatus.name}))
    },

    prependUserStatus: function(userstatusModel) {
      var userstatusHtml = (new UserStatusView({ model: userstatusModel })).render().el;
      $(userstatusHtml).prependTo('.userstatus_list').hide().fadeIn('slow');
    },

    render: function() {
      if ( this.model.get('_id')) {
        this.socketEvents.bind('userstatus:' + this.model.get('_id'), this.onSocketUserStatusAdded, this );
      }
      var that = this;
      this.$el.html(
        _.template(userprofileTemplate,this.model.toJSON())
      );

      var userstatusCollection = this.model.get('userstatus');
      if ( null != userstatusCollection ) {
        _.each(userstatusCollection, function (userstatusJson) {
          var userstatusModel = new UserStatus(userstatusJson);
          that.prependUserStatus(userstatusModel);
        });
      }
    }
  });

  return userprofileView;
});

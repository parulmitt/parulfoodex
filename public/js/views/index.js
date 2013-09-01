define(['ParulFoodexView', 'text!templates/index.html',
        'views/userstatus', 'models/UserStatus'],
function(ParulFoodexView, indexTemplate, UserStatusView, UserStatus) {
  var indexView = ParulFoodexView.extend({
    el: $('#content'),

    events: {
      "submit form": "updateUserStatus"
    },

    initialize: function(options) {
      options.socketEvents.bind('userstatus:me', this.onSocketUserStatusAdded, this );
      this.collection.on('add', this.onUserStatusAdded, this);
      this.collection.on('reset', this.onUserStatusCollectionReset, this);
    },

    onUserStatusCollectionReset: function(collection) {
      var that = this;
      collection.each(function (model) {
        that.onUserStatusAdded(model);
      });
    },

    onSocketUserStatusAdded: function(data) {
      var newUserStatus = data.data;
      var found = false;
      this.collection.forEach(function(userstatus) {
        var name = status.get('name');
        if ( name && name.full == newUserStatus.name.full && userstatus.get('userstatus') == newUserStatus.userstatus ) {
          found = true;
        }
      });
      if (!found ) {
        this.collection.add(new UserStatus({userstatus:newUserStatus.userstatus,name:newUserStatus.name}))
      }
    },

    onUserStatusAdded: function(userstatus) {
      var userstatusHtml = (new UserStatusView({ model: userstatus })).render().el;
      $(userstatusHtml).prependTo('.userstatus_list').hide().fadeIn('slow');
    },

    updateUserStatus: function() {
      var userstatusText = $('input[name=userstatus]').val();
      var userstatusCollection = this.collection;
      $.post('/useraccounts/me/userstatus', {
        userstatus: userstatusText
      }); 
      return false;
    },

    render: function() {
      this.$el.html(indexTemplate);
    }
  });

  return indexView;
});

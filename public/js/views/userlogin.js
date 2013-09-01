define(['ParulFoodexView', 'text!templates/userlogin.html'], function(ParulFoodexView, userloginTemplate) {
  var userloginView = ParulFoodexView.extend({
    requireUserLogin: false,

    el: $('#content'),

    events: {
      "submit form": "userlogin"
    },

    initialize: function(options) {
      this.socketEvents = options.socketEvents;
    },

    userlogin: function() {
      var socketEvents = this.socketEvents;
      $.post('/userlogin',
        this.$('form').serialize(), function(data) {
          socketEvents.trigger('app:loggedin', data);
          window.location.hash = 'index';
      }).error(function(){
        $("#error").text('Error: Unable to login!');
        $("#error").slideDown();
      });
      return false;
    },

    render: function() {
      this.$el.html(userloginTemplate);
      $("#error").hide();
      $("input[name=email]").focus();
    }
  });

  return userloginView;
});

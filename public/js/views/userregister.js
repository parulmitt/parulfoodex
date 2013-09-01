define(['ParulFoodexView', 'text!templates/userregister.html'], function(ParulFoodexView, userregisterTemplate) {
  var userregisterView = ParulFoodexView.extend({
    requireUserLogin: false,

	el: $('#content'),

    events: {
      "submit form": "userregister"
    },

    userregister: function() {
      $.post('/userregister', {
        firstName: $('input[name=firstName]').val(),
        lastName: $('input[name=lastName]').val(),
        email: $('input[name=email]').val(),
        password: $('input[name=password]').val(),
      }, function(data) {
        console.log(data);
      });
      return false;
    },

    render: function() {
      this.$el.html(userregisterTemplate);
    }
  });

  return userregisterView;
});

define(['ParulFoodexView', 'text!templates/userforgotpassword.html'], function(ParulFoodexView, userforgotpasswordTemplate) {
  var userforgotpasswordView = ParulFoodexView.extend({
    requireUserLogin: false,

    el: $('#content'),

    events: {
      "submit form": "userpassword"
    },

    userpassword: function() {
      $.post('/userforgotpassword', {
        email: $('input[name=email]').val()
      }, function(data) {
        console.log(data);
      });
      return false;
    },

    render: function() {
      this.$el.html(userforgotpasswordTemplate);
    }
  });

  return userforgotpasswordView;
});

define(['ParulFoodexView', 'text!templates/userstatus.html'], function(ParulFoodexView, userstatusTemplate) {
  var userstatusView = ParulFoodexView.extend({
    tagName: 'li',

    render: function() {
      $(this.el).html(_.template(userstatusTemplate,this.model.toJSON()));
      return this;
    }
  });

  return userstatusView;
});

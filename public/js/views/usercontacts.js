define(['ParulFoodexView', 'views/usercontact', 'text!templates/usercontacts.html'],
function(ParulFoodexView, UserContactView, usercontactsTemplate) {
  var usercontactsView = ParulFoodexView.extend({
    el: $('#content'),

    initialize: function() {
      this.collection.on('reset', this.renderCollection, this);
    },

    render: function() {
      this.$el.html(usercontactsTemplate);
    },

    renderCollection: function(collection) {
      $('.usercontacts_list').empty();
      collection.each(function(usercontact) {
        var userstatusHtml = (new UserContactView({ removeButton: true, model: usercontact })).render().el;
        $(userstatusHtml).appendTo('.usercontacts_list');
      });
    }
  });

  return usercontactsView;
});

define(['ParulFoodexView', 'models/UserContact', 'views/usercontact', 'text!templates/addusercontact.html'],
function(ParulFoodexView, UserContact, UserContactView, addusercontactTemplate)
{
  var addusercontactView = ParulFoodexView.extend({
    el: $('#content'),

    events: {
      "submit form": "search"
    },

    search: function() {
      var view = this;
      $.post('/usercontacts/find',
        this.$('form').serialize(), function(data) {
        view.render(data);
      }).error(function(){
        $("#results").text('Error! No user contacts found.');
        $("#results").slideDown();
      });
      return false;
    },

    render: function(resultList) {
      var view = this;
      this.$el.html(_.template(addusercontactTemplate));
      if ( null != resultList ) {
        _.each(resultList, function (usercontactJson) {
          var usercontactModel = new UserContact(usercontactJson);
          var usercontactHtml = (new UserContactView({ addButton: true, model: usercontactModel })).render().el;
          $('#results').append(usercontactHtml);
        });
      }
    }
  });

  return addusercontactView;
});

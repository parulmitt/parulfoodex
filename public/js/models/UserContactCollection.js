define(['models/UserContact'], function(UserContact) {
  var UserContactCollection = Backbone.Collection.extend({
    model: UserContact
  });

  return UserContactCollection;
});
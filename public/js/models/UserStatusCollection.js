define(['models/UserStatus'], function(UserStatus) {
  var UserStatusCollection = Backbone.Collection.extend({
    model: UserStatus
  });

  return UserStatusCollection;
});

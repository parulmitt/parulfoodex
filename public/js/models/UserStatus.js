define(function(require) {
  var UserStatus = Backbone.Model.extend({
    urlRoot: '/useraccounts/' + this.userAccountId + '/userstatus'
  });

  return UserStatus;
});

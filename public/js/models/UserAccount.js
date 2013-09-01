define(['models/UserStatusCollection'], function(UserStatusCollection) {
  var UserAccount = Backbone.Model.extend({
    urlRoot: '/useraccounts',

    initialize: function() {
      this.userstatus       = new UserStatusCollection();
      this.userstatus.url   = '/useraccounts/' + this.id + '/userstatus';
      this.activity     = new StatusCollection();
      this.activity.url = '/useraccounts/' + this.id + '/activity';
    }
  });

  return UserAccount;
});

define(['views/index', 'views/userregister', 'views/userlogin',
        'views/userforgotpassword', 'views/userprofile', 'views/usercontacts',
        'views/useraddcontact', 'models/UserAccount', 'models/UserStatusCollection',
        'models/UserContactCollection'],
function(IndexView, UserRegisterView, UserLoginView, UserForgotPasswordView, UserProfileView,
         UserContactsView, AddUserContactView, UserAccount, UserStatusCollection,
         UserContactCollection) {
  var FoodexRouter = Backbone.Router.extend({
    currentView: null,

    socketEvents: _.extend({}, Backbone.Events),

    routes: {
      'addusercontact': 'addusercontact',
      'index': 'index',
      'userlogin': 'userlogin',
      'userregister': 'userregister',
      'userforgotpassword': 'userforgotpassword',
      'userprofile/:id': 'userprofile',
      'usercontacts/:id': 'usercontacts'
    },

    changeView: function(view) {
      if ( null != this.currentView ) {
        this.currentView.undelegateEvents();
      }
      this.currentView = view;
      this.currentView.render();
    },

    index: function() {
      var userstatusCollection = new UserStatusCollection();
      userstatusCollection.url = '/useraccounts/me/activity';
      this.changeView(new IndexView({
        collection: userstatusCollection,
        socketEvents:this.socketEvents
      }));
      userstatusCollection.fetch();
    },

    addusercontact: function() {
      this.changeView(new AddUserContactView());
    },

    userlogin: function() {
      this.changeView(new UserLoginView({socketEvents:this.socketEvents}));
    },

    userforgotpassword: function() {
      this.changeView(new UserForgotPasswordView());
    },

    userregister: function() {
      this.changeView(new UserRegisterView());
    },

    userprofile: function(id) {
      var model = new UserAccount({id:id});
      this.changeView(new UserProfileView({model:model, socketEvents:this.socketEvents}));
      model.fetch();
    },

    usercontacts: function(id) {
      var userContactId = id ? id : 'me';
      var userContactsCollection = new UserContactCollection();
      userContactsCollection.url = '/useraccounts/' + userContactId + '/usercontacts';
      this.changeView(new UserContactsView({
        collection: userContactsCollection
      }));
      userContactsCollection.fetch();
    }
  });

  return new FoodexRouter();
});


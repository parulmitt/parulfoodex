define(['ParulFoodexView', 'text!templates/usercontact.html'], function(ParulFoodexView, usercontactTemplate) {
  var usercontactView = ParulFoodexView.extend({
    addButton: false,

    removeButton: false,

    tagName: 'li',

    events: {
      "click .addbutton": "addUserContact",
      "click .removebutton": "removeUserContact"
    },

    addUserContact: function() {
      var $responseArea = this.$('.actionArea');
      $.post('/useraccounts/me/usercontact',
        {userContactId: this.model.get('_id')},
        function onSuccess() {
          $responseArea.text('Success: contact added!');
        }, function onError() {
          $responseArea.text('Error: could not add contact!');
        }
      );
    },

    removeContact: function() {
      var $responseArea = this.$('.actionarea');
      $responseArea.text('Removing contact........');
      $.ajax({
        url: '/useraccounts/me/usercontact',
        type: 'DELETE',
        data: {
          userContactId: this.model.get('userAccountId')
        }}).done(function onSuccess() {
          $responseArea.text('Success: contact removed!');
        }).fail(function onError() {
          $responseArea.text('Error: could not remove contact!');
        });
    },

    initialize: function() {
      if ( this.options.addButton ) {
        this.addButton = this.options.addButton;
      }

      if ( this.options.removeButton ) {
        this.removeButton = this.options.removeButton;
      }
    },

    render: function() {
      $(this.el).html(_.template(usercontactTemplate, {
        model: this.model.toJSON(),
        addButton: this.addButton,
        removeButton: this.removeButton
      }));
      return this;
    }
  });

  return usercontactView;
});

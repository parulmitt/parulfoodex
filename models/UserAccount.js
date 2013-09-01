module.exports = function(app, config, mongoose, nodemailer) {
  var crypto = require('crypto');

  var Status = new mongoose.Schema({
    name: {
      fname:   { type: String },
      lname:    { type: String }
    },
    status:    { type: String }
  });

  var schemaOptions = {
    toJSON: {
      virtuals: true	
    },
    toObject: {
      virtuals: true
    }
  };

  var Contact = new mongoose.Schema({
    name: {
      fname:   { type: String },
      lname:    { type: String }
    },
    userAccountId: { type: mongoose.Schema.ObjectId },
    added:     { type: Date },     // When the contact was added
    updated:   { type: Date }      // When the contact last updated
  }, schemaOptions);

  Contact.virtual('online').get(function(){
    return app.isAccountOnline(this.get('userAccountId'));
  });

  var UserAccountSchema = new mongoose.Schema({
    email:     { type: String, unique: true },
    password:  { type: String },
    name: {
      fname:       { type: String },
      lname:       { type: String },
      fullname:    { type: String }
    },
    birthday: {
      day:     { type: Number, min: 1, max: 31, required: false },
      month:   { type: Number, min: 1, max: 12, required: false },
      year:    { type: Number }
    },
    photoUrl:  { type: String },
    biography: { type: String },
    contacts:  [Contact],
    status:    [Status], 
    activity:  [Status] 
  });

  var UserAccount = mongoose.model('UserAccount', UserAccountSchema);

  var registerCallback = function(err) {
    if (err) {
      return console.log(err);
    };
    return console.log('User account was created');
  };

  var changePassword = function(userAccountId, newpassword) {
    var shaSum = crypto.createHash('sha256');
    shaSum.update(newpassword);
    var hashedPassword = shaSum.digest('hex');
    UserAccount.update({_id:userAccountId}, {$set: {password:hashedPassword}},{upsert:false},
      function changePasswordCallback(err) {
        console.log('Change password done for account ' + userAccountId);
    });
  };

  var forgotPassword = function(email, resetPasswordUrl, callback) {
    var user = UserAccount.findOne({email: email}, function findUserAccount(err, doc){
      if (err) {
        callback(false);
      } else {
        var smtpTransport = nodemailer.createTransport('SMTP', config.mail);
        resetPasswordUrl += '?useraccount=' + doc._id;
        smtpTransport.sendMail({
          from: 'mittal.parul15@yahoo.com',
          to: doc.email,
          subject: 'Foodex Password Request',
          text: 'Click here to reset your password: ' + resetPasswordUrl
        }, function forgotPasswordResult(err) {
          if (err) {
            callback(false);
          } else {
            callback(true);
          }
        });
      }
    });
  };

  var login = function(email, password, callback) {
    var shaSum = crypto.createHash('sha256');
    shaSum.update(password);
    UserAccount.findOne({email:email,password:shaSum.digest('hex')},function(err,doc){
      callback(doc);
    });
  };

  var findByString = function(searchStr, callback) {
    var searchRegex = new RegExp(searchStr, 'i');
    UserAccount.find({
      $or: [
        { 'name.full': { $regex: searchRegex } },
        { email:       { $regex: searchRegex } }
      ]
    }, callback);
  };

  var findById = function(userAccountId, callback) {
    UserAccount.findOne({_id:userAccountId}, function(err,doc) {
      callback(doc);
    });
  };

  var addContact = function(useraccount, addcontact) {
    contact = {
      name: addcontact.name,
      userAccountId: addcontact._id,
      added: new Date(),
      updated: new Date()
    };
    useraccount.contacts.push(contact);

    useraccount.save(function (err) {
      if (err) {
        console.log('Error saving account: ' + err);
      }
    });
  };

  var removeContact = function(useraccount, contactId) {
    if ( null == useraccount.contacts ) return;

    useraccount.contacts.forEach(function(contact) {
      if ( contact.userAccountId == contactId ) {
        useraccount.contacts.remove(contact);
      }
    });
    useraccount.save();
  };

  var hasContact = function(useraccount, contactId) {
    if ( null == useraccount.contacts ) return false;

    useraccount.contacts.forEach(function(contact) {
      if ( contact.userAccountId == contactId ) {
        return true;
      }
    });
    return false;
  };

  var register = function(email, password, firstName, lastName) {
    var shaSum = crypto.createHash('sha256');
    shaSum.update(password);

    console.log('Registering ' + email);
    var user = new UserAccount({
      email: email,
      name: {
        first: firstName,
        last: lastName,
        full: firstName + ' ' + lastName
      },
      password: shaSum.digest('hex')
    });
    user.save(registerCallback);
    console.log('Save command was sent');
  };

  return {
    findById: findById,
    register: register,
    hasContact: hasContact,
    forgotPassword: forgotPassword,
    changePassword: changePassword,
    findByString: findByString,
    addContact: addContact,
    removeContact: removeContact,
    login: login,
    UserAccount: UserAccount
  }
}

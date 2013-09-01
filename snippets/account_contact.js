var schemaOptions = {
  toJSON: {
    virtuals: true
  },
  toObject: {
    virtuals: true
  }
};

var UserContact = new mongoose.Schema({
  name: {
    fname:   { type: String },
    lname:    { type: String }
  },
  userAccountId: { type: mongoose.Schema.ObjectId },
  added:     { type: Date },     // When the contact was added
  updated:   { type: Date }      // When the contact last updated
}, schemaOptions);

UserContact.virtual('online').get(function(){
  return app.isUserAccountOnline(this.get('userAccountId'));
});

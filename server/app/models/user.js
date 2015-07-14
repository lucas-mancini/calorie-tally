var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt'),
    SALT_WORK_FACTOR = 5;

var UserSchema = new Schema({
    name: {type: String, required: true, unique: true },
    password: {type: String, required: true, select: false},
    expectedCaloriesPerDay: Number,
    admin: { type: Boolean, default: false}
});

// hash password before saving to DB
UserSchema.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or if it is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using the generated salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // override password with the hashed version
            user.password = hash;
            next();
        });
    });
});

/** Compare give password to the hashed version
  * @param {String} candidatePassword Password to compare
  * @param {Function} cb callback function to invoke after comparing
  * @this user from where the hashed password will be retrieved */
UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, match) {
        if (err) return cb(err);
        cb(null, match);
    });
};

/**
  * User with name, password, expected amount of calories per day,
  * and a role (admin or user manager). This is the main entity of
  * the app. */
module.exports = mongoose.model('User', UserSchema);

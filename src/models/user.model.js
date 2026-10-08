const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');


const userSchema = new mongoose.Schema({

    name:{
        type:String,
        requires: [true,"Please provide a name"],
        trim: true,
        maxlength: [40,"Name should not be more than 40 characters"],
        minlength: [4,"Name should not be less than 4 characters"]
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
   
     password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false, // never returned in queries unless asked for
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    isActive: {
      type: Boolean,
      default: true, // false = blocked or deactivated
    },
    isVerified: {
      type: Boolean,
      default: false, // email verification comes later
    },

    refreshTokenHash: { type: String, select: false },

    emailVerifyToken: { type: String, select: false },
    emailVerifyExpires: { type: Date, select: false },

    passwordResetToken: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false },

    passwordChangedAt: { type: Date },

  },
  { timestamps: true },// adds createdAt and updatedAt automatically

  
);

// Hash the password before saving
userSchema.pre('save', async function () {
  // Skip if the password was not changed (e.g. when updating only the name)
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});


// Check a plain password against the stored hash (used in login)
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// True if the password was changed AFTER the token was issued
userSchema.methods.changedPasswordAfter = function (tokenIssuedAt) {
  if (!this.passwordChangedAt) return false;
  return this.passwordChangedAt.getTime() / 1000 > tokenIssuedAt;
};


userSchema.index({ emailVerifyToken: 1 }, { sparse: true });
userSchema.index({ passwordResetToken: 1 }, { sparse: true });

// Remove sensitive/unneeded fields whenever the user is converted to JSON
// userSchema.set('toJSON', {
//   transform: (doc, ret) => {
//     delete ret.password;
//     delete ret.__v;
//     return ret;
//   },
// });

userSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;
    delete ret.refreshTokenHash;
    delete ret.emailVerifyToken;
    delete ret.emailVerifyExpires;
    delete ret.passwordResetToken;
    delete ret.passwordResetExpires;
    delete ret.__v;
    return ret;
  },
});


module.exports = mongoose.model("User",userSchema)
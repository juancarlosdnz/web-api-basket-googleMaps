const { Schema, model } = require('mongoose')
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true
    },
    email: { type: String, unique: true, required: true },
    password: String,
    profileImg: { type: String, default: 'https://i.stack.imgur.com/l60Hf.png' },
    phoneNumber: String,
    myMatches: [{ type: Schema.Types.ObjectId, ref: 'Match' }],
    wins: { type: Number, default: 0 },
    loses: { type: Number, default: 0 },
    role: {
      type: String,
      enum: ['PLAYER', 'ORGANIZER', 'ADMIN'],
      default: 'PLAYER'
    }
  },
  {
    timestamps: true
  }
);
module.exports = model('User', userSchema)
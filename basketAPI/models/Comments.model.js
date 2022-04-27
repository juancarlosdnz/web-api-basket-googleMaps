const { Schema, model } = require('mongoose')
const commentsSchema = new Schema(
    {
        comment: String,
        author: { type: Schema.Types.ObjectId, ref: 'User' },
        user: { type: Schema.Types.ObjectId, ref: 'User' }
    },
    {
        timestamps: true
    }
);

module.exports = model('Comments', commentsSchema)

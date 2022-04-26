const { Schema, model } = require('mongoose')
const commentsSchema = new Schema(
    {
        comment: String,
        owner: { type: Schema.Types.ObjectId, ref: 'User' },
    },
    {
        timestamps: true
    }
);


module.exports = model('Comments', commentsSchema)

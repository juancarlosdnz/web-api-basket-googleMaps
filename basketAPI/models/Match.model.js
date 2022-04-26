const {Schema,model}=require('mongoose')
const matchSchema = new Schema(
    {
        organizer: { type: Schema.Types.ObjectId, ref: 'User' },
        startTime: Date,
        endTime: Date,
        players: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        winner: { type: Schema.Types.ObjectId, ref: 'User' },
        opened: { type: Boolean, default: true },
        location: {
            type: {
                type: String
            },
            coordinates: [Number]
        }
    },
    {
        timestamps: true
    }
);

matchSchema.index({ location: '2dsphere' })
module.exports = model('Match', matchSchema)

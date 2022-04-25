const mongoose = require('mongoose');
const Schema = mongoose.Schema;
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
const Match = mongoose.model('Match', matchSchema);
module.exports = Match;
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const matchSchema = new Schema(
    {
        organizer: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        startTime: Date,
        endTime: Date,
        players: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        status: { type: String, enum: ['ON', 'OFF'], default: 'ON' },
    },
    {
        timestamps: true
    }
);
const Match = mongoose.model('Match', matchSchema);
module.exports = Match;
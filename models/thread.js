const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const threadSchema = new Schema({
    creator: {
        type: Schema.Types.ObjectId, ref: 'User',
        required: true
    },
    post_id: {
        type: Schema.Types.ObjectId, ref: 'Post',
        required: true
    },
    thread_id: {
        type: Schema.Types.ObjectId, ref: 'Thread',
    },
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
    content: {
        type: String,
        required: true
    },
}, { timestamps: true });

module.exports = mongoose.model('Thread', threadSchema);


const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    content: {
        type: String,
        default: '',
    },
    color: {
        type: String,
        default: '#FF6B6B',
    },
    category: {
        type: String,
        enum: ['Work', 'Personal', 'Ideas', 'Other'],
        default: 'Other',
    },
    isPinned: {
        type: Boolean,
        default: false,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    deletedAt: {
        type: Date,
        default: null,
    },
    wordCount: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });

module .exports = mongoose.model('Note', noteSchema);
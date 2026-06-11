const express = require('express');
const Note = require('../models/Note');
const protect = require('../middleware/protect');

const router = express.Router();

// Apply protect to all routes
router.use(protect);

// Note colors palette
const NOTE_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
  '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F',
  '#BB8FCE', '#85C1E9',
];

const getRandomColor = () => {
  return NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)];
};

// Helper to count words
const countWords = (text) => {
  const stripped = text.replace(/<[^>]*>/g, '').trim();
  if (!stripped) return 0;
  return stripped.split(/\s+/).filter(Boolean).length;
};

// @route   GET /api/notes
// @desc    Get all notes for logged in user
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { search, category } = req.query;

    let query = {
      user: req.user._id,
      isDeleted: false,
    };

    // Filter by category
    if (category && category !== 'All') {
      query.category = category;
    }

    // Search by title or content
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }

    const notes = await Note.find(query).sort({
      isPinned: -1,
      updatedAt: -1,
    });

    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/notes/stats
// @desc    Get notes stats for logged in user
// @access  Private
router.get('/stats', async (req, res) => {
  try {
    const totalNotes = await Note.countDocuments({
      user: req.user._id,
      isDeleted: false,
    });

    const pinnedNotes = await Note.countDocuments({
      user: req.user._id,
      isPinned: true,
      isDeleted: false,
    });

    const trashedNotes = await Note.countDocuments({
      user: req.user._id,
      isDeleted: true,
    });

    const byCategory = await Note.aggregate([
      {
        $match: {
          user: req.user._id,
          isDeleted: false,
        },
      },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
    ]);

     // Latest 5 notes
    const latestNotes = await Note.find({
      user: req.user._id,
      isDeleted: false,
    })
      .sort({ createdAt: -1 })
      .limit(5)

    res.json({
      totalNotes,
      pinnedNotes,
      trashedNotes,
      byCategory,
      latestNotes,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/notes/trash
// @desc    Get trashed notes
// @access  Private
router.get('/trash', async (req, res) => {
  try {
    const notes = await Note.find({
      user: req.user._id,
      isDeleted: true,
    }).sort({ deletedAt: -1 });

    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/notes/calendar
// @desc    Get notes grouped by date
// @access  Private
router.get('/calendar', async (req, res) => {
  try {
    const notes = await Note.find({
      user: req.user._id,
      isDeleted: false,
    }).sort({ createdAt: -1 });

    // Group notes by date
    const grouped = {};
    notes.forEach(note => {
      const date = new Date(note.createdAt)
        .toISOString()
        .split('T')[0];
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(note);
    });

    res.json(grouped);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   POST /api/notes
// @desc    Create a new note
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { title, content, category } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const note = await Note.create({
      user: req.user._id,
      title,
      content: content || '',
      color: getRandomColor(),
      category: category || 'Other',
      wordCount: countWords(content || ''),
    });

    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   PUT /api/notes/:id
// @desc    Update a note
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const { title, content, category, isPinned } = req.body;

    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    if (title !== undefined) note.title = title;
    if (content !== undefined) {
      note.content = content;
      note.wordCount = countWords(content);
    }
    if (category !== undefined) note.category = category;
    if (isPinned !== undefined) note.isPinned = isPinned;

    await note.save();
    res.json(note);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   DELETE /api/notes/:id
// @desc    Soft delete a note (move to trash)
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    note.isDeleted = true;
    note.deletedAt = new Date();
    await note.save();

    res.json({ message: 'Note moved to trash' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   PUT /api/notes/:id/restore
// @desc    Restore a note from trash
// @access  Private
router.put('/:id/restore', async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    note.isDeleted = false;
    note.deletedAt = null;
    await note.save();

    res.json({ message: 'Note restored successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   DELETE /api/notes/:id/permanent
// @desc    Permanently delete a note
// @access  Private
router.delete('/:id/permanent', async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: 'Note permanently deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
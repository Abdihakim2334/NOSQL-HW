const router = require('express').Router();
const Thought = require('../models/thought');
const User = require('../models/User');

// GET all thoughts
router.get('/', async (req, res) => {
  try {
    const thoughts = await Thought.find();
    res.json(thoughts);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET a single thought by ID
router.get('/:id', async (req, res) => {
  try {
    const thought = await Thought.findById(req.params.id);
    if (!thought) return res.status(404).json({ message: 'Thought not found' });
    res.json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
});

// POST to create a new thought
router.post('/', async (req, res) => {
  try {
    const thought = await Thought.create(req.body);
    await User.findByIdAndUpdate(req.body.userId, { $push: { thoughts: thought._id } });
    res.status(201).json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
});

//  update a thought by id
router.put('/:id', async (req, res) => {
  try {
    const thought = await Thought.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!thought) return res.status(404).json({ message: 'Thought not found' });
    res.json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delte a thought by id
router.delete('/:id', async (req, res) => {
  try {
    const thought = await Thought.findByIdAndDelete(req.params.id);
    if (!thought) return res.status(404).json({ message: 'Thought not found' });
    res.json({ message: 'Thought deleted' });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Post to create a reaction
router.post('/:thoughtId/reactions', async (req, res) => {
  try {
    const thought = await Thought.findByIdAndUpdate(req.params.thoughtId, { $push: { reactions: req.body } }, { new: true });
    if (!thought) return res.status(404).json({ message: 'Thought not found' });
    res.json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete a reaction
router.delete('/:thoughtId/reactions/:reactionId', async (req, res) => {
  try {
    const thought = await Thought.findByIdAndUpdate(req.params.thoughtId, { $pull: { reactions: { reactionId: req.params.reactionId } } }, { new: true });
    if (!thought) return res.status(404).json({ message: 'Thought not found' });
    res.json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;

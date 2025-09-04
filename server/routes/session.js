const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// POST /session
router.post('/', (req, res) => {
  const { username, member } = req.body;
  const sessionId = `${username}_${member}_${uuidv4()}`;
  res.json({ sessionId });
});

module.exports = router;

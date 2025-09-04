const express = require('express');
const multer = require('multer');
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// POST /upload (image upload)

const ChatSession = require('../models/ChatSession');

// POST /upload (image upload and return base64 data)
router.post('/', upload.single('image'), async (req, res) => {
  try {
    console.log('Upload request received');
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);
    
    if (!req.file) {
      console.log('No file provided');
      return res.status(400).json({ error: 'No image file provided' });
    }

    console.log('File details:', {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size
    });

    const imageBuffer = req.file.buffer;
    const base64Image = imageBuffer.toString('base64');
    
    console.log('Base64 length:', base64Image.length);
    
    // Return the base64 data for the frontend to use
    res.json({ 
      base64: base64Image,
      mimeType: req.file.mimetype,
      filename: req.file.originalname
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

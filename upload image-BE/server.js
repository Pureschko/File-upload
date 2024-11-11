const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();
const port = 3000;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext); 
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true); 
    } else {
      cb(new Error('Only image files are allowed!'), false); 
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

app.use(express.static('uploads'));

app.post('/file-upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }
  res.json({ location: `http://localhost:${port}/uploads/${req.file.filename}` });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

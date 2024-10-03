const express = require('express');
const multer = require('multer');

const app = express();

// Final upload folder
const UPLOAD_FOLDER = './uploads';

// Multer configuration
const upload = multer({
    dest: UPLOAD_FOLDER,
    limits: {
        fileSize: 1 * 1024 * 1024 // Limit file size to 1MB (1 * 1024 * 1024 bytes)
    },
    fileFilter: (req, file, cb) => {
        // File type filtering
        if (
            file.mimetype === "image/png" ||
            file.mimetype === "image/jpeg" ||
            file.mimetype === "image/jpg"
        ) {
            cb(null, true);  // Accept the file
        } else {
            cb(new Error('Only .png, .jpeg, and .jpg files are allowed!'), false);  // Reject the file
        }
    }
});

// Handling file uploads (for multiple fields)
app.post('/', upload.fields([
    { 
        name: "avatar", 
        maxCount: 1 // Single file for avatar
    },   
    { 
        name: "gallery", 
        maxCount: 3 // Multiple files for gallery (up to 3 files)
    }   
]), (req, res, next) => {
    if (!req.files || (Object.keys(req.files).length === 0)) {
        return res.status(400).send('No files were uploaded.');
    }

    // If files are uploaded successfully
    res.send('Files uploaded successfully.');
});



// Global error handler for Multer and other errors
app.use((err, req, res, next) => {
    if (err) {
        if (err instanceof multer.MulterError) {
            // Multer-specific errors (e.g., file size limit)
            res.status(500).send('File upload error.');
        } else {
            // General errors
            res.status(500).send(err.message);
        }
    } else {
        next();
    }
});



// Start the server
app.listen(4000, () => {
    console.log('Server running on http://localhost:4000');
});

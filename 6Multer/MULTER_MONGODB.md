### **Multer with MongoDB and Mongoose: Full Tutorial**

In this tutorial, we’ll integrate **Multer** (for file uploads) with **MongoDB** using **Mongoose** to store file metadata in the database while the files themselves are saved either on the local server or uploaded to cloud storage. This setup is common in many web applications, where files like profile pictures, documents, or images are uploaded and their metadata is stored in a database for easier reference.

---

### **1. Project Setup**

#### **Step 1: Install Required Packages**
Make sure you have Node.js installed. Then, initialize your project and install the required packages:

```bash
npm init -y
npm install express multer mongoose mongodb
```

- **`express`**: Web framework for Node.js.
- **`multer`**: Middleware for handling file uploads.
- **`mongoose`**: ODM (Object Data Modeling) library for MongoDB.
- **`mongodb`**: MongoDB driver.

---

### **2. Setting Up MongoDB and Mongoose**

#### **Step 2: Connect to MongoDB**

You need to have MongoDB running on your local machine or a MongoDB cloud instance like **MongoDB Atlas**. You can use a cloud database for production, but for local development, start MongoDB locally or use a cloud URI.

Here's how to set up a basic **Mongoose** connection in your `app.js`:

```javascript
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');

const app = express();

// Connect to MongoDB (replace with your MongoDB connection string)
mongoose.connect('mongodb://localhost:27017/fileuploads', { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})
.then(() => console.log('MongoDB Connected'))
.catch((err) => console.log(err));
```

#### **Step 3: Create Mongoose Schema for File Metadata**

Define a schema for storing file metadata. In this case, we’ll store the file name, path, and upload date in MongoDB.

```javascript
const fileSchema = new mongoose.Schema({
    filename: String,
    path: String,
    contentType: String,
    size: Number,
    uploadDate: { type: Date, default: Date.now }
});

const File = mongoose.model('File', fileSchema);
```

- **`filename`**: The original file name.
- **`path`**: Where the file is stored on the server.
- **`contentType`**: The MIME type (e.g., image/jpeg).
- **`size`**: File size in bytes.
- **`uploadDate`**: The date when the file was uploaded.

---

### **3. File Upload with Multer and Saving to MongoDB**

#### **Step 4: Configure Multer for File Upload**

We need to set up **Multer** to handle the file upload. The file will be saved to the local `uploads/` folder, and the metadata will be stored in MongoDB.

```javascript
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });
```

#### **Step 5: Create a POST Route to Handle Upload**

Now, we’ll create a route that handles the file upload and saves the file’s metadata in MongoDB.

```javascript
app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }

        // Create a new file document
        const newFile = new File({
            filename: req.file.originalname,
            path: req.file.path,
            contentType: req.file.mimetype,
            size: req.file.size
        });

        // Save file metadata to MongoDB
        await newFile.save();

        res.send({
            message: 'File uploaded successfully!',
            file: newFile
        });
    } catch (err) {
        res.status(500).send('Error uploading file.');
    }
});
```

- **`upload.single('file')`**: This handles the single file upload using the field name `file`.
- **File Metadata**: We create a new `File` object with information like the original name, file path, MIME type, and file size, and save it in MongoDB.

#### **Step 6: HTML Form to Upload File**

Here's a simple HTML form that will allow users to upload files to the server:

```html
<form action="/upload" method="POST" enctype="multipart/form-data">
    <input type="file" name="file" required>
    <button type="submit">Upload File</button>
</form>
```

---

### **4. Displaying Uploaded Files**

#### **Step 7: Fetch and Display File Metadata from MongoDB**

You can create a route that fetches file metadata from MongoDB and displays it. For simplicity, we will display the metadata as JSON, but in a real application, you could return the file for download or display the image.

```javascript
app.get('/files', async (req, res) => {
    try {
        const files = await File.find();
        res.json(files);
    } catch (err) {
        res.status(500).send('Error fetching files.');
    }
});
```

#### **Step 8: Serving Uploaded Files**

Since the files are saved on the local server, you can serve them using Express's `static` middleware:

```javascript
app.use('/uploads', express.static('uploads'));
```

This allows you to access the uploaded files via `http://localhost:3000/uploads/filename`.

---

### **5. Handling Multiple Files Upload**

#### **Scenario: User Uploading Multiple Files (Gallery)**

If you want to handle **multiple file uploads** (like a gallery of images), use `upload.array()` and modify the route accordingly:

```javascript
app.post('/upload-multiple', upload.array('files', 5), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).send('No files uploaded.');
        }

        const fileMetadataArray = req.files.map(file => ({
            filename: file.originalname,
            path: file.path,
            contentType: file.mimetype,
            size: file.size
        }));

        // Save all file metadata to MongoDB
        await File.insertMany(fileMetadataArray);

        res.send({
            message: 'Files uploaded successfully!',
            files: fileMetadataArray
        });
    } catch (err) {
        res.status(500).send('Error uploading files.');
    }
});
```

- **`upload.array('files', 5)`**: This allows up to 5 files to be uploaded at once.
- **`req.files`**: This will contain an array of files that were uploaded.

#### **HTML Form for Multiple File Upload**

```html
<form action="/upload-multiple" method="POST" enctype="multipart/form-data">
    <input type="file" name="files" multiple required>
    <button type="submit">Upload Files</button>
</form>
```

---

### **6. Advanced Concepts**

#### **6.1. File Upload Validation**

You can add **file validation** to restrict certain file types or limit the file size:

```javascript
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);  // Accept file
    } else {
        cb(new Error('Only JPEG and PNG files are allowed!'), false);  // Reject file
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 },  // 2MB limit
    fileFilter: fileFilter
});
```

#### **6.2. Cloud Storage with MongoDB**

If you want to upload files to **cloud storage** (like AWS S3, Google Cloud, or Firebase) while saving metadata in MongoDB, you can replace the `diskStorage` with a cloud storage adapter like `multer-s3`. You'd save the file metadata (file URL, etc.) to MongoDB as before.

---

### **7. Exercise for Practice**

1. **Exercise 1: Profile Picture Upload with Validation**
   - Create a route where users can upload their profile picture.
   - Only allow `.jpeg` or `.png` files and limit the size to 1MB.
   - Store the file metadata in MongoDB and serve the image from the `uploads` folder.

2. **Exercise 2: Document Upload with Metadata**
   - Create a form where users can upload a document (PDF).
   - Save the file locally and store its metadata (file name, path, size, and upload date) in MongoDB.
   - Display all uploaded documents on a `/documents` route.

3. **Exercise 3: Multiple File Upload (Gallery)**
   - Build a system where users can upload multiple images (max 5) for a gallery.
   - Store metadata in MongoDB and serve the images on a `/gallery` route.

---

### **8. Conclusion**

In this tutorial, you learned how to:
- Upload files using **Multer** and save their metadata in **MongoDB** using **Mongoose**.
- Handle both **single** and **multiple** file uploads.
- Implement file validation to restrict file types and sizes.
- Serve uploaded files from

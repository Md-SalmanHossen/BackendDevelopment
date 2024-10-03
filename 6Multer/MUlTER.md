

### **Multer Tutorial: Complete Guide**

---

### **1. What is Multer?**
**Multer** is a middleware for handling `multipart/form-data`, which is primarily used for uploading files in web applications. It works with Express.js and simplifies file upload management, allowing you to store files locally or on cloud platforms (with advanced integrations).

#### **Why Multer?**
- Handles file uploads via forms.
- Simplifies file handling in Node.js.
- Supports single, multiple, and categorized file uploads.
- Offers file validation and storage options (local or cloud).

---

### **2. Installing Multer**

First, install Multer in your project:
```bash
npm install multer
```

Make sure you have a project initialized with `npm init -y` and `express` installed:
```bash
npm install express
```

---

### **3. Basic Setup: Single File Upload**

#### **Scenario: Profile Picture Upload**

##### **Step 1: Import Multer and Set Up Express**

Create an `app.js` file:

```javascript
const express = require('express');
const multer = require('multer');
const app = express();
```

##### **Step 2: Configure Multer Storage**

We configure Multer to store files in a specific folder on our server. By default, Multer stores files with random names in the provided destination (`dest`).

```javascript
const upload = multer({ dest: 'uploads/' });  // Files will be stored in "uploads" folder
```

##### **Step 3: Handling Single File Upload**

Now let's create a route that handles **single file uploads**, like uploading a profile picture:

```javascript
app.post('/upload-avatar', upload.single('avatar'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    res.send(`File uploaded successfully: ${req.file.originalname}`);
});
```

- `upload.single('avatar')`: Restricts the file upload to one file, expecting the field name to be `avatar`.
- **Response**: Returns the name of the uploaded file to the user.

##### **Step 4: HTML Form for Single File Upload**

Here’s an example of the form that will send the file to the backend:

```html
<form action="/upload-avatar" method="POST" enctype="multipart/form-data">
    <label for="avatar">Upload Avatar:</label>
    <input type="file" name="avatar" id="avatar" required>
    <button type="submit">Upload</button>
</form>
```

---

### **4. Advanced Setup: Custom Storage, Multiple Files, and File Validation**

#### **Scenario: Product Image Gallery Upload (Multiple Files)**

##### **Step 1: Custom Storage with File Naming**

You may want to store files with custom names (e.g., the original name with a timestamp). Here's how to use **diskStorage** to customize file storage:

```javascript
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');  // Files are stored in the "uploads" directory
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);  // Use timestamp and original file name
    }
});

const upload = multer({ storage: storage });
```

##### **Step 2: Handling Multiple Files Upload**

For a gallery where users can upload multiple images, use `upload.array()`:

```javascript
app.post('/upload-gallery', upload.array('photos', 5), (req, res) => {
    if (!req.files) {
        return res.status(400).send('No files uploaded.');
    }
    res.send(`Uploaded ${req.files.length} files.`);
});
```

- **Explanation**:
  - `upload.array('photos', 5)`: Allows uploading up to 5 images with the field name `photos`.
  - `req.files`: Accesses the array of uploaded files.

##### **Step 3: HTML Form for Multiple Files Upload**

```html
<form action="/upload-gallery" method="POST" enctype="multipart/form-data">
    <label for="photos">Upload Product Gallery (Max 5):</label>
    <input type="file" name="photos" id="photos" multiple required>
    <button type="submit">Upload Gallery</button>
</form>
```

---

### **5. Multiple File Fields Upload: Uploading Different Types of Files**

#### **Scenario: Profile Picture + Supporting Documents**

In this scenario, a user uploads multiple types of files (e.g., a profile picture and documents). Each field can have its own file upload rules.

##### **Step 1: Handling Multiple Fields Upload**

Use `upload.fields()` for handling multiple file fields:

```javascript
app.post('/upload-profile', upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'documents', maxCount: 5 }
]), (req, res) => {
    if (!req.files['avatar']) {
        return res.status(400).send('Avatar not uploaded.');
    }
    if (!req.files['documents']) {
        return res.status(400).send('Documents not uploaded.');
    }

    res.send('Profile and documents uploaded successfully.');
});
```

- **Explanation**:
  - `avatar`: Allows one file for the avatar.
  - `documents`: Allows up to 5 files (e.g., PDF documents).

##### **Step 2: HTML Form for Multiple Fields**

```html
<form action="/upload-profile" method="POST" enctype="multipart/form-data">
    <label for="avatar">Upload Avatar:</label>
    <input type="file" name="avatar" id="avatar" required>
    
    <label for="documents">Upload Documents (Max 5):</label>
    <input type="file" name="documents" id="documents" multiple required>
    
    <button type="submit">Upload Profile</button>
</form>
```

---

### **6. File Size Limit and Validation**

Multer allows you to limit the size of the uploaded files and restrict the types of files (e.g., only images).

#### **Scenario: Restrict File Type and Size**

You may want to only accept image files under 2MB for an avatar upload.

##### **Step 1: File Filter for Validating File Type**

Use `fileFilter` to validate the file type:

```javascript
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);  // Accept file
    } else {
        cb(new Error('Invalid file type, only JPEG and PNG are allowed!'), false);  // Reject file
    }
};
```

##### **Step 2: Setting File Size Limit**

You can set the size limit as part of the Multer configuration:

```javascript
const upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 },  // Limit to 2MB
    fileFilter: fileFilter
});
```

##### **Step 3: Handling File Validation Errors**

You can handle errors like file size or type validation in the route:

```javascript
app.post('/upload-avatar', (req, res) => {
    upload.single('avatar')(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(400).send('File too large or invalid format.');
        } else if (err) {
            return res.status(400).send(err.message);
        }

        res.send('File uploaded successfully.');
    });
});
```

---

### **7. Advanced Multer: Uploading Files to Cloud Storage**

For advanced applications, you might want to upload files directly to a cloud platform like **AWS S3**, **Google Cloud**, or **Firebase Storage**. Here's an example of uploading to AWS S3:

#### **Step 1: Installing AWS SDK and Multer-S3**

```bash
npm install aws-sdk multer-s3
```

#### **Step 2: Setting Up S3 Storage in Multer**

```javascript
const AWS = require('aws-sdk');
const multerS3 = require('multer-s3');

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'us-west-1'  // Your AWS region
});

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'your-bucket-name',
        acl: 'public-read',
        key: function (req, file, cb) {
            cb(null, Date.now().toString() + '-' + file.originalname);  // Customize the file name
        }
    })
});
```

#### **Step 3: Upload to S3**

```javascript
app.post('/upload-to-s3', upload.single('avatar'), (req, res) => {
    res.send('File uploaded to S3 successfully');
});
```

---

### **8. Exercises for Practice**

1. **Exercise 1: Profile Picture Upload**
   - Implement single file upload for a user’s profile picture. Ensure only `.jpg` or `.png` files are accepted, and limit the size to 1MB.
   
2. **Exercise 2: Product Image Gallery**
   - Allow users to upload up

 to 5 product images at once. Validate that the images are either `.jpg` or `.png` and each image is under 2MB.

3. **Exercise 3: Document Upload for Job Application**
   - Build a form where users can upload their resume (PDF) and supporting documents (multiple files, PDF/DOCX). Limit the resume size to 1MB and each document to 2MB.

4. **Advanced Exercise: Upload to AWS S3**
   - Set up AWS S3 storage and upload a file to S3. Ensure that the files are publicly accessible after upload.

---
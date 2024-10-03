
const express=require('express');
const multer=require('multer');

const app=express();

//process the multer file upload

//final upload folder
const UPLOAD_FOLDER='./uploads';


//Prepare the final multer upload object
var upload=multer({
   dest:UPLOAD_FOLDER
})

//for single file : upload.single('avatar');
//for multiple file: upload.array('avatar',3);
//array like object:upload.fields([{"",maxCount:1},{"",maxCount:1}]);

app.post('/',upload.fields([
   {"name":"avatar",maxCount:1},
   {"name":"gallery",maxCount:3}
]),(req,res)=>{
   res.send('hello world')
})

app.listen('4000',()=>{
   console.log('locally this port will running');
})
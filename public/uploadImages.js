// import 'cropperjs/dist/cropper.css';
//import Cropper from '/cropperjs/cropperjs';////

//this will hold all of our images
var images = {}

var imageCount = 0;

var uploadButton = document.getElementById("uploadButton")


uploadButton.addEventListener("click",uploadImage);
var imgUpload = document.getElementById("imgupload");
//this makes it that so when you click on the button it clicks on the image upload button.
function uploadImage(){
    
    imgUpload.click();

}


imgUpload.addEventListener('change',function(){
    if(this.files && this.files[0]){
        //this makes it so the user can only upload image files... this is also regex btw
        if(!(this.files[0].type.match('image.*'))){
            alert("Please only upload image files") //make this look nice later
            return;
        }

        src = URL.createObjectURL(this.files[0]); // set src to blob url

        //generating a random id for this object. Note that we don't check if the id 
        //already exits. I'm not perfect. 
        var newID = this.files[0].name + imageCount + Math.floor(Math.random() * 10000)
        
        

       //assigning images at the new id to hold the link to the blob url.
        images[newID] = src;
        imageCount++;
        //reseting our file upload.
        imgUpload.value='';
        toggleSendDisplay();
    }
});


//just a function that shows the send button if you upload an image.
function toggleSendDisplay(){
    if(imageCount <=0){
        document.getElementById("sendButton").style.display="none";
    }else{
        document.getElementById("sendButton").style.display="block";
    }
}


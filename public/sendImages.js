


var sendButton = document.getElementById("sendButton");

sendButton.addEventListener("click",sendImages);


async function sendImages(){
    var totalImages = 0;
    var imagesProcessed = 0;
    //figuring out how many total images we need to send.
    for(const [key, imageURL] of Object.entries(images)){
        if(imageURL === null){
            continue;
        }else{
            totalImages+=1;
        }
    }
    var sendBody = {
        "imageAmount":0,
        "collageTitle":"ExampleTitle",
        "images":[]
    }
    const reader = new FileReader();
    reader.addEventListener("load", function () {
        // convert image file to base64 string
        imagesProcessed++;
        sendBody.imageAmount++;

        //I do this because I cannot directly edit the sendBody, so I take the array out
        //append an image and then add it back on.
        var array = sendBody["images"];
        array.push(reader.result);
        sendBody.images = array;

        if(imagesProcessed === totalImages){
            //if the amount of images processed is the amount we need to send
            //send it.
            //I do this because I don't understand async, and reader is async.
            sendBodyFunction(sendBody);
        }
      }, false);
      //iterates through every entry in the images object.
    for(const [key, imageURL] of Object.entries(images)){

        //this doesn't apply here but in my other project
        //I set value to null if the image was deleted
        if(imageURL === null){
            continue;
        }else{
            let blob = await fetch(imageURL).then(
                r => r.blob()
            );
            reader.readAsDataURL(blob); //when this loads it calls the event listener for LOAD, which is above.
        }
    }
 
}


function sendBodyFunction(sendBody){

    var postRequest = new XMLHttpRequest();
    postRequest.open("post","/postImages",true);
    postRequest.addEventListener("load",function(event){
        if(event.target.status === 200){
            console.log("replacing location");
            alert("Mission Success!")
           
        }else{
            console.log("Mission Fail");
        }
    })
    postRequest.setRequestHeader('Content-Type', 'application/json');
    var send = JSON.stringify(sendBody);
    postRequest.send(send);
}

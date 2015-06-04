        var pictureSource; // picture source
        var destinationType; // sets the format of returned value
        document.addEventListener("deviceready", onDeviceReady, false);

        function onDeviceReady() {
            pictureSource = navigator.camera.PictureSourceType;
            destinationType = navigator.camera.DestinationType;
            // Register the event listener
            document.addEventListener("menubutton", onMenuKeyDown, false);
            FastClick.attach(document.body);
        }
         // Called when a photo is successfully retrieved

        function onPhotoDataSuccess(imageData) {
            // Uncomment to view the base64-encoded image data
            // console.log(imageData);
            // Get image handle
            var smallImage = document.getElementById('smallImage');
            // Unhide image elements
            smallImage.style.display = 'block';
            // Show the captured photo
            // The in-line CSS rules are used to resize the image
            smallImage.src = "data:image/jpeg;base64," + imageData;
        }
         // Called when a photo is successfully retrieved

        function onPhotoURISuccess(imageURI) {
            // Uncomment to view the image file URI
            // console.log(imageURI);
            // Get image handle
            var largeImage = document.getElementById('largeImage');
            // Unhide image elements
            largeImage.style.display = 'block';
            // Show the captured photo
            // The in-line CSS rules are used to resize the image
            largeImage.src = "data:image/jpeg;base64," + imageData;
        }
         // A button will call this function

        function capturePhoto() {
            // Take picture using device camera and retrieve image as base64-encoded string
            navigator.camera.getPicture(onPhotoDataSuccess, onFail, {
                sourceType: 1,
                quality: 60,
                destinationType: Camera.DestinationType.FILE_URI,
                saveToPhotoAlbum: false
            });
        }
         // A button will call this function

        function capturePhotoEdit() {
            // Take picture using device camera, allow edit, and retrieve image as base64-encoded string
            navigator.camera.getPicture(onPhotoDataSuccess, onFail, {
                quality: 20,
                allowEdit: true,
                destinationType: destinationType.DATA_URL
            });
        }
         // A button will call this function

        function getPhoto(source) {
            // Retrieve image file location from specified source
            navigator.camera.getPicture(onPhotoURISuccess, onFail, {
                quality: 50,
                destinationType: destinationType.FILE_URI,
                sourceType: source
            });
        }
         // Called if something bad happens.

        function onFail(message) {
            alert('You did not complete your Prescription upload' + message);
        }

        // Handle the menu button
        //
        function onMenuKeyDown() {
        document.getElementById('mypanel');
        }

        //Loads Confirm page on Camera icon Click
        //$(document).ready(function(){
        	  //$("logo").click(function(){
        	    //$("#submit-container").load("capturePhoto();");
        	    //$("#rx-confirm").load();
        	  //});
        	//});
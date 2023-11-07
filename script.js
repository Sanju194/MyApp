// Initialize variables for camera selection
let currentCamera = "user";

// Function to switch between front and back cameras
const switchCameraButton = document.getElementById("switch-camera");
switchCameraButton.addEventListener("click", async function () {
    currentCamera = currentCamera === "user" ? "environment" : "user";
    await setupCamera();
});

// Function to access and display the camera video
async function setupCamera() {
    try {
        const constraints = {
            video: {
                facingMode: currentCamera,
                width: { ideal: 1280 },
                height: { ideal: 720 }
            }
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        const video = document.getElementById("camera");
        video.srcObject = stream;
    } catch (error) {
        console.error("Error accessing the camera:", error);
    }
}

// Call the setupCamera function to initialize the camera
setupCamera();

// The rest of your existing JavaScript code remains unchanged



// Function to get and display user's location
function getLocation() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        } else {
            reject("Geolocation is not supported in this browser.");
        }
    });
}

// Function to format date and time
function formatDateTime(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    return date.toLocaleDateString('en-US', options);
}

// Access the camera and display video
const video = document.getElementById("camera");
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(function(stream) {
            video.srcObject = stream;
        })
        .catch(function(error) {
            console.error("Error accessing the camera:", error);
        });
}

// Capture photo and display it
const canvas = document.getElementById("canvas");
const photo = document.getElementById("photo");
const saveButton = document.getElementById("save-button");
const captureButton = document.getElementById("capture-button");

captureButton.addEventListener("click", async function() {
    try {
        const location = await getLocation();
        const latitude = location.coords.latitude;
        const longitude = location.coords.longitude;
        const dateTime = formatDateTime(new Date());

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext("2d");
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Display coordinates and date/time on the photo
        context.font = "20px Arial";
        context.fillStyle = "yellow";
        context.fillText(`Lat: ${latitude.toFixed(4)}, Long: ${longitude.toFixed(4)}`, 10, 30);
        context.fillText(`Date/Time: ${dateTime}`, 10, 60);

        photo.src = canvas.toDataURL("image/png");
    } catch (error) {
        console.error("Error getting location:", error);
    }
});

saveButton.addEventListener("click", function() {
    const shopName = document.getElementById("shop-name").value;
    const range = document.getElementById("range").value;
    const station = document.getElementById("station").value;
    const district = document.getElementById("district").value;

    // Draw captured data on the canvas
    const context = canvas.getContext("2d");
    context.font = "20px Arial";
    context.fillStyle = "yellow";
    context.fillText(`Shop: ${shopName}`, 10, 90);
    context.fillText(`Range: ${range}`, 10, 120);
    context.fillText(`Station: ${station}`, 10, 150);
    context.fillText(`District: ${district}`, 10, 180);

    // Create a data URL with the image and data
    const imageDataURL = canvas.toDataURL("image/png");

    // Create an anchor element to allow the user to download the image
    const downloadLink = document.createElement("a");
    downloadLink.href = imageDataURL;
    downloadLink.download = "captured_image.png";
    downloadLink.click();
});

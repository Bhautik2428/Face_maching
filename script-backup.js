document.addEventListener('DOMContentLoaded', async () => {
    await loadFaceAPI();

    const imageInput = document.getElementById('imageInput');
    const analyzeButton = document.getElementById('analyzeButton');
    const copyButton = document.getElementById('copyButton');
    const descriptorOutput = document.getElementById('descriptor');
    const descriptorTextarea = document.getElementById('descriptorTextarea');

    analyzeButton.addEventListener('click', async () => {
        const files = imageInput.files;
        if (files.length > 0) {
            const descriptorsArray = [];

            for (const file of files) {
                const img = document.createElement('img');
                img.src = URL.createObjectURL(file);
                await img.decode();

                const descriptors = await faceapi.computeFaceDescriptor(img);
                descriptorsArray.push(descriptors);
                console.log(descriptors,"single descriptor");
            }

            // Display the descriptors as a JSON string
            const descriptorsJSON = JSON.stringify(descriptorsArray);
            descriptorOutput.textContent = descriptorsJSON;

            // Display descriptors in the textarea
            descriptorTextarea.value = descriptorsJSON;

            // Enable the "Copy" button
            copyButton.disabled = false;
        } else {
            alert('Please select one or more image files.');
        }
    });

    // Load FaceAPI.js
async function loadFaceAPI() {
    await faceapi.nets.faceRecognitionNet.loadFromUri('faceapi/models');
    await faceapi.nets.faceLandmark68Net.loadFromUri('faceapi/models');
    await faceapi.nets.ssdMobilenetv1.loadFromUri('faceapi/models');
}


    copyButton.addEventListener('click', () => {
        // Copy descriptors to clipboard
        descriptorTextarea.select();
        document.execCommand('copy');
        alert('Descriptors copied to clipboard.');
    });
});

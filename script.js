// Load FaceAPI.js
async function loadFaceAPI() {
    await faceapi.nets.faceRecognitionNet.loadFromUri('faceapi/models');
    await faceapi.nets.faceLandmark68Net.loadFromUri('faceapi/models');
    await faceapi.nets.ssdMobilenetv1.loadFromUri('faceapi/models');
}

document.addEventListener('DOMContentLoaded', async () => {
    await loadFaceAPI();

    const imageInput = document.getElementById('imageInput');
    const analyzeButton = document.getElementById('analyzeButton');
    const copyButton = document.getElementById('copyButton');
    const descriptorOutput = document.getElementById('descriptor');
    const queryImageInput = document.getElementById('queryImageInput');
    const compareButton = document.getElementById('compareButton');
    const meanDistanceOutput = document.getElementById('meanDistance');

    let labeledDescriptors = [];

    analyzeButton.addEventListener('click', async () => {
        const files = imageInput.files;
        if (files.length > 0) {
            labeledDescriptors = [];

            for (const file of files) {
                const img = document.createElement('img');
                img.src = URL.createObjectURL(file);
                await img.decode();
                
                const descriptors = await faceapi.computeFaceDescriptor(img);
                labeledDescriptors.push(new faceapi.LabeledFaceDescriptors(file.name, [descriptors]));
            }

            // Display the descriptors as a JSON string
            descriptorOutput.value = JSON.stringify(labeledDescriptors.map(ld => ld.descriptors));
            copyButton.style.display = 'inline';
        } else {
            alert('Please select one or more image files.');
        }
    });

    copyButton.addEventListener('click', () => {
        descriptorOutput.select();
        document.execCommand('copy');
        alert('Labels copied to clipboard.');
    });

    queryImageInput.addEventListener('change', () => {
        compareButton.disabled = false;
    });

    compareButton.addEventListener('click', async () => {
        const queryFile = queryImageInput.files[0];
        if (queryFile) {
            const queryImage = document.createElement('img');
            queryImage.src = URL.createObjectURL(queryFile);
            await queryImage.decode();

            const queryDescriptors = await faceapi.computeFaceDescriptor(queryImage);

            const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors);

            const bestMatch = faceMatcher.findBestMatch(queryDescriptors);
            let result = bestMatch.toString();
            // Display the best match   
            if (bestMatch.label !== 'unknown') {
                meanDistanceOutput.textContent = `Best Match: ${result}`;
            } else {
                meanDistanceOutput.textContent = 'No Match Found';
            }
        } else {
            alert('Please select a query image.');
        }
    });
});

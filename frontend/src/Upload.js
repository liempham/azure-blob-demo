import React, { useState } from 'react';
import axios from 'axios';

function Upload() {
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) return;

        try {
            const response = await axios.get(`http://127.0.0.1:5000/generate-upload-sas?blob_name=${file.name}`);
            const sasUrl = response.data.sas_url;

            await axios.put(sasUrl, file, {
                headers: {
                    'Content-Type': file.type,                    
                    'x-ms-blob-type': 'BlockBlob'
                }
            });

            alert('File uploaded successfully');
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('Failed to upload file');
        }
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
        </div>
    );
}

export default Upload;
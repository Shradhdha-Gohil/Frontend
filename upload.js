import React, { useCallback, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import Lottie from 'react-lottie';
import animationData1 from '../../assets/upload.json';
import '../pagesCSS/UploadCSS.css';
import Accordion from "./Accordion";
import Footer from '../inc/footer';
import Navigation from '../inc/navigation';
import { fetchDataFromBackend } from "../inc/api_GETservice";
import { sendDataToBackend } from "../inc/apiService";

const defaultOptions1 = {
  loop: true,
  autoplay: true,
  animationData: animationData1,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  }
};

const Upload = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [isDropzoneLeft, setIsDropzoneLeft] = useState(false);
  const [result, setResult] = useState('');
  const [isPreviewVisible, setIsPreviewVisible] = useState(true);
  const [openAccordionId, setOpenAccordionId] = useState(null);

  const onDrop = useCallback(acceptedFiles => {
    const file = acceptedFiles[0];
    if (file && file.type.startsWith('image/')) {
      setFiles([{
        ...file,
        preview: URL.createObjectURL(file)
      }]);
      // Reset position on new drop
      setIsDropzoneLeft(false);
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Set analyzing and result state if necessary
    setIsDropzoneLeft(true); // Move dropzone to the left
  };

  const handleImageClick = () => {
    // Center dropzone when a previewed image is clicked
    setIsDropzoneLeft(false);
  };

  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    onDrop,
    multiple: false,
  });

  const handleReUpload = () => {
    setIsPreviewVisible(false);
    setTimeout(() => {
      setFiles([]);
      setIsPreviewVisible(true);
      setIsDropzoneLeft(false); // Explicitly re-center the drop-zone
    }, 300);
  };
  
   //12th Feb 24///////////////////////////////////////
 
  // accordian function
  
  const toggleAccordion = (id) => {
    if (openAccordionId === id) {
      setOpenAccordionId(null); // Close the current accordion if it's already open
    } else {
      setOpenAccordionId(id); // Open the clicked accordion
    }
  };
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async (e) => {
      
      const endpointPath = "transaction";
      try {
        const data = await fetchDataFromBackend(endpointPath);
        setData(data);
      } catch (error) {
        console.error("Failed to send data:", error);
      }
    };
    fetchData();
  }, []);

  const handleLogout = async (e) => {
    const endpointPath = "logout";

    try {
      const data = await fetchDataFromBackend(endpointPath);
      alert(data.message);
      navigate("/");
    } catch (error) {
      console.error("Failed to send data:", error);
    }
  };

  return (
    <div className="upload-container">
      <Navigation />
      <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''} ${isDropzoneLeft ? 'dropzone-left' : ''}`}>
        {files.length === 0 && (
          <>
            <Lottie options={defaultOptions1} height={200} width={200} />
            <input {...getInputProps()} />
            {isDragActive ? <p>Drop the images here ...</p> : <p>Drag 'n' drop some images here, or click to select images</p>}
          </>
        )}

        {files.map(file => (
          <div key={file.name} className={`preview-image ${isPreviewVisible ? '' : 'hidden'}`} onClick={handleImageClick}>
            <img src={file.preview} alt="Preview" />
            <p>{file.name}</p>
          </div>
        ))}

        {files.length > 0 && (
          <div className="button-group">
            <button onClick={handleSubmit} className="submit-button">Analyze Image</button>
            <button onClick={() => setFiles([])} className="submit-button">Re-upload Image</button>
          </div>
        )}
      </div>
      
      <div className="App">

      <div classname="Appcontent">
          <h2>TRANSACTIONS</h2>
          {data.map((item, index) => (
            <Accordion
              key={index}
              data={item}
              isOpen={openAccordionId === index}
              toggleAccordion={() => toggleAccordion(index)}
            />
          ))}
      </div>
      </div>
      
      <Footer />


    </div>

    
  );
  

};

export default Upload;

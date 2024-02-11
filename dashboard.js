// components import
import Navigation from "../inc/navigation";
import Accordion from "./Accordion"; 
import { fetchDataFromBackend } from "../inc/api_GETservice";
import { sendDataToBackend } from "../inc/apiService";

// css import
import "../pagesCSS/UploadCSS.css";
import "../pagesCSS/DashboardCSS.css";

// React hooks import
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


// bootsrap import
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Modal, Form, Image } from "react-bootstrap";


const Dashboard = () => {
  // catch user id
  const urlParams = new URLSearchParams(window.location.search);
  const userid = urlParams.get("userid");

  // naviagte
  const navigate = useNavigate();

  /////////////////////////////////////////
  // upload image perticular
  const [selectedImage, setSelectedImage] = useState(null); // img url dor preview
  const [selectedFile, setSelectedFile] = useState(null); // file to be sent too backend

  const [result, setResult] = useState(null); // keeps the classified result

  const [progress, setProgress] = useState(0);
  const [showModal, setShowModal] = useState(false);



  // handle image change 
  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedImage(URL.createObjectURL(event.target.files[0]));
      setSelectedFile(event.target.files[0]);
    } else {
      setSelectedImage(null);
    }
  };


  // handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress === 100) {
          clearInterval(interval);
          setShowModal(true);
          return 100;
        }
        return Math.min(prevProgress + 10, 100);
      });
    }, 200);

    //send upload image too backend
    const formData = new FormData();
    formData.append("image", selectedFile);

    const endpointPath = "classify";

    try {
      const data = await sendDataToBackend(endpointPath, formData);
      setResult(data.message);
    } catch (error) {
      console.error("Failed to send data:", error);
    }
  };

  const handleCloseModal = async (e) => {
    const endpointPath = "addtoblockchain";

    try {
      const data = await fetchDataFromBackend(endpointPath);
      alert(data.message);
      setShowModal(false);
      window.location.reload();
    } catch (error) {
      console.error("Failed to send data:", error);
    }
  };

  /////////////////////////////////////////

  // data set from backend
  const [data, setData] = useState([]);

  // accoordian functioon
  const [openAccordionId, setOpenAccordionId] = useState(null);
  const toggleAccordion = (id) => {
    if (openAccordionId === id) {
      setOpenAccordionId(null); // Close the current accordion if it's already open
    } else {
      setOpenAccordionId(id); // Open the clicked accordion
    }
  };

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
    <div className="dashcontainer mt-5">
      <div className="mb-4">
        {/*<h1 className="dash">DASHBOARD</h1>*/}
        <Navigation />
        {/* <h1>Welcome,{userid}</h1> */}
        <h1 id="welcome" >Welcome, user-id ! <button class = "logout" onClick={handleLogout}>Logout</button> </h1>
        

      </div>
      {/* ///////////////////////////////////////// */}
      <div className="testCard">
        <Form onSubmit={handleSubmit} className="fileUpload">
          <div className="d-flex align-items-center justify-content-center">
            {" "}
            {/* Adjust flex properties */} 
            {/* Image container */}
            <div className="image-container">
              {selectedImage ? (
                <>
                  <Image
                    className="img-preview"
                    src={selectedImage}
                    alt="Preview"
                    thumbnail
                  />
                  <a
                    href="#!"
                    onClick={() => setSelectedImage(null)}
                    className="reupload-link"
                  >
                    Reupload Image
                  </a>
                </>
              ) : (
                <button class = "uploadbtn"><label className="fileSelect" htmlFor="fileInput">Upload an Image</label>
                  <input
                    type="file"
                    multiple
                    className="fileElem"
                    id="fileInput"
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                  />
                </button>
              )}
            </div>
            {/* Submit button container */}
            {selectedImage && (
              <div className="submit-container ms-3">
                {" "}
                {/* Added container for submit button */}
                <Button type="submit" className="submit-button">
                  Submit
                </Button>
              </div>
            )}
          </div>
          <progress
            value={progress}
            max="100"
            label={`${progress}%`}
            id="uploadProgress"
            className="w-100 mt-3"
          ></progress>
        </Form>
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header>
          <Modal.Title>Image Classification Result</Modal.Title>
        </Modal.Header>
        <Modal.Body>{result}</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseModal}>
            Add to Blockchain
          </Button>
        </Modal.Footer>
      </Modal>
      {/* /////////////////////////////////////////// */}
      <div className="App">

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
  );
};

export default Dashboard;

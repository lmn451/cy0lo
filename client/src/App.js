import React, { useState, useRef } from "react";
import "./App.css";
import { FileUploader } from "react-drag-drop-files";

function App() {
  const [fileData, setFileData] = useState();
  const [link, setLink] = useState();
  const timeRef = useRef();

  const onSubmitHandler = (e) => {
    e.preventDefault();
    if (!fileData) return;
    const data = new FormData();
    data.append("memes", fileData);
    fetch("http://localhost:3001/v1/file", {
      method: "PUT",
      body: data,
      headers: {
        retentiontime: timeRef.current.value,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setLink(res.link);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="App">
      <h1>Upload memes</h1>
      {link && (
        <div>
          <span>
            Link to previously uploaded file:
            {
              <a href={link} target="_blank" rel="noreferrer">
                {link}
              </a>
            }
          </span>
          <button
            onClick={() => {
              navigator.clipboard.writeText(link);
            }}
          >
            Copy to clipboard
          </button>
        </div>
      )}
      <form onSubmit={onSubmitHandler}>
        <FileUploader
          handleChange={(file) => setFileData(file)}
          name="memes"
          children={
            <div
              style={{
                width: "200px",
                height: "200px",
                margin: "0 auto",
                border: "1px dotted red",
              }}
            >
              Drag and drop here or click to upload file
            </div>
          }
        />
        <input
          type="number"
          ref={timeRef}
          placeholder="Input retention time in seconds"
          title="Input retention time in seconds"
        />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
}

export default App;

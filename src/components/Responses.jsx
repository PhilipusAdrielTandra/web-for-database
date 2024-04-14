import React, { useState, useEffect } from 'react';

const ContentList = () => {
  const [contents, setContents] = useState([]);
  const [existingTag, setExistingTag] = useState('');
  const [newResponse, setNewResponse] = useState('');
  const [updateResponseId, setUpdateResponseId] = useState('');
  const [updateResponseValue, setUpdateResponseValue] = useState('');
  const [deleteResponseId, setDeleteResponseId] = useState('');
  const [addMessage, setAddMessage] = useState('');
  const [updateMessage, setUpdateMessage] = useState('');
  const [deleteMessage, setDeleteMessage] = useState('');

  useEffect(() => {
    const fetchContents = async () => {
      try {
        const response = await fetch('http://localhost:8000/responses');
        const data = await response.json();
        setContents(data);
      } catch (error) {
        console.error('Error fetching contents:', error);
      }
    };

    fetchContents();
  }, []);

  const [tag, setTag] = useState('');
  const [response, setResponse] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const addResponse = async () => {
    try {
      const responseFromServer = await fetch(`http://localhost:8000/responses/${tag}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ response: response })
      });
      const data = await responseFromServer.json();
      setSuccessMessage(data.message);
      setErrorMessage('');
    } catch (error) {
      setErrorMessage('Error adding response: ' + error.message);
      setSuccessMessage('');
    }
  };

  const updateResponse = async () => {
    try {
      const response = await fetch(`http://localhost:8000/responses/${updateResponseId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ response: updateResponseValue })
      });
      const data = await response.json();
      setUpdateMessage(data.message);
    } catch (error) {
      console.error('Error updating response:', error);
    }
  };

  const deleteResponse = async () => {
    try {
      const response = await fetch(`http://localhost:8000/responses/${deleteResponseId}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      setDeleteMessage(data.message);
    } catch (error) {
      console.error('Error deleting response:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className='text-2xl font-bold mb-4'> Responses </h1>
      <div>
      <h2 className="text-md font-semibold mb-1"> Add Response to Existing Tag </h2>
        <label htmlFor="tag">Tag:</label>
        <input type="text" id="tag" value={tag} onChange={(e) => setTag(e.target.value)} placeholder="Enter existing tag" className="mr-2"/>
        <label htmlFor="response">Response:</label>
        <input type="text" id="response" value={response} onChange={(e) => setResponse(e.target.value)} placeholder="Enter response" className="mr-2"/>
        <button onClick={addResponse} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Add Response
        </button>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      </div>

      <div>
        <h2 className="text-md font-semibold mb-1">Update Response</h2>
        <input type="text" value={updateResponseId} onChange={(e) => setUpdateResponseId(e.target.value)} placeholder="Enter response ID" className="mr-2" />
        <input type="text" value={updateResponseValue} onChange={(e) => setUpdateResponseValue(e.target.value)} placeholder="Enter new response" className="mr-2" />
        <button onClick={updateResponse} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Update Response
        </button>
        <div className="message" id="updateMessage">{updateMessage}</div>
      </div>

      <div>
        <h2 className="text-md font-semibold mb-1">Delete Response</h2>
        <input type="text" value={deleteResponseId} onChange={(e) => setDeleteResponseId(e.target.value)} placeholder="Enter response ID" className="mr-2" />
        <button onClick={deleteResponse} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Delete Response
        </button>
        <div className="message" id="deleteMessage">{deleteMessage}</div>
      </div>

    </div>
  );
};

export default ContentList;
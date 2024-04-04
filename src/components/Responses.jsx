import React, { useState, useEffect } from 'react';

const ContentList = () => {
  const [contents, setContents] = useState([]);
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

  const addResponse = async () => {
    try {
      const response = await fetch('http://localhost:8000/responses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ response: newResponse })
      });
      const data = await response.json();
      setAddMessage(data.message);
    } catch (error) {
      console.error('Error adding response:', error);
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
      <h1 className="text-2xl font-bold mb-4">Responses</h1>
      <div>
        <h2 className="text-md font-semibold mb-1">Add New Response</h2>
        <input type="text" value={newResponse} onChange={(e) => setNewResponse(e.target.value)} placeholder="Enter response" className="mr-2" />
        <button onClick={addResponse} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Add Response
        </button>
        <div className="message" id="addMessage">{addMessage}</div>
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
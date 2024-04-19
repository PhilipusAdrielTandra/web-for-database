import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateTag = () => {
  const [tagName, setTagName] = useState('');
  const [tagPatterns, setTagPatterns] = useState([]);
  const [tagResponses, setTagResponses] = useState([]);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const requestData = {
        tag: tagName,
        data: {
          patterns: tagPatterns,
          responses: tagResponses
        },
      };
      console.log('Request Data:', requestData);

      await axios.post('http://localhost:8000/tags/', requestData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      alert(`Tag '${tagName}' created successfully`);
      navigate('/'); // Redirect to home page after successful tag creation
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while creating the tag');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-1">Create New Tag</h1>
      <p className='opacity-50'>Patterns and responses should be separated by commas</p>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="tagName" className="block text-sm font-semibold mb-1">Tag Name:</label>
          <input type="text" id="tagName" className="border rounded-md px-3 py-2 w-full" value={tagName} onChange={(e) => setTagName(e.target.value)} />
        </div>
        <div className="mb-4">
          <label htmlFor="patterns" className="block text-sm font-semibold mb-1">Patterns:</label>
          <input type="text" id="patterns" className="border rounded-md px-3 py-2 w-full" value={tagPatterns.join(',')} onChange={(e) => setTagPatterns(e.target.value.split(','))} />
        </div>
        <div className="mb-4">
          <label htmlFor="responses" className="block text-sm font-semibold mb-1">Responses:</label>
          <input type="text" id="responses" className="border rounded-md px-3 py-2 w-full" value={tagResponses.join(',')} onChange={(e) => setTagResponses(e.target.value.split(','))} />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">Create Tag</button>
      </form>
    </div>
  );
};

export default CreateTag;

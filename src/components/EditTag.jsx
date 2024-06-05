import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditTag = () => {
  const { id } = useParams(); 
  const [tagName, setTagName] = useState('');
  const [tagPatterns, setTagPatterns] = useState([]);
  const [tagResponses, setTagResponses] = useState([]);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTagDetails = async () => {
      try {
        const response = await fetch(`http://localhost:8000/tags/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch tag details');
        }
        const tagDetails = await response.json();
        setTagName(tagDetails.tag);
        setTagPatterns(tagDetails.patterns);
        setTagResponses(tagDetails.responses);
      } catch (error) {
        console.error('Error fetching tag details:', error);
      }
    };

    fetchTagDetails();
  }, [id]); 

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const requestData = {
        tag: tagName,
        data: {
          patterns: tagPatterns,
          responses: tagResponses,
        },
      };
  
      await axios.put(`http://localhost:8000/tags/${id}`, requestData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      alert(`Tag with ID ${id} updated successfully`);
      navigate('/');
    } catch (error) {
      console.error('Error:', error);
      if (error.response && error.response.status === 422) {
        setError('Invalid input data. Please check your inputs and try again.');
      } else {
        setError('An error occurred while updating the tag. Please try again later.');
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Edit Tag</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="tagName" className="block text-sm font-semibold mb-1">Tag Name:</label>
          <input type="text" id="tagName" className="border rounded-md px-3 py-2 w-full" value={tagName} onChange={(e) => setTagName(e.target.value)} required />
        </div>
        <div className="mb-4">
          <label htmlFor="tagPatterns" className="block text-sm font-semibold mb-1">Tag Patterns (comma-separated):</label> 
          <textarea id="tagPatterns" className="border rounded-md px-3 py-2 w-full h-24" value={tagPatterns.join(',')} onChange={(e) => setTagPatterns(e.target.value.split(','))} required />
        </div>
        <div className="mb-4">
          <label htmlFor="tagResponses" className="block text-sm font-semibold mb-1">Tag Responses (comma-separated):</label> 
          <textarea id="tagResponses" className="border rounded-md px-3 py-2 w-full h-24" value={tagResponses.join(',')} onChange={(e) => setTagResponses(e.target.value.split(','))} required />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">Update Tag</button>
      </form>
    </div>
  );
};

export default EditTag;

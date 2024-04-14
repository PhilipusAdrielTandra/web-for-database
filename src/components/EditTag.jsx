import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const EditTag = () => {
  const { id } = useParams(); // Extract tagId from URL parameter
  const [tagName, setTagName] = useState('');
  const [tagPatterns, setTagPatterns] = useState({});
  const [tagResponses, setTagResponses] = useState({});

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
        // Optionally, you can redirect the user to an error page or display an error message
      }
    };

    fetchTagDetails();
  }, [id]); // Fetch tag details when tagId changes

  // Function to handle form submission for updating the tag
  const handleSubmit = async (event) => {
    e.preventDefault();
    try {
      await axios.put(`/tags/${tagId}`, { tag: tagName, patterns: patterns, responses: responses });
      alert(`Tag with ID ${tagId} updated successfully`);
    } catch (error) {
      if (error.response) {
        alert(`Error: ${error.response.data.detail}`);
      } else {
        alert('An error occurred while updating the tag');
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-1">Edit Tag</h1>
      <p className='opacity-50'>Responses and patterns are seperated by ","</p>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="tagName" className="block text-sm font-semibold mb-1">Tag Name:</label>
          <input type="text" id="tagName" className="border rounded-md px-3 py-2 w-full" value={tagName} onChange={(e) => setTagName(e.target.value)} />
        </div>
        <div className="mb-4">
          <label htmlFor="tagPatterns" className="block text-sm font-semibold mb-1">Tag Name:</label>
          <input type="text" id="tagPatterns" className="border rounded-md px-3 py-2 w-full" value={tagPatterns} onChange={(e) => setTagPatterns(e.target.value)} />
        </div>
        <div className="mb-4">
          <label htmlFor="tagResponses" className="block text-sm font-semibold mb-1">Tag Name:</label>
          <input type="text" id="tagResponses" className="border rounded-md px-3 py-2 w-full" value={tagResponses} onChange={(e) => setTagResponses(e.target.value)} />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">Update Tag</button>
      </form>
    </div>
  );
};

export default EditTag;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ContentList = () => {
  const [contents, setContents] = useState([]);

  useEffect(() => {
    const fetchContents = async () => {
      try {
        const response = await fetch('http://localhost:8000/contents');
        const data = await response.json();
        setContents(data);
      } catch (error) {
        console.error('Error fetching contents:', error);
      }
    };

    fetchContents();
  }, []);

  const deleteTag = async (tagId) => {
    try {
      const response = await fetch(`http://localhost:8000/tags/${tagId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        // Remove the deleted tag from the UI
        setContents(contents.filter((content) => content._id !== tagId));
      } else {
        console.error('Failed to delete tag');
      }
    } catch (error) {
      console.error('Error deleting tag:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Contents</h1>
      <ul>
        {contents.map((content, index) => (
          <li key={index} className="mb-2">
            <div className="bg-gray-100 p-4 rounded-lg">
            <div className='flex justify-between'>
                <h2 className="text-left text-lg font-bold mb-2">{content.tag}</h2>
                <div>
                  <Link to={`/edit/${content._id}`} className='mr-2'>Edit</Link>
                  <a className='mr-2 hover:cursor-pointer' onClick={() => deleteTag(content._id)}>Delete</a>
                </div>
            </div>
              <div>
                <h3 className="text-md font-semibold mb-1">Patterns:</h3>
                <ul>
                  {content.patterns.map((pattern, i) => (
                    <li key={i} className="mb-1">
                      {pattern}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-md font-semibold mb-1">Responses:</h3>
                <ul>
                  {content.responses.map((response, i) => (
                    <li key={i} className="mb-1">
                      {response}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

const App = () => {
  return (
    <div>
      <ContentList />
    </div>
  );
};

export default App;

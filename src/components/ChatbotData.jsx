import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ContentList = () => {
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContents = async () => {
      try {
        const response = await fetch('http://localhost:8000/contents');
        const data = await response.json();
        setContents(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching contents:', error);
      }
    };

    fetchContents();
  }, []);

  const deleteTag = async (tagId, index) => {
    try {
      const response = await fetch(`http://localhost:8000/tags/${tagId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        const updatedContents = [...contents];
        updatedContents.splice(index, 1);
        setContents(updatedContents);
      } else {
        console.error('Failed to delete tag');
      }
    } catch (error) {
      console.error('Error deleting tag:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8" style={{ opacity: loading ? 0 : 1, transition: 'opacity 2s ease' }}>
      <div className='flex justify-between'>
        <h1 className="text-2xl font-bold mb-4">Contents</h1>
        <Link to={'/create'}>
          <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded m-2">Create tag</button>
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {contents.map((content, index) => (
          <div key={index} className="bg-gray-100 p-4 rounded-lg flex flex-col justify-between h-full" style={{ transition: 'opacity 0.3s ease' }}>
            <div className='flex justify-between'>
              <h2 className="text-left text-lg font-bold mb-2 truncate overflow-hidden whitespace-nowrap text-ellipsis w-full">{content.tag}</h2>
            </div>
            <div>
              <h3 className="text-md font-semibold mb-1">Patterns:</h3>
              <ul>
                {content.patterns.slice(0,2).map((pattern, i) => (
                  <li key={i} className="mb-1">
                    {pattern}
                    ...
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-md font-semibold mb-1">Responses:</h3>
              <ul>
                {content.responses.slice(0,2).map((response, i) => (
                  <li key={i} className="truncate w-full overflow-hidden whitespace-nowrap text-ellipsis mb-1">
                    {response}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-6 ">
              <Link to={`/edit/${content._id}`}>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">Details</button>
              </Link>
              <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={() => deleteTag(content._id, index)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
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

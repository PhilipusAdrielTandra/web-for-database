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
      <div className='flex justify-between'>
        <h1 className="text-2xl font-bold mb-4">Contents</h1>
        <Link to={'/create'}>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-2">Create tag</button>    
        </Link>  
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {contents.map((content, index) => (
          <div key={index} className="bg-gray-100 p-4 rounded-lg flex flex-col justify-between h-full">
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
            <div className="mt-auto">
              <Link to={`/tags/${content._id}`}>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Details</button>
                <Link to={`/edit/${content._id}`} className='mr-2'>Edit</Link>
                  <a className='mr-2 hover:cursor-pointer' onClick={() => deleteTag(content._id)}>Delete</a>    
              </Link>  
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

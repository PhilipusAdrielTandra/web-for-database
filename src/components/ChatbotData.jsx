import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Modal from './Modal';

const ContentList = () => {
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedContentIndex, setSelectedContentIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

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

  const openModal = (index) => {
    setSelectedContentIndex(index);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedContentIndex(null); 
  };

  const deleteTag = async () => {
    try {
      if (selectedContentIndex !== null) {
        const tagId = contents[selectedContentIndex]._id;
        const response = await fetch(`http://localhost:8000/tags/${tagId}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          const updatedContents = [...contents];
          updatedContents.splice(selectedContentIndex, 1);
          setContents(updatedContents);
        } else {
          console.error('Failed to delete tag');
        }
      }
    } catch (error) {
      console.error('Error deleting tag:', error);
    } finally {
      closeModal(); 
    }
  };

  const filteredContents = contents.filter(content => 
    content.tag.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8" style={{ opacity: loading ? 0 : 1, transition: 'opacity 2s ease' }}>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Contents</h1>
        <div className="flex">
          <input 
            type="text" 
            placeholder="Search by tag..." 
            className="border border-gray-300 rounded py-2 px-4 mr-4" 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Link to={'/create'}>
            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2">Create tag</button>
          </Link>
          <Link to={'/unknown'}>
            <button className="bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded">Unrecognized messages</button>
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredContents.map((content, index) => (
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
            <div className="mt-6">
              <Link to={`/edit/${content._id}`}>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">Details</button>
              </Link>
              <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={() => openModal(index)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        onConfirm={deleteTag}
      />
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

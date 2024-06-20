import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Unknown = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      fetch('http://localhost:8000/unknown/')
        .then(response => response.json())
        .then(data => {
          setData(data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
          setLoading(false);
        });
    }, []);

    return (
      <div className="container mx-auto p-4" style={{ opacity: loading ? 0 : 1, transition: 'opacity 2s ease' }}>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Unknown Data</h1>
          <Link to={'/'}>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Chatbot Data
            </button>
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {data.map(item => (
            <div key={item._id} className="bg-white shadow-md rounded p-4 border-4 border-black">
              <p><strong>User ID:</strong> {item.user_id}</p>
              <ol className="list-decimal list-inside mt-2">
                {item.data.map((dataItem, index) => (
                  <li key={index} className="border rounded-md p-2 border-black">{dataItem}</li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </div>
    );
};

export default Unknown;

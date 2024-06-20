import React, { useEffect, useState } from 'react';

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
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Unknown Data</h1>
          <div className="grid grid-cols-1 gap-4">
            {data.map(item => (
              <div key={item._id} className="bg-white shadow-md rounded p-4">
                <p><strong>Tag:</strong> {item.tag}</p>
                <p><strong>User ID:</strong> {item.user_id}</p>
                <p><strong>Data:</strong> {item.data.join(', ')}</p>
              </div>
            ))}
          </div>
        </div>
      );
    };

export default Unknown
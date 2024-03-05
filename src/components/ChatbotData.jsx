import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ChatbotData() {
  const [responses, setResponses] = useState([]);
  const [patterns, setPatterns] = useState([]);


  useEffect(() => {
    axios.get('http://127.0.0.1:8000/responses')
      .then(response => {
        console.log(response.data);
        setResponses(response.data);
      })
      .catch(err => {
        console.log(err.message);
      });

    axios.get('http://127.0.0.1:8000/data')
      .then(response => {
        console.log(response.data);
        setPatterns(response.data);
      })
      .catch(err => {
        console.log(err.message);
      });
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Response Data:</h1>
      <table className="table-auto border-collapse w-full">
        <thead>
          <tr>
            <th className="border px-4 py-2">Tag ID</th>
            <th className="border px-4 py-2">Response</th>
          </tr>
        </thead>
        <tbody>
          {responses.map(response => (
            <tr key={response.id}>
              <td className="border px-4 py-2">{response.tag_id}</td>
              <td className="border px-4 py-2">{response.response}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h1 className="text-2xl font-bold mt-8 mb-4">Patterns Data:</h1>
      <table className="table-auto border-collapse w-full">
        <thead>
          <tr>
            <th className="border px-4 py-2">Tag ID</th>
            <th className="border px-4 py-2">Pattern</th>
          </tr>
        </thead>
        <tbody>
          {patterns.map(pattern => (
            <tr key={pattern.id}>
              <td className="border px-4 py-2">{pattern.tag_id}</td>
              <td className="border px-4 py-2">{pattern.pattern}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ChatbotData;

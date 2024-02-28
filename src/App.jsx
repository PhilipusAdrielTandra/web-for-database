import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/responses')
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setPosts(data);
      })
      .catch(err => {
        console.log(err.message);
      });
  }, []);

  return (
    <div>
      <h1>Response Data:</h1>
      {posts.map(post => (
        <div className="post-card" key={post.id}>
          <h2 className="post-title">Tag ID: {post.tag_id}</h2>
          <p className="post-body">{post.response}</p>
        </div>
      ))}
    </div>
  );
}

export default App;

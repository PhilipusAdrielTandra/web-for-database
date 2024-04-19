import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import EditTag from './components/EditTag';
import CreateTag from './components/CreateTag';
import ChatbotData from './components/ChatbotData';
import Chatbot from './components/ChatBot';
import Responses from './components/Responses'
function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<ChatbotData/>}/>
          <Route path="/chatbot" element={<Chatbot/>}/>
          <Route path="/responses" element={<Responses/>}/>
          <Route path="/edit/:id" element={<EditTag/>}/>
          <Route path="/create" element={<CreateTag/>}/>

        </Routes>
      </div>
    </Router>
  )
}

export default App
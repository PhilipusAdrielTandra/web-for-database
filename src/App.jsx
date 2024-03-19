import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ChatbotData from './components/ChatbotData';
import Chatbot from './components/ChatBot';
function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Chatbot/>}/>
          {/* <Route path="/create" element={<CreateTransactions/>}/>
          <Route path="/edit/:id" element={<EditTransaction/>}/> */}
        </Routes>
      </div>
    </Router>
  )
}

export default App
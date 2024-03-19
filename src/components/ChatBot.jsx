import React, { useState } from 'react';

const Chatbot = () => {
  const [userInput, setUserInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      message: 'Faculty: Hi, welcome to Predoctoral Implant Program. How may I assist you today?',
    },
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender: 'user',
      message: `You: ${userInput}`,
    };

    setChatMessages((prevMessages) => [...prevMessages, newMessage]);
    setUserInput('');
    // Simulating the response from the server
    // In a real application, you would make an AJAX request here
    setTimeout(() => {
      const botResponse = 'Bot: This is a sample bot response.';
      const newBotMessage = {
        id: Date.now() + 1,
        sender: 'bot',
        message: botResponse,
      };
      setChatMessages((prevMessages) => [...prevMessages, newBotMessage]);
    }, 500); // Simulating a delay for the bot response
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-white">
      <h1 className="text-center text-3xl font-bold my-6">Chatbot</h1>
      <div id="chat-container" className="max-w-screen-sm w-full bg-[#1e1553] rounded-lg shadow-md p-8 relative">
        <div id="chat-area" className="w-full">
          {chatMessages.map((message) => (
            <div key={message.id} className={`message-container ${message.sender === 'bot' ? 'justify-start' : 'justify-start'} flex`}>
              <div className={`message ${message.sender === 'bot' ? 'bg-[#51515a] rounded-lg mb-2 p-2 text-white' : 'bg-[#7678cf] rounded-lg mb-2 p-2 text-white'} w-auto max-w-[70%]`}>
                {message.message}
              </div>
            </div>
          ))}
        </div>
        <form id="user-input-form" onSubmit={handleSubmit} className="flex mt-4">
          <input
            type="text"
            id="user-input"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type your message..."
            autoComplete="off"
            className="flex-grow p-4 border border-gray-300 rounded-l-lg focus:outline-none"
          />
          <button type="submit" className="bg-[#7678cf] text-white px-8 py-4 rounded-r-lg hover:bg-blue-700 focus:outline-none">
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chatbot;

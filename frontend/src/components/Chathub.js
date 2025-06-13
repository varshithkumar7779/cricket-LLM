import React, { useState,useRef,useEffect } from 'react';
import axios from 'axios';

const Chathub = () => {
  const [chatdata1, setChatdata1] = useState([]);
  const [email, setEmail] = useState('');
  const [chatdata, setChatdata] = useState('');

  const conversationRef = useRef(null);
  useEffect(() => {
    if (conversationRef.current) {
      conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
    }
  }, [chatdata1]);

  useEffect(() => {
    const fetchData = async () => {
      try{
        const response = await axios.post('/retrieve_chat');
        setChatdata1(response.data);
      }
      catch(error){
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);


  const handleSubmit = async (e) => {
      e.preventDefault();
      try{
        await axios.post('/store_data', { email, chatdata });
        setChatdata('');
        const response = await axios.post('/retrieve_chat');
        setChatdata1(response.data);
      }
      catch(error){
        console.error('Error sending data:', error);
      }
  };

  const handleInputChange = (e) => {
    setChatdata(e.target.value);
  };

  return (
    <div className="chathub">
        <h1>Chathub</h1>
        <div className='conversation_1' ref={conversationRef}>
            {chatdata1.map((chat, index) => (
              <div key={index} className="chat-message">
                <p><strong>{chat.email}:</strong> {chat.chatdata}</p>
              </div>
            ))}
        </div>
        <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={chatdata}
              onChange={handleInputChange}
              placeholder="Message Charlie..."
              />
            <i className="fa-solid fa-arrow-up" onClick={handleSubmit}></i>
        </form>
    </div>
  );
};

export default Chathub;
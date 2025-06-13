import React, { useState, useRef, useEffect } from 'react';
import './Home.css';
import axios from 'axios';
import LoaderComp from "./Loader.js";
import IPL from './Ipl';
import Iplscore from './Iplscore.js';
import Chathub from './Chathub.js';
import News from './News.js';

const SlowText = (props) => {
  const { speed, text } = props;
  const [placeholder, setPlaceholder] = React.useState(text[0]);
  const index = React.useRef(0);
  useEffect(() => {
      function tick() {
        index.current++;
        setPlaceholder((prev) => prev + text[index.current]);
      }
      if (index.current < text.length - 1) {
        let addChar = setInterval(tick, speed);
        return () => clearInterval(addChar);
      }
    }, [placeholder, speed, text]);
    return <span>{placeholder}</span>
}

const Home = (userDetails) => {

  const user = userDetails.user;
  const logout = () => {
    window.open(`${process.env.REACT_APP_API_URL}/auth/logout`, "_self");
  };
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [conversation, setConversation] = useState([]);
  const [opt, setOpt] = useState(false);
  const [ipl, setIpl] = useState(false);
  const [ipl1, setIpl1] = useState(false);
  const [displaychat, setDisplaychat] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [schemaId, setSchemaId] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [displayNews, setDisplayNews] = useState(false);
//  const [conversation, setConversation] = useState({ question: '', response: '' });

  const conversationRef = useRef(null);
  useEffect(() => {
    if (conversationRef.current) {
      conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
    }
  }, [conversation]);

  useEffect(() => {
    if (user && user.email && !schemaId) {
      createSchema(user.email);
    }
  }, [user, schemaId]);

  const createSchema = async (email) => {
    try {
      const res = await axios.post("http://localhost:5000/create_schema", { email });
      setSchemaId(res.data.id);
      alert(res.data.id);
    }
    catch(error){
      console.error('Error creating schema:', error);
    }
  };

  useEffect(() => {
      const fetchData = async (email) => {
        try{
          await new Promise(resolve => setTimeout(resolve, 2000));
          const response = await axios.post('http://localhost:5000/retrieve_data', { email });
          setData(response.data);
          //console.log(response.data);
        }
        catch(error){
          console.error('Error fetching data:', error);
        }
        finally{
          setLoading(false);
        }
      };
      if(user.email){
        fetchData(user.email);
      }    
    },[user.email]);

    useEffect(() => {
      if (conversationRef.current) {
        conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
      }
    }, [data]);


  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setOpt(true);
    setConversation([...conversation, { question: inputValue, response: '' }]);
    setInputValue('');
    generateResponse(inputValue);
  };

  const generateResponse = async (question) => {
    try{
      const response = await axios.post("http://localhost:5000/answer", { question });
      setIsLoading(false);
      const newConversation = { question, response: response.data };
      setConversation([...conversation, newConversation]);
      sendHistory(newConversation);
    }
    catch(e){
      console.log(e);
      setIsLoading(false);
      const errorConversation = { question, response: 'error occurred' };
      setConversation([...conversation, errorConversation]);
      sendHistory(errorConversation);
    }
  };

  const sendHistory = async (conversation) => {
    try {
      if(conversation){
        await axios.post("http://localhost:5000/history", { id: schemaId, a: [conversation] });
      }
      else{
        console.log('Missing text in either user or chatbot section');
      }
    }
    catch(e){
      console.log(e);
    }
  };

  const handleSelectHistoryItem = (index, id) => {
    setSchemaId(id);
    setIpl(false);
    setIpl1(false);

    if(data[index].list.length > 0){
      //console.log(data)
      const conversationList = data[index].list;
      setConversation(conversationList);
      //alert(conversationList);
      //console.log(conversationList);
    }
    else{
        setConversation(null);
    }
  };

  return (
    <>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css"
        integrity="sha512-z3gLpd7yknf1YoNbCzqRKc4qyor8gaKU1qmn+CShxbuBusANI9QpRohGBreCFkKxLhei6S9CQXFEbbKuqLg0DA=="
        crossOrigin="anonymous"
        referrerPolicy="no-referrer" />
      <div className="container">
        <div className="left-box">
          <h3 onClick={() => { setIpl(true);setIpl1(false);setDisplaychat(false);setDisplayNews(false); }}>Predict IPL winner</h3>
          <h3 onClick={() => { setIpl1(true);setIpl(false);setDisplaychat(false);setDisplayNews(false); }}>Predict IPL score</h3>
          <h3 onClick={() => { setIpl1(false);setIpl(false);setDisplaychat(true);setDisplayNews(false); }}>Chat Hub</h3>
          <h3 onClick={() => { setIpl(false); setIpl1(false);setDisplaychat(false);setDisplayNews(true);}}>News</h3>
          <h2 onClick={() => { setIpl1(false);setIpl(false);setDisplaychat(false);setDisplayNews(false); }}>History</h2>
          {
            <div ref={conversationRef}>
                {loading ? (
                    <LoaderComp />
                  ) : (
                    <>
                        {data.map((item, index) => (
                          item.list.length > 0 && (
                            <div key={item._id} onClick={() => handleSelectHistoryItem(index,item._id)}>
                              <p>{`History item ${index + 1}`}</p>
                            </div>
                          )
                        ))}
                    </>
                  )}
            </div>
          }
      </div>
        <div className="right-box">
          <div className="profile-container">
            <img
              onClick={() => setShowDetails(!showDetails)}
              src={user.picture}
              alt="profile"
              className='profile_img'
            />
            {showDetails && (
              <div className="user-details">
                <p><i className="fa-regular fa-circle-user"></i>{user.name}</p>
                <p><i className="fa-regular fa-envelope"></i>{user.email}</p>
                <hr className="separator" />
                <p onClick={logout} className='logout'><i className="fa-solid fa-arrow-right-from-bracket"></i>Log Out</p>
              </div>
            )}
          </div>
          <>
            <h3 onClick={() => { setIpl(false); setIpl1(false); }}><i className="fa-solid fa-paw"></i>Charlie 2.0</h3>
          </>
          {
           !ipl && !ipl1 && !displaychat && !(conversation.length>0) && (
                <div className="center-container">
                  <div className="content">
                    <i className="fa-solid fa-dog"></i>
                    <h1><SlowText speed={50} text={'Hello, ' + user.name} /></h1>
                    <h1 className='h1_1'>How can I help you today ?</h1>
                  </div>
                </div>)
          }
          {
            !ipl && !ipl1 && !displaychat && conversation.length > 0 && <>
              {opt &&
                <>
                  <div className='conversation_1' ref={conversationRef}>
                    {conversation.map((item, index) => (
                      <p key={index}>
                        {item.question && 
                            <><i className="fa-regular fa-circle-user"></i><span>You</span>
                            <p id='text_1'>{item.question}</p></>
                        }
                        {item.response && (
                          <><i className="fa-solid fa-paw" id='icon_1'></i><span>Charlie</span>
                             <p id='text_1'>{item.response}</p></>
                        )}
                      </p>
                    ))}
                    {
                      isLoading &&
                      <>
                        <div style={{ textAlign: "left", marginLeft: "10px" }}>
                          <div style={{ width: "100px" }}><LoaderComp /></div>
                        </div>
                      </>
                    }
                  </div>
                </>
              }
          </>
            }
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  placeholder="Message Charlie..."
                  />
                <i className="fa-solid fa-arrow-up" onClick={handleSubmit}></i>
              </form>
          <p className='bottom_line'>Charlie 2.0 can make mistakes. Consider checking important information.</p>
        </div>
      </div>
      {ipl && <IPL />}
      {ipl1 && <Iplscore />}
      {displaychat && <Chathub/>}
      {displayNews && <News />}
    </>
  );
}

export default Home;
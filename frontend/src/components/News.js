import React, { useEffect, useState } from 'react';
import axios from 'axios';

const News = () => {
  const [news, setNews] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.post('http://localhost:5000/news_data');
        setNews(response.data);
      } catch (error) {
        console.error('Error fetching news data:', error);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="match-news">
      <h2>TRENDING NEWS</h2>
      {news.length === 0 ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {news.map((item, index) => (
            <li key={index}>
              <a href={item.link} target="_blank" rel="noopener noreferrer">{item.headline}</a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default News;

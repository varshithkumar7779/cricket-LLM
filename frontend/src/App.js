import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
//import Home from "./pages/Home";
import Home from './components/Home';
import Login from "./components/Login";
//import Login from "./pages/Login";
//import Signup from "./pages/Signup";
import "./App.css";

function App() {
	const [user, setUser] = useState(null);

	const getUser = async () => {
		try {
			const url = `${process.env.REACT_APP_API_URL}/auth/login/success`;
			const { data } = await axios.get(url, { withCredentials: true });
			setUser(data.user._json);
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		getUser();
	}, []);

	return (
        <div className="container">
            <Router>
                <Routes>
                    <Route
                        path="/"
                        element={user ? <Home user={user} /> : <Navigate to="/login" />}
                    />
                    <Route
                        path="/login"
                        element={user ? <Navigate to="/" /> : <Login />}
                    />
                </Routes>
            </Router>
        </div>
	);
}

export default App;/*
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
                    <Route
                        path="/signup"
                        element={user ? <Navigate to="/" /> : <Signup />}
                    />

*/
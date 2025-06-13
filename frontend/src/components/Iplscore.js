import React, { useState } from 'react';
import LoaderComp from "./Loader.js";
import { venues, battingTeams, bowlingTeams, batsmen, bowlers } from './options.js';
import axios from 'axios';

const Iplscore = () => {
    const [isLoading2, setIsLoading2] = useState(false);
    const [formData2, setFormData2] = useState({
        batting_team: '',
        bowling_team: '',
        venue_2: '',
        striker: '',
        bowler: ''
    });
    const [score, setScore] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData2({
            ...formData2,
            [name]: value
        });
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        setScore('');
        setIsLoading2(true);
        try{
            console.log(formData2);
            const response = await axios.post("http://localhost:5000/ipl_score", formData2);
            console.log(response.data.score);
            setIsLoading2(false);
            setScore(response.data.score);
          }
          catch(error){
            console.error("Error occurred:", error);
            setIsLoading2(false);
            setScore('No sufficient data to predict');
          }
    };

    return (
        <div className="match-form">
            <h2>Enter Match Details</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Batting Team: </label>
                    <select name="batting_team" value={formData2.batting_team} onChange={handleChange} required>
                        <option value="">Select Batting Team</option>
                        {battingTeams.map(team => (
                            <option key={team} value={team}>{team}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>Bowling Team: </label>
                    <select name="bowling_team" value={formData2.bowling_team} onChange={handleChange} required>
                        <option value="">Select Bowling Team</option>
                        {bowlingTeams.map(team => (
                            <option key={team} value={team}>{team}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>Venue: </label>
                    <select name="venue_2" value={formData2.venue_2} onChange={handleChange} required>
                        <option value="">Select Venue</option>
                        {venues.map(venue => (
                            <option key={venue} value={venue}>{venue}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>Striker: </label>
                    <select name="striker" value={formData2.striker} onChange={handleChange} required>
                        <option value="">Select Striker</option>
                        {batsmen.map(batsman => (
                            <option key={batsman} value={batsman}>{batsman}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>Bowler: </label>
                    <select name="bowler" value={formData2.bowler} onChange={handleChange} required>
                        <option value="">Select Bowler</option>
                        {bowlers.map(bowler => (
                            <option key={bowler} value={bowler}>{bowler}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>Predicted Score: </label>
                    <p>{score}</p>
                    {isLoading2 && (
                        <div style={{ textAlign: "left", marginLeft: "10px" }}>
                            <div style={{ width: "100px" }}>
                                <LoaderComp coloripl='#333' />
                            </div>
                        </div>
                    )}
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default Iplscore;

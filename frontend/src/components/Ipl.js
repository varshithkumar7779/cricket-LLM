import React, { useState } from 'react';
import LoaderComp from './Loader';
import axios from 'axios';
const IPL = () => {
  const [isLoading1, setIsLoading1] = useState(false);
  const [formData, setFormData] = useState({
    team1: '',
    team2: '',
    venue: '',
    toss_winner: '',
    toss_decision: ''
  });
  const [winner, setWinner] = useState('');

  const teams = [
    'Chennai Super Kings',
    'Deccan Chargers',
    'Delhi Capitals',
    'Delhi Daredevils',
    'Gujarat Lions',
    'Kings XI Punjab',
    'Kochi Tuskers Kerala',
    'Kolkata Knight Riders',
    'Mumbai Indians',
    'Pune Warriors',
    'Rajasthan Royals',
    'Royal Challengers Bangalore',
    'Sunrisers Hyderabad'
  ];

  const venues = [
    'Eden Gardens',
    'Feroz Shah Kotla',
    'Wankhede Stadium',
    'M Chinnaswamy Stadium',
    'Rajiv Gandhi International Stadium, Uppal',
    'MA Chidambaram Stadium, Chepauk',
    'Sawai Mansingh Stadium',
    'Punjab Cricket Association Stadium, Mohali',
    'Dubai International Cricket Stadium',
    'Sheikh Zayed Stadium',
    'Punjab Cricket Association IS Bindra Stadium, Mohali',
    'Maharashtra Cricket Association Stadium',
    'Sharjah Cricket Stadium',
    'Dr DY Patil Sports Academy',
    'Subrata Roy Sahara Stadium',
    'M.Chinnaswamy Stadium',
    'Kingsmead',
    'Dr. Y.S. Rajasekhara Reddy ACA-VDCA Cricket Stadium'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    if (name === 'team1') {
      setFormData((prevState) => ({
        ...prevState,
        team2: prevState.team2 === value ? '' : prevState.team2,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setWinner('');
    setIsLoading1(true);

    try{
      const response = await axios.post("http://localhost:5000/ipl_winner", formData);
      console.log(response.data.winner);
      setIsLoading1(false);
      setWinner(response.data.winner);
    }
    catch(error){
      console.error("Error occurred:", error);
      setIsLoading1(false);
      setWinner('No sufficient data to predict');
    }
  };

  return (
    <div className="match-form">
      <h2>Enter Match Details</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Team 1: </label>
          <select name="team1" value={formData.team1} onChange={handleChange} required>
            <option value="">Select Team 1</option>
            {teams.map((team) => (
              <option key={team} value={team}>
                {team}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Team 2: </label>
          <select name="team2" value={formData.team2} onChange={handleChange} required>
            <option value="">Select Team 2</option>
            {teams
              .filter((team) => team !== formData.team1)
              .map((team) => (
                <option key={team} value={team}>
                  {team}
                </option>
              ))}
          </select>
        </div>
        <div className="form-group">
          <label>Venue: </label>
          <select name="venue" value={formData.venue} onChange={handleChange} required>
            <option value="">Select Venue</option>
            {venues.map((venue) => (
              <option key={venue} value={venue}>
                {venue}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Toss Winner: </label>
          <select name="toss_winner" value={formData.toss_winner} onChange={handleChange} required>
            <option value="">Select Toss Winner</option>
            {formData.team1 && <option value={formData.team1}>{formData.team1}</option>}
            {formData.team2 && <option value={formData.team2}>{formData.team2}</option>}
          </select>
        </div>
        <div className="form-group">
          <label>Toss Decision: </label>
          <select name="toss_decision" value={formData.toss_decision} onChange={handleChange} required>
            <option value="">Select Toss Decision</option>
            <option value="bat">Bat</option>
            <option value="field">Field</option>
          </select>        
        </div>
        <div className="form-group">
          <label>Winner: </label>
          <p>{winner}</p>
          {isLoading1 && (
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

export default IPL;
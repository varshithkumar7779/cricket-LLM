const { cricket1,cricket2 } = require('./mongo');
const express = require('express');
const { spawn } = require('child_process');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

app.post('/answer', async (req, res) => {
    const { question } = req.body;
    const pythonProcess = spawn('python', ['model1.py', question]);
    let answer = '';

    pythonProcess.stdout.on('data', (data) => {
        answer += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    pythonProcess.on('close', async (code) => {
        if (code !== 0) {
            return res.status(500).json("Failed to process query");
        }
        let jsonResponse;
        try {
            jsonResponse = JSON.parse(answer);
        }
        catch (err) {
            console.error("Error parsing JSON:", err);
            return res.status(500).json("Error parsing JSON response from Python script");
        }
        try {
            console.log(question);
            res.json(jsonResponse.results[0].text);
        }
        catch (err) {
            console.error(err);
            res.status(500).json('An error occurred');
        }
    });
});

app.post('/retrieve_data', async (req, res) => {
    const { email } = req.body;
    console.log('Received email_var:', email);
    try {
        const data = await cricket1.find({ email: email });
        //const data = await cricket1.find({ email }).lean(); // .lean() for a plain JavaScript object
        //console.log('Fetched data from DB:', data);
        res.json(data);
    }
    catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ message: 'Error fetching data' });
    }
});

app.post('/history', async (req, res) => {
    const { id, a } = req.body;
    try {
        const result = await cricket1.updateOne(
            { _id: id },
            { $push: { list: { $each: a } } },
            { upsert: true }
        );
        res.status(200).json('Data inserted successfully');
    }
    catch (err) {
        console.error(err);
        res.status(500).json('An error occurred');
    }
});

/*
app.post('/history', async (req, res) => {
    const { b, a } = req.body;
    try {
        await cricket1.insertMany([{ email: b, list: a }]);
        res.status(200).json('Data inserted successfully');
    }
    catch (err) {
        console.error(err);
        res.status(500).json('An error occurred');
    }
});*/

app.post('/create_schema', async (req, res) => {
    const { email } = req.body;
    try {
        const result = await cricket1.insertMany([{ email: email, list: [] }]);
        const newUser = result[0]; // `insertMany` returns an array, get the first element
        res.status(200).json({ message: 'Schema created successfully', id: newUser._id });
    }
    catch (error) {
        console.error('Error creating schema:', error);
        res.status(500).json({ message: 'Error creating schema' });
    }
});

app.post('/retrieve_chat', async (req, res) => {
    try{
        const data = await cricket2.find();
        res.json(data);
    }
    catch(error){
        console.error('Error fetching data:', error);
        res.status(500).json({ message: 'Error fetching data' });
    }
});

app.post('/store_data', async (req, res) => {
    const { email,chatdata } = req.body;
    try{
        await cricket1.insertMany([{ email: email, chatdata:chatdata }]);
    }
    catch(error){
        console.error('Error creating schema:', error);
        res.status(500).json({ message: 'Error creating schema' });
    }
});

app.post('/ipl_winner', async (req, res) => {
    const { team1, team2, venue, toss_winner, toss_decision } = req.body;
    const pythonProcess = spawn('python', ['ipl_winner.py', team1, team2, venue, toss_winner, toss_decision]);
    let answer = '';
    pythonProcess.stdout.on('data', (data) => {
        answer += data.toString();
    });
    
    pythonProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });
    
    pythonProcess.on('close', (code) => {
        if(code !== 0){
            res.status(500).json({ error: 'Python script failed' });
        }
        else{
            console.log()
            res.json({ winner: answer.trim() });
        }
    });
});

app.post('/ipl_score', async (req, res) => {
    const {batting_team, bowling_team, venue_2, striker, bowler} = req.body;
    console.log(batting_team, bowling_team, venue_2, striker, bowler);
    
    const pythonProcess = spawn('python', ['ipl_score.py', batting_team, bowling_team, venue_2, striker, bowler]);
    let answer = '';
    
    pythonProcess.stdout.on('data', (data) => {
        answer += data.toString();
    });
    
    pythonProcess.on('close', (code) => {
        if(code !== 0){
            res.status(500).json({ error: 'Python script failed' });
        }
        else{
            const predictedScoreMatch = answer.match(/Predicted Score:\s*(\d+)/);
            const predictedScore = predictedScoreMatch ? predictedScoreMatch[1] : null;
            console.log(predictedScoreMatch,predictedScore);
            if (predictedScore) {
                res.json({ score: predictedScore.trim() });
            } else {
                res.status(500).json({ error: 'Could not extract score from Python script output' });
            }
        }
    });
});

app.post('/news_data', async (req, res) => {
    const pythonProcess = spawn('python', ['news.py']);
    let newsData = '';
    console.log("eerce");
    pythonProcess.stdout.on('data', (data) => {
        newsData += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    pythonProcess.on('close', (code) => {
        if(code!==0){
            return res.status(500).json({ error: 'Python script failed' });
        }
        try{
            const parsedData = JSON.parse(newsData);
            res.json(parsedData);
        }
        catch(error){
            console.error('Error parsing JSON:', error);
            res.status(500).json({ error: 'Failed to parse news data' });
        }
    });
});

app.listen(5000,'0.0.0.0', () => {
    console.log(`Server is running on port 5000`);
});

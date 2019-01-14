'use strict'

const express = require('express');
const morgan = require('morgan');
const bodyParser = require("body-parser");

const DBAbstraction = require('./DBAbstraction');

const db = new DBAbstraction('mongodb://localhost:27017');

const app = express();

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/addScore', async (req, res) => {
    
    const teamOne = req.body.teamOne;
    const scoreOne = req.body.scoreOne;
    const teamTwo = req.body.teamTwo;
    const scoreTwo = req.body.scoreTwo;
    const date = req.body.date;
    const locations = req.body.locations;

    await db.insertScores(teamOne,scoreOne,teamTwo,scoreTwo,date,locations);

    res.json({"result": "success"});
});


//Add a GET route to get all games by name, date, or location using query string parameters.
app.get('/getName/:name', async (req,res) => {
    try{
        const games = await db.getByName(req.params.name);
        if(games) {
            res.json(games);
        } else {
            res.json({"results": "none"});
        }
    }catch (err) {
        res.json({"results": "bad"});
    }
});

app.get('/getDate/:date', async (req,res) => {
    try{
        const games = await db.getByDate(req.params.date);
        if(games) {
            res.json(games);
        } else {
            res.json({"results": "none"});
        }
    }catch (err) {
        res.json({"results": "bad"});
    }
});

app.get('/getLocation/:locations', async (req,res) => {
    try{
        const games = await db.getByLocation(req.params.locations);
        if(games) {
            res.json(games);
        } else {
            res.json({"results": "none"});
        }
    }catch (err) {
        res.json({"results": "bad"});
    }
});

app.get('/getScores', async (req,res) =>{
    try {
        const allScores = await db.getAllScores();
        if(allScores) {
            res.json(allScores);
        } else {
            res.json({"results": "none"});
        }
    } catch (err) {
        res.json({"results": "bad"});
    }
});

app.use((req, res) => {
    res.status(404).send(`<h2>Uh Oh!</h2><p>Sorry ${req.url} cannot be found here</p>`);
});

db.init()
    .then(() => {
        app.listen(53141, () => console.log('The server is up and running...'));
    })
    .catch(err => {
        console.log('Problem setting up the database');
        console.log(err);
    });
const MongoClient = require('mongodb').MongoClient;

class DBAbstraction {
    constructor(dbUrl) {
        this.dbUrl = dbUrl;
    }

    init() {
        return new Promise((resolve, reject) => {
            MongoClient.connect(this.dbUrl, { useNewUrlParser: true }, (err, client) => {
                if (err) {
                    reject(err);
                } else {
                    client.close();
                    resolve();
                }
            });
        });
    }
    async insertScores(teamOne,scoreOne,teamTwo,scoreTwo,date,locations){
        try {
            const newGame = {

                team1: {
            
                    name: teamOne,
            
                    score: scoreOne
            
                }, 
            
                team2: {
            
                    name: teamTwo,
            
                    score: scoreTwo
            
                }, 
            
                gameDate: date,
            
                gameLocation: locations
            
            };
            const client = await MongoClient.connect(this.dbUrl, { useNewUrlParser: true });
            const db = client.db('GameScoresDB');

            await db.collection('scores').insertOne(newGame); //can also insertMany
            client.close();

        } catch(err) {
            console.log('There was a problem with the insert');
            throw err;
        }
    }

    async getAllScores() {
        let scores = null;
        try {
            const client = await MongoClient.connect(this.dbUrl, { useNewUrlParser: true });
            const db = client.db('GameScoresDB');

            scores = await db.collection('scores').find().toArray();
            client.close();
        } catch (err) {
            console.log('There was a problem finding the scores');
            throw err;
        }
        return scores;
    }

    async getByName(name){
        let scores = null;
        try {
            const client = await MongoClient.connect(this.dbUrl, { useNewUrlParser: true });
            const db = client.db('GameScoresDB');

            scores = await db.collection('scores').find({"team1.name":name}).toArray();
            client.close();
        } catch (err) {
            console.log('There was a problem finding the scores');
            throw err;
        }
        return scores;
    }

    async getByDate(date){
        let scores = null;
        try {
            const client = await MongoClient.connect(this.dbUrl, { useNewUrlParser: true });
            const db = client.db('GameScoresDB');

            scores = await db.collection('scores').find({"gameDate":date}).toArray();
            client.close();
        } catch (err) {
            console.log('There was a problem finding the scores');
            throw err;
        }
        return scores;
    }

    async getByLocation(locations){
        let scores = null;
        try {
            const client = await MongoClient.connect(this.dbUrl, { useNewUrlParser: true });
            const db = client.db('GameScoresDB');

            scores = await db.collection('scores').find({"gameLocation":locations}).toArray();
            client.close();
        } catch (err) {
            console.log('There was a problem finding the scores');
            throw err;
        }
        return scores;
    }
}
module.exports = DBAbstraction;


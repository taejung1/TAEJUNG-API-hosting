const fileUpload = require('express-fileupload');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();

const totale_questsC = require('./models/totale_quests.js');

app.set('MONGOOSE', process.env.MONGOOSE || "mongodb+srv://@taejung-api.espsj7i.mongodb.net/?retryWrites=true&w=majority")
app.set('HANGANG-KEY', process.env.HANGANG || "6a56735a6c7461653637474f46616b")
app.set("DOMAIN", process.env.DOMAIN || "https://api.taejung.xyz")
app.set('PORT', process.env.PORT || 3000);

app.disable('x-powered-by')

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(fileUpload({ limits: { fileSize: 1024 * 5 } }));
app.use(express.urlencoded({ extended: true }));
app.use('/api', rateLimit({ windowMs: 1000, max: 1, message: { "code": 429, "message": "Calls per second exceeded , Call timeout per second is 1000 ms." }, standardHeaders: true, legacyHeaders: false }));

app.use('/api', async function (req, res, next) { 
    const find = await totale_questsC.findOne({ name: "main" }); 
    await totale_questsC.updateOne(
        { name: "main" }, 
        { totale_quests: Number(find.totale_quests) + 1 },
    ); 
    next();
})

app.use('/data', express.static(path.join(process.cwd(), './data')));
fs.readdirSync(path.join(process.cwd(), "router")).forEach(file => {
    try {
        app.use(`/api/${String(file.split(".")[0])}`, require(path.join(process.cwd(), "router", String(file)))(app));
    } catch (error) {
        console.log(error);
    }
});

mongoose.set("strictQuery", false);
mongoose.connect(String(app.get('MONGOOSE')), { useUnifiedTopology: true, useNewUrlParser: true, }).then(console.log("mongoose connected")).catch((error) => console.log(`mongoose connect Error : ${error}`));

app.listen(app.get('PORT'), () => {
    console.info('server on %d', app.get('PORT'));
});

process.on('uncaughtException', (error) => {
    console.error(error)
});


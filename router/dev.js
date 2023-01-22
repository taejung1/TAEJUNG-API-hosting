const { Router } = require('express');
const totale_questsC = require('../models/totale_quests.js')

module.exports = function (app) {
    const router = Router()

    router.get('/all', async function (req, res) {
        const find = await totale_questsC.findOne({ name: "main" }); 
        res.send(`${find.totale_quests}`)
    })

    return router;
}


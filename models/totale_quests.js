const mongoose = require("mongoose");
module.exports = mongoose.model("totale_quests",
    new mongoose.Schema({ totale_quests: Number , name : String}));

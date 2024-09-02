const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  profession: {
    type: String,
    required: true,
  },
  archetype: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Operators", operatorsSchema);

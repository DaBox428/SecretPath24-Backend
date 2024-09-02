const express = require("express");
const Operator = require("../models/operators");

const router = express.Router();

//getting all operators
router.get("/getOperators", async (req, res) => {
  try {
    const operators = await Operator.find();
    res.json(operators);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

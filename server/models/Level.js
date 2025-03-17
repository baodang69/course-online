const mongoose = require("mongoose");

const levelSchema = new mongoose.Schema(
  {
    levelName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const Level = mongoose.model("Level", levelSchema, "Level");
module.exports = Level;

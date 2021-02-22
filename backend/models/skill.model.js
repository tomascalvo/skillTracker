// import mongoose.Schema
const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

// declare new Schema with fields, validation, default values, and static and instance helper methods
const skillSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'New skills must have a name'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'New skills must have a description'],
      trim: true,
    },
    img: {
      type: String,
      trim: true,
    },
    projects: [
      {
        type: Schema.Types.ObjectId,
        ref: "Project",
      },
    ],
    certifications: [
      {
        type: Schema.Types.ObjectId,
        ref: "Certification",
      },
    ],
    answers: [
      {
        type: Schema.Types.ObjectId,
        ref: "Answer",
      },
    ],
    flashcards: [
      {
        type: Schema.Types.ObjectId,
        ref: "Flashcard",
      },
    ],
    prerequisites: [
      {
        type: Schema.Types.ObjectId,
        ref: "Skill",
      },
    ],
    quizzes: [Date],
  },
  {
    timestamps: true,
  }
);

// virtuals

skillSchema.set("toObject", { virtuals: true });
skillSchema.set("toJSON", { virtuals: true });

skillSchema.virtual("url").get(function () {
  return "/skills/" + this._id;
});

skillSchema.virtual("lastQuiz").get(function () {
  return Math.max.apply(Math, this.quizzes);
});

skillSchema.virtual("model").get(function () {
  return "skill";
});

skillSchema.virtual("skills").get(function () {
  return this.prerequisites;
});

skillSchema.virtual("progress").get(function () {
  if (!this.flashcards || !Array.isArray(this.flashcards)) {
    return 0;
  }
  const proficiencies = this.flashcards.map((flashcard) => {
    if (flashcard === null) {
      return 0;
    } 
    return flashcard.progress;
  });
  const averageProficiency =
    proficiencies.reduce((acc, currentProficiency) => {
      return acc + currentProficiency;
    }, 0) / this.flashcards.length;
  return averageProficiency;
});

module.exports = mongoose.model("Skill", skillSchema);

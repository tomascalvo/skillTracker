const mongoose = require("mongoose");
const Schema = mongoose.Schema;
let Skill = require("../models/skill.model");

const flashcardSchema = new Schema(
  {
    problem: {
      type: String,
      required: true,
      trim: true,
    },
    solution: {
      type: String,
      required: true,
      trim: true,
    },
    attempts: [
      {
        isCorrect: { type: Boolean, default: false },
        date: { type: Date, default: new Date() },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// virtuals

flashcardSchema.set('toObject', { virtuals: true });
flashcardSchema.set('toJSON', { virtuals: true });

flashcardSchema.virtual("url").get(function () {
  return "/flashcards/" + this._id;
});

flashcardSchema
  .virtual("name")
  .get(function () {
    return this.problem;
  })
  .set(function (name) {
    this.problem = name;
  });

flashcardSchema
  .virtual("question")
  .get(function () {
    return this.problem;
  })
  .set(function (question) {
    this.problem = question;
  });

flashcardSchema
  .virtual("answer")
  .get(function () {
    return this.solution;
  })
  .set(function (answer) {
    this.solution = answer;
  });

flashcardSchema.virtual("progress").get(function () {
  if (this.attempts.length < 1) {
    return 0;
  }
  const sortedAttempts = this.attempts.sort(function (a, b) {
    if (a.Date > b.Date) {
      return -1;
    } else if (a.Date < b.Date) {
      return 1;
    } else {
      return 0;
    }
  });
  const last7Attempts = sortedAttempts.slice(0, 7);
  const last7Results = last7Attempts.map((attempt) => attempt.isCorrect);
  const score = last7Results.reduce((acc, currentIsCorrect) => {
    return acc + currentIsCorrect;
  });
  const divisor = this.attempts.length < 7 ? this.attempts.length : 7;
  const average = score / divisor;
  return average;
});

flashcardSchema.virtual("lastAttempt").get(function () {
  if (this.attempts.length < 1) {
    return "This flashcard has never been attempted.";
  }
  const sortedAttempts = this.attempts.sort(function (a, b) {
    if (a.Date > b.Date) {
      return -1;
    } else if (a.Date < b.Date) {
      return 1;
    } else {
      return 0;
    }
  });
  const lastAttempt = sortedAttempts[0];
  return (
    (
      new Date(
        lastAttempt.date
      ).getUTCMonth() + 1
    ).toString() +
    "/" +
    new Date(lastAttempt.date)
      .getUTCDate()
      .toString() +
    "/" +
    new Date(lastAttempt.date)
      .getFullYear()
      .toString()
  );
});

flashcardSchema.virtual("displayDate").get(function() {
  return this.lastAttempt;
});

flashcardSchema.virtual("skills").get(function () {
  Skill.find({ flashcards: this._id }).exec(function (err, skills) {
    if (err) return "Error: " + err;
    // returns all skills that have this flashcard's id in their flashcard field
  });
});

flashcardSchema.virtual("model").get(function () {
    return "flashcard";
});

module.exports = mongoose.model("Flashcard", flashcardSchema);

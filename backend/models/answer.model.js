const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const answerSchema = Schema(
  {
    question: String,
    href: {
      type: String,
      default:
        "https://stackoverflow.com/users/12769087/tom%c3%a1s-calvo?tab=answers",
    },
  },
  { timestamps: true }
);

// virtuals

answerSchema.set("toObject", { virtuals: true });
answerSchema.set("toJSON", { virtuals: true });

answerSchema.virtual("url").get(function () {
  return "/answers/" + this._id;
});

answerSchema
  .virtual("name")
  .get(function () {
    return this.question;
  })
  .set(function (name) {
    this.question = name;
  });

// answerSchema.virtual("description").get(function () {
//   return (
//     `Problem: ${this.problem}\nSolution: ${this.solution}`
//   );
// });

answerSchema.virtual("model").get(function () {
  return "answer";
});

module.exports = mongoose.model("Answer", answerSchema);

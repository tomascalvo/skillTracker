// require Mongoose
const mongoose = require('mongoose');

// define a schema
const Schema = mongoose.Schema;

const snippetSchema = new Schema(
  {
    body: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    skills: [{
        type: Schema.Types.ObjectId,
        ref: "Skill",
    }],
  },
  {
    timestamps: true,
  }
);

// virtuals

snippetSchema.virtual('url').get(function () {
  return '/snippets/' + this._id;
});

snippetSchema.virtual('model').get(function () {
  return "snippet"
});

// compile model from schema (and export module)
module.exports = mongoose.model("Snippet", snippetSchema);
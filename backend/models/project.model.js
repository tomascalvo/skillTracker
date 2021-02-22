const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const projectSchema = new Schema(
  {
    title: {
      type: String,
      // required: true,
      // unique: true,
      trim: true,
    },
    description: {
      type: String,
      // required: true,
      // unique: true,
      trim: true,
    },
    href: {
      type: String,
      required: true,
      default: "https://github.com/tomascalvo?tab=projects",
    },
    datePublished: {
      type: Date,
      default: new Date(),
    },
  },
  {
    timestamps: true,
  }
);

// virtuals

projectSchema.set("toObject", { virtuals: true });
projectSchema.set("toJSON", { virtuals: true });

projectSchema.virtual("url").get(function () {
  return "/projects/" + this._id;
});

projectSchema
  .virtual("name")
  .get(function () {
    return this.title;
  })
  .set(function (name) {
    this.title = name;
  });

projectSchema.virtual("model").get(function () {
  return "project";
});

projectSchema
  .virtual("date")
  .get(function () {
    return this.datePublished;
  })
  .set(function (date) {
    this.datePublished = new Date(date);
  });

projectSchema.virtual("displayDate").get(function () {
  return (
    (new Date(this.datePublished).getUTCMonth() + 1).toString() +
    "/" +
    new Date(this.datePublished).getUTCDate().toString() +
    "/" +
    new Date(this.datePublished).getFullYear().toString()
  );
});

projectSchema.virtual("progress").get(function () {
  const now = new Date();
  if (this.datePublished < now) {
    return 1;
  } else {
    return 0.5;
  }
});

module.exports = mongoose.model("Project", projectSchema);

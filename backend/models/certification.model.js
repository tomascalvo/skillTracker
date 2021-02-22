const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const certificationSchema = Schema(
  {
    title: {
      type: String,
      // required: true,
      trim: true,
    },
    institution: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    dateAwarded: {
      type: Date,
      default: new Date(),
    },
    href: String,
    img: String,
  },
  { timestamps: true }
);

// virtuals

certificationSchema.set("toObject", { virtuals: true });
certificationSchema.set("toJSON", { virtuals: true });

certificationSchema.virtual("url").get(function () {
  return "/certifications/" + this._id;
});

certificationSchema
  .virtual("name")
  .get(function () {
    return this.title;
  })
  .set(function (name) {
    this.title = name;
  });

certificationSchema
  .virtual("date")
  .get(function () {
    return this.dateAwarded;
  })
  .set(function (date) {
    this.dateAwarded = new Date(date);
  });

certificationSchema.virtual("displayDate").get(function () {
  return (
    (new Date(this.date).getUTCMonth() + 1).toString() +
    "/" +
    new Date(this.date).getFullYear().toString()
  );
});

certificationSchema.virtual("model").get(function () {
  return "certification";
});

certificationSchema.virtual("progress").get(function () {
  const now = new Date();
  if (this.dateAwarded < now) {
    return 1;
  } else {
    return 0.5;
  }
});

module.exports = mongoose.model("Certification", certificationSchema);

const router = require("express").Router();
let Certification = require("../models/certification.model");

router.route("/add").post((req, res) => {
  const { title, institution, description, dateAwarded, date, href, img, name } = req.body;
  const newCertification = new Certification({
    title: title,
    institution: institution,
    description: description,
    dateAwarded: dateAwarded,
    href: href,
    img: img,
    name: name,
    date: date
  });
  newCertification
    .save()
    .then(() => res.json("Certification added"))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/").get((req, res) => {
  Certification.find()
    .then((certifications) => res.json(certifications))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/:id").delete((req, res) => {
  Certification.findByIdAndDelete(req.params.id)
    .then(() => res.json("Flashcard delted"))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/edit/:id").put((req, res) => {
  Certification.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body, // mongoDB $set operator replaces the value of a field with the specified value
    },
    (error, data) => {
      if (error) {
        console.log(error);
      } else {
        res.json(data);
        console.log("Certification updated successfully");
      }
    }
  );
});

router.route("/:id").delete((req, res, next) => {
  console.log(req.params.id);
  Certification.findByIdAndRemove(req.params.id, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.status(200).json({
        msg: data,
      });
    }
  });
});

module.exports = router;

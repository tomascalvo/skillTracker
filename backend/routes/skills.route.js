// instantiate router
const router = require("express").Router();
// import model
const Skill = require("../models/skill.model");

// routes
router.route("/").get((req, res) => {
  // model.find() is a mongoose method that gets a list of all documents from the db collection that corresponds to the model.
  Skill.find()
    .populate("projects")
    .populate("certifications")
    .populate("answers")
    .populate("flashcards")
    .populate("prerequisites")
    .then((skills) => res.json(skills))
    .catch((err) => res.status(400).json("Error getting all skills: " + err));
});

router.route("/:id").get((req, res) => {
  Skill.findById(req.params.id)
    .populate("projects")
    .populate("certifications")
    .populate("answers")
    .populate("flashcards")
    .populate("prerequisites")
    .then((skill) => res.json(skill))
    .catch((err) => res.status(400).json("Error: " + err));
});

// SPECIAL ROUTE: this route responds with all of the skills associated with a resource
router.route("/:resource/:id").get((req, res) => {
  Skill.find({ [req.params.resource]: req.params.id})
  .then((skills) => res.json(skills))
  .catch((err) => res.status(400).json(`Error getting all skills for ${req.params.resource.slice(0, -1)}: ` + err));
})

router.route("/add").post((req, res) => {
  // destructure req.body
  const {
    name,
    description,
    projects,
    certifications,
    answers,
    img,
    prerequisites,
    flashcards,
  } = req.body;

  // instantiate model
  const newSkill = new Skill({
    name: name,
    description: description,
    projects: projects,
    certifications: certifications,
    answers: answers,
    img: img,
    prerequisites: prerequisites,
    flashcards: flashcards,
  });

  // save model instance
  newSkill
    .save()
    .then(() => res.json("Skill added"))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/edit/:id").put((req, res) => {
  Skill.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body // mongoDB $set operator replaces the value of a field with the specified value
    },
    (error, data) => {
      if (error) {
        console.log(error);
      } else {
        res.json(data);
        console.log("Skill updated successfully");
      }
    }
  );
});

router.route("/:id").delete((req, res, next) => {
  console.log(req.params.id);
  Skill.findByIdAndRemove(req.params.id, (error, data) => {
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

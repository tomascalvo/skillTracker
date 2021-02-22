const router = require("express").Router();
let Answer = require("../models/answer.model");
let Skill = require("../models/skill.model");
const verify = require('./verifyToken');

router.route("/add").post((req, res) => {
  const { problem, href, question } = req.body;
  const newAnswer = new Answer({
    problem: problem,
    question: question,
    href: href
  });
  newAnswer
    .save()
    .then(() => res.json("Answer added"))
    .catch(err => res.status(400).json("Error: " + err));
});

router.route("/").get((req, res) => {
  Answer.find()
    .then(answers => res.json(answers))
    .catch(err => res.status(400).json("Error: " + err));
});

router.route("/:id").get((req, res) => {
  Answer.findById(req.params.id)
    .then(flashcard => res.json(flashcard))
    .catch(err => res.status(400).json("Error: " + err));
});

router.route("/skill/:id").get((req, res) => {
  Skill.findById(req.params.id)
    .populate("answers")
    .then(skill => res.json(skill.answers))
    .catch(err => res.status(400).send("Error getting answers by skill._id: " + err));
});

router.route("/edit/:id").put((req, res) => {
  Answer.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body // mongoDB $set operator replaces the value of a field with the specified value
    },
    (error, data) => {
      if (error) {
        console.log(error);
      } else {
        res.json(data);
        console.log("Answer updated successfully");
      }
    }
  );
});

router.route("/:id").delete((req, res, next) => {
  Answer.findByIdAndRemove(req.params.id, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.status(400).json({
        msg: data,
      });
    }
  });
});

module.exports = router;
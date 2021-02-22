const router = require("express").Router();
let Flashcard = require("../models/flashcard.model");
let Skill = require("../models/skill.model");

router.route("/add").post((req, res) => {
  const { problem, solution, question, answer, attempts } = req.body;

  const newFlashcard = new Flashcard({
    problem: problem,
    solution: solution,
    question: question,
    answer: answer,
    attempts: attempts,
  });

  newFlashcard
    .save()
    .then(() => res.json("Flashcard added"))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/").get((req, res) => {
  Flashcard.find()
    .then((flashcards) => res.json(flashcards))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/:id").get((req, res) => {
  Flashcard.findById(req.params.id)
    .then((flashcard) => res.json(flashcard))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/skill/:id").get((req, res) => {
  console.log('req.params.id: ' + req.params.id);
  Skill.findById(req.params.id)
    .populate("flashcards")
    .then((skill) => res.json(skill.flashcards))
    .catch((err) => res.status(400).json("Error getting flashcards by skill._id: " + err));
});

router.route("/update/:id").put((req, res) => {
  Flashcard.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body,
    },
    (error, data) => {
      if (error) {
        console.log(error);
      } else {
        res.json(data);
        console.log("Flashcard updated successfully");
      }
    }
  );
});

router.route("/:id").delete((req, res) => {
  Flashcard.findByIdAndRemove(req.params.id)
    .then(() => res.status(200).json("Flashcard deleted"))
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;

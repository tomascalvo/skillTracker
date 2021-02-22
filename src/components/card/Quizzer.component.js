import React, { useState } from "react";
import axios from "axios";

const Quizzer = ({ skill }) => {
  const [iterator, setIterator] = useState(0);
  const [answer, setAnswer] = useState("");
  const [phase, setPhase] = useState("ask");

  const answerHandler = (e) => {
    setAnswer(e.target.value);
  };

  const checkAnswer = () => {
    return answer === skill.flashcards[iterator].solution ? true : false;
  };

  const submitHandler = (e) => {
    e.preventDefault();
    const flashcard = skill.flashcards[iterator];
    if (checkAnswer()) {
      console.log(
        `You answered correctly.\nYour answer: ${answer}\nCorrect answer: ${skill.flashcards[iterator].solution}`
      );
    } else {
      console.log(
        `You answered incorrectly.\nYour answer: ${answer}\nCorrect answer: ${skill.flashcards[iterator].solution}`
      );
    }
    flashcard.attempts.push({
      isCorrect: checkAnswer(),
      date: new Date(),
    });
    axios
      .put(
        `http://localhost:5000/flashcards/update/${flashcard._id}`,
        flashcard
      )
      .then((res) => {
        console.log("Flashcard updated");
        setPhase("feedback");
      })
      .catch((error) => {
        console.log("Error updating flashcard: " + error);
      });
  };

  const advanceHandler = (e) => {
    e.preventDefault();
    setIterator(iterator + 1);
    setAnswer("");
    if (iterator < skill.flashcards.length - 1) {
      setPhase("ask");
    } else {
      setPhase("report");
    }
  };

  const quizSwitch = () => {
    switch (phase) {
      case "ask":
        return ask();
      case "feedback":
        return feedback();
      case "report":
        return report();
      default:
        return noFlashcards();
    }
  };

  const ask = () => {
    return (
      <form>
        <h5>Problem {iterator + 1}: </h5>
        <p>{skill.flashcards[iterator].problem}</p>
        <textarea
          rows="4"
          onChange={answerHandler}
          value={answer}
          placeholder="Submit answer here"
        ></textarea>
        <input type="submit" onClick={submitHandler}></input>
      </form>
    );
  };

  const feedback = () => {
    return (
      <div>
        <h5>Problem {iterator + 1}: </h5>
        <p>{skill.flashcards[iterator].problem}</p>
        <p>{`You answered ${checkAnswer() ? "" : "in"}correctly.`}</p>
        <p>{`Your answer: ${answer}`}</p>
        <p>{`Correct answer: ${skill.flashcards[iterator].solution}`}</p>
        <button onClick={advanceHandler}>Next</button>
      </div>
    );
  };

  const report = () => {
    return (
      <div>
        <p>Quiz Complete</p>
      </div>
    );
  };

  const noFlashcards = () => {
    return <p>{skill.name} has no flashcards assigned to it.</p>;
  };

  return (
    <div>
      <h4>Quiz</h4>
      {quizSwitch()}
    </div>
  );
};

export default Quizzer;

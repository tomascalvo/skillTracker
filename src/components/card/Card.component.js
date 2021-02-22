import React, { useState, useEffect } from "react";
import axios from "axios";
import Tab from "./Tab.component";
import CardButtons from "./CardButtons.component";
import ProgressBar from "./ProgressBar.component";

const Card = ({
  resourceType,
  resources,
  setResources,
  startingDocument,
  startingMode,
  index,
  setProgressFilter,
  token
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [tab, setTab] = useState("description");
  const [mode, setMode] = useState(startingMode ? startingMode : "display");
  const [confirmation, setConfirmation] = useState(false);

  const [document, setDocument] = useState(startingDocument);
  const [inputDocument, setInputDocument] = useState(startingDocument);
  const [skills, setSkills] = useState([]);

  // update document when resourceType changes
  useEffect(() => {
    setDocument(startingDocument);
  }, [resourceType, startingDocument]);

  // get skills associated with the document displayed by the card
  useEffect(() => {
    let mounted = true;
    const source = axios.CancelToken.source();

    if (resourceType !== "skills" && mode !== "add") {
      setIsLoading(true);
      axios
        .get(`http://localhost:5000/skills/${resourceType}/${document._id}`, {
          cancelToken: source.token,
          headers: {
            Authorization: token
          }
        })
        .then((res) => {
          setSkills(res.data);
        })
        .then(() => {
          console.log(
            `GET request for skills for ${resourceType.slice(0, -1)} ${
              document.name
            }`
          );
          if (mounted) {
            setIsLoading(false);
          }
        })
        .catch((err) => {
          if (axios.isCancel(err)) {
          } else {
            console.log(`Error retrieving skills for ${resourceType.slice(0, -1)} ${document.name}: ` + err);
          }
        });
    }

    if (confirmation) setConfirmation(false);

    return function cleanup() {
      mounted = false;
      source.cancel();
    };
  }, [document, resourceType, confirmation, mode]);

  // close any open display forms when resourceType changes
  useEffect(() => {
    setMode(startingMode);
    setExpanded(false);
  }, [resourceType, startingMode]);

  // EVENT HANDLERS

  const expansionHandler = (e) => {
    setExpanded(!expanded);
  };

  const tabHandler = (e) => {
    setTab(e.target.value);
  };

  const quizHandler = (e) => {
    setTab("quiz");
  };

  const toEditMode = (e) => {
    setMode("edit");
    setTab("description");
    setConfirmation(false);
  };

  const clearHandler = (e) => {
    e.preventDefault();
    setInputDocument(startingDocument);
    setConfirmation(false);
    if (mode === "edit") {
      setMode("display");
    }
    if (mode === "confirmation") {
      setMode('add');
    }
    setTab("description");
  };

  const editHandler = (e) => {
    if (!Array.isArray(inputDocument[e.target.name])) {
      setInputDocument({ ...inputDocument, [e.target.name]: e.target.value });
    } else {
      if (e.target.checked !== true) {
        setInputDocument({
          ...inputDocument,
          [e.target.name]: inputDocument[e.target.name].filter((el) => {
            return el !== e.target.value;
          }),
        });
      } else {
        setInputDocument({
          ...inputDocument,
          [e.target.name]: [...inputDocument[e.target.name], resources[e.target.name === "prerequisites" ? "skills" : e.target.name].find(el => el._id === e.target.value)],
        });
      }
    }
  };

  function depopulate(inputDocument) {
    let depopulatedInput = inputDocument;
    const models = [
      "projects",
      "certifications",
      "answers",
      "prerequisites",
      "flashcards",
      "skills"
    ];
    models.forEach((model) => {
      if (
        Array.isArray(inputDocument[model]) &&
        inputDocument[model].length > 0
      ) {
        depopulatedInput = {
          ...inputDocument,
          [model]: inputDocument[model].map((el) => el._id),
        };
      }
    });
    return depopulatedInput;
  }

  function submitHandler(e) {
    e.preventDefault();
    console.log(`submithandler invoked`);
    const depopulatedInput = depopulate(inputDocument);
    console.log(`submithandler status: depopulatedInput: ${JSON.stringify(depopulatedInput)}`);
    if (mode === "add") {
      // map populated objects into arrays of _ids
      // post the new document
      axios
        .post(`http://localhost:5000/${resourceType}/add`, depopulatedInput)
        .then(() => {
          // add the new document to the resources list
          setResources([...resources, inputDocument]);
          // reset the inputDocument
          setInputDocument(startingDocument);
        })
        .then(() => {
          // set tab to display summary with confirmation message
          setConfirmation(true);
          setMode("confirmation");
          setTab("confirm-add");
          setProgressFilter("all"); // display all skill cards, including the newly submitted skill
        })
        .catch((err) => console.log(`Error editing ${resourceType}: ${err}.`));
    }
    if (mode === "edit" || mode === "display") {
      console.log(`mode: ${mode}`);
      // map populated objects into arrays of _ids
      // put request the updated document
      axios
        .put(
          `http://localhost:5000/${resourceType}/edit/${depopulatedInput._id}`,
          depopulatedInput
        )
        .then(() => {
          // update the card document data
          axios.get(`http://localhost:5000/${resourceType}/${document._id}`)
            .then((res) => {
              setDocument(res.data);
              console.log(`put request successful`);
            })  
            .catch((err) => console.log(`Error retrieving updated ${resourceType.slice(0, -1)}`));
          // update newly related skill documents if applicable
          if (
            // check that there have been any skills added or removed to update
            Array.isArray(inputDocument.skills) &&
            inputDocument.skills !== document.skills
          ) {
            // loop through each skill on the inputDocument, find it in the db, and add the inputDocument to that skill in the db
            inputDocument.skills.forEach((id) => {
              let skill;
              axios
                .get(`http://localhost:5000/skills/${id}`)
                .then((res) => (skill = res.data))
                .then(() => {
                  skill[resourceType] = [
                    ...skill[resourceType],
                    inputDocument._id,
                  ];
                  axios
                    .put(`http://localhost:5000/skills/edit/${id}`, skill)
                    .catch((err) =>
                      console.log(
                        `Error adding ${resourceType} to skill(s): ${err}.`
                      )
                    );
                });
            });
          }
        })
        .then(() => {
          setInputDocument(document);
        })
        .then(() => {
          setConfirmation(true);
          setMode("display");
          setTab("description");
        })
        .catch((err) => console.log(`Error editing ${resourceType}: ${err}.`));
    }
  }

  const deleteHandler = () => {
    console.log(`Delete requested for skill: ${document.name}`);
    axios
      .delete(`http://localhost:5000/${resourceType}/${document._id}`)
      .then(() => {
        console.log(`${resourceType} deleted.`);
        setResources(
          resources.filter((resource) => resource._id !== document._id)
        );
      })
      .catch((err) => console.log(`Error deleting ${resourceType}: ` + err));
  };

  return (
    <div
      className={`card-wrapper glass ${expanded ? "expanded" : ""}`}
      value="description"
      onMouseLeave={tabHandler}
    >
      <div className={`card`} key={index}>
        <Tab
          resources={resources}
          document={document}
          inputDocument={inputDocument}
          tab={tab || "description"}
          mode={mode}
          editHandler={editHandler}
          clearHandler={clearHandler}
          resourceType={resourceType}
          confirmation={confirmation}
          skills={resources['skills']}
          // isLoading={isLoading}
        />
        <CardButtons
          tab={tab}
          document={document}
          resourceType={resourceType}
          mode={mode}
          tabHandler={tabHandler}
          expanded={expanded}
          expansionHandler={expansionHandler}
          quizHandler={quizHandler}
          toEditMode={toEditMode}
          clearHandler={clearHandler}
          deleteHandler={deleteHandler}
          submitHandler={submitHandler}
        />
        {document.progress !== undefined ? (
          <ProgressBar document={document} />
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default Card;

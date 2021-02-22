import React from "react";
import DisplayTab from "./DisplayTab.component";
import FormTab from "./FormTab.component";
import Quizzer from "./Quizzer.component";

const Tab = ({
  resources,
  resourceType,
  document,
  tab,
  mode,
  editHandler,
  inputDocument,
  clearHandler,
  model,
  confirmation,
  skills,
  isLoading,
}) => {
  const displayQuizTab = () => {
    if (document.flashcards.length > 0) {
      return <Quizzer skill={document} />;
    } else {
      return (
        <h4>
          This skill has no flashcards. Add flashcards to this skill to quiz
          this document.
        </h4>
      );
    }
  };

  const summaryTab = () => {
    return (
      <div>
        {confirmation ? <p className="confirmation">edit/add confirmed</p> : ""}
        {document.institution ? (
          <p className="institution">{document.institution}</p>
        ) : (
          ""
        )}
        {document.datePublished ? <p>published: {document.displayDate}</p> : ""}
        {/* {document.href ? <a href={document.href}>{document.href}</a> : ""} */}
        {document.description ? <p>{document.description}</p> : ""}
        {document.projects && document.projects.length > 0 ? (
          <p>{document.projects.length} projects</p>
        ) : (
          ""
        )}
        {document.certifications && document.certifications.length > 0 ? (
          <p>{document.certifications.length} certifications</p>
        ) : (
          ""
        )}
        {document.answers && document.answers.length > 0 ? (
          <p>{document.answers.length} answers</p>
        ) : (
          ""
        )}
        {document.prerequisites && document.prerequisites.length > 0 ? (
          <p>{document.prerequisites.length} prerequisites</p>
        ) : (
          ""
        )}
        {document.flashcards && document.flashcards.length > 0 ? (
          <p>{document.flashcards.length} flashcards</p>
        ) : (
          ""
        )}
      </div>
    );
  };

  const confirmAddTab = () => {
    return (
      <div>
        <p className="confirmation">document added</p>
        <button onClick={clearHandler}>add another document</button>
      </div>
    );
  };

  function switchTab() {
    if (mode === "confirmation" || tab === "confirm-add") {
      return confirmAddTab();
    }
    if (mode === "add" || mode === "edit") {
      return (
        <FormTab
          resources={resources}
          mode={mode}
          tab={tab}
          inputDocument={inputDocument}
          editHandler={editHandler}
          resourceType={resourceType}
        />
      );
    } else {
      if (tab === "quiz") {
        return displayQuizTab();
      } else if (tab === "edit") {
        return <p>Click the button to edit this document.</p>;
      } else if (tab === "delete") {
        return <p>Click the button to delete this document.</p>;
      } else if (tab === "skills") {
        return (
          <DisplayTab
            elements={skills}
            isLoading={isLoading}
            resourceType="skills"
          />
        );
      } else if (Array.isArray(document[tab])) {
        return <DisplayTab elements={document[tab]} resourceType={tab} />;
      } else {
        return summaryTab();
      }
    }
  }

  return (
    <div className="tab">
      {document.href ? (
        <a href={document.href}>
          <h2>{document ? document.name : ""}</h2>
        </a>
      ) : (
        <h2>{document ? document.name : ""}</h2>
      )}
      <h2>{mode === "add" ? `new ${resourceType.slice(0, -1)}` : ""}</h2>
      {switchTab()}
    </div>
  );
};

export default Tab;

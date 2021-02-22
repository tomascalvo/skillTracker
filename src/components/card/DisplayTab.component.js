import React from "react";

const DisplayTab = ({ resourceType, elements, isLoading }) => {

  const displayElement = (el) => {
    return (
      <div>
        <a href={el !== null ? el.href : "#"}>{el.name}</a>
        <span>{!["projects", "flashcards", "prerequisites", "skills"].includes(resourceType) ? "" : el.progress ? ` ${el.progress * 100}%` : ""}</span>
        {/* <p>{el.description ? `${el.description}` : ""}</p> */}
        <p>{el.attempts ? `Last Attempt: ${el.lastAttempt}` : ""}</p>
        <p>{el.datePublished ? `Published: ${el.displayDate}` : ""}</p>
        <p>{el.dateAwarded ? `Awarded: ${el.displayDate}` : ""}</p>
      </div>
    );
  };

  return (
    <div>
      {isLoading ? (
        <p>loading...</p>
      ) : Array.isArray(elements) ? (
        <div>
          <h3>
            {resourceType} ({elements.length}):
          </h3>
          <ul>
            {elements.map((el, i) => (
              <li key={i}>{displayElement(el)}</li>
            ))}
          </ul>
        </div>
      ) : (
        displayElement(elements)
      )}
    </div>
  );
};

export default DisplayTab;

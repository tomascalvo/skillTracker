import React, { useState, useEffect } from "react";
import axios from "axios";

const FormTab = ({
  tab,
  inputDocument,
  editHandler,
  resourceType,
  resources,
}) => {
  const [options, setOptions] = useState([]);
  const [currentElements, setCurrentElements] = useState([]);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  // set currentElements on mount and whenever tab or inputDocument changes
  useEffect(() => {
    if (Array.isArray(inputDocument[tab])) {
      setCurrentElements(inputDocument[tab]);
    }
  }, [inputDocument, tab]);

  // set options on mount and whenever resources, tab or currentElements changes
  useEffect(() => {
    const rType = (tab === "prerequisites") ? "skills" : tab;
    if (Array.isArray(resources[rType])) {
      setOptions(resources[rType].filter((el) => {
        return !currentElements.map(element => element._id).includes(el._id);
      }));
    }
  }, [resources, tab, currentElements]);

  useEffect(() => {
    // set search results whenever query or options changes
    if (query === "") {
      setResults(options);
    } else {
      setResults(
        options.filter((el) => {
          return el.name
            .trim()
            .toLowerCase()
            .includes(query.trim().toLowerCase());
        })
      );
    }
  }, [query, options]);

  const searchHandler = (e) => {
    setQuery(e.target.value);
  };

  const nonArrayForm = () => {
    return (
      <div className="text-inputs-container">
        {!["answers", "flashcards"].includes(resourceType) ? (
          <div>
            <div className="input-wrapper name-input">
              <label htmlFor="name">name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={inputDocument.name}
                placeholder={inputDocument.name || "name"}
                onChange={editHandler}
              />
            </div>
            <div className="input-wrapper textarea-input">
              <label htmlFor="description">description</label>
              <textarea
                id="description"
                name="description"
                value={inputDocument.description}
                placeholder={inputDocument.description || "description"}
                onChange={editHandler}
                rows="2"
              />
            </div>
          </div>
        ) : (
          <div className="input-wrapper textarea-input">
            <label htmlFor="description">question</label>
            <textarea
              id="question"
              name="question"
              value={inputDocument.question}
              placeholder={inputDocument.question || "question"}
              onChange={editHandler}
              rows="2"
            />
          </div>
        )}
        {resourceType === "flashcards" ? (
          <div className="input-wrapper textarea-input">
            <label htmlFor="answer">answer</label>
            <textarea
              id="answer"
              name="answer"
              value={inputDocument.answer}
              placeholder={inputDocument.answer || "answer"}
              onChange={editHandler}
              rows="2"
            />
          </div>
        ) : (
          ""
        )}
        {["projects", "certifications"].includes(resourceType) ? (
          <div>
            <div className="input-wrapper">
              <label htmlFor="href">href</label>
              <input
                type="text"
                id="href"
                name="href"
                value={inputDocument.href}
                placeholder={inputDocument.href || "href"}
                onChange={editHandler}
              />
            </div>
            <div className="input-wrapper">
              <label htmlFor="date">date</label>
              <input
                type="Date"
                id="date"
                name="date"
                value={inputDocument.date}
                placeholder={inputDocument.date || "date"}
                onChange={editHandler}
              />
            </div>
          </div>
        ) : (
          ""
        )}
        {resourceType === "certifications" ? (
          <div className="input-wrapper">
            <label htmlFor="institution">institution</label>
            <input
              type="text"
              id="institution"
              name="institution"
              value={inputDocument.institution}
              placeholder={inputDocument.institution || "institution"}
              onChange={editHandler}
            />
          </div>
        ) : (
          ""
        )}
      </div>
    );
  };

  const renderSearchResults = () => {
    return (
      <div>
        {results
          .filter((result) => !currentElements.includes(result._id))
          .map((doc, index) => (
            <button
              key={tab + "SelectButton" + index}
              id={doc.name + index}
              name={tab}
              value={doc._id}
              checked={true}
              onClick={editHandler}
              title={`click to add`}
            >
              {doc.name}
            </button>
          ))}
      </div>
    );
  };

  const renderCurrentElements = () => {
    return (
      <div>
        {currentElements
          .map((el, index) => (
            <div key={index}>
              <button
                key={tab + "RemoveButton" + index}
                id={el.name ? el.name + index : index}
                name={tab}
                value={el._id}
                checked={false}
                onClick={editHandler}
                title={`click to remove`}
              >
                {el.name}
              </button>
            </div>
          ))}
      </div>
    );
  };

  const arrayForm = () => {
    return (
      <div className="search-module">
        <div>
          <label htmlFor="searchBar"></label>
        </div>
        <div>
          <input
            type="text"
            id="searchBar"
            name={"searchBar"}
            value={query}
            onChange={searchHandler}
            placeholder={`Search ${tab}`}
          />
        </div>
        <div className="search-results">
          <div className="selected-docs">
            <h4>current {tab}: </h4>
            {renderCurrentElements()}
          </div>
          <div className={"doc-options"}>
            <h4>{tab} options: </h4>
            {renderSearchResults()}
          </div>
        </div>
      </div>
    );
  };

  if (
    (Array.isArray(inputDocument[tab]) && inputDocument[tab] !== undefined) ||
    [
      "projects",
      "certifications",
      "answers",
      "prerequisites",
      "flashcards",
      "skills",
    ].includes(tab)
  ) {
    return arrayForm();
  } else if (!Array.isArray(inputDocument[tab]) || tab === "description") {
    return nonArrayForm();
  } else {
    return (
      <p>
        This {inputDocument.tab} inputDocument doesn't have a tab or virtual
        method for "{tab}".
      </p>
    );
  }
};

export default FormTab;

import React, { useState, useEffect } from "react";
import ProgressSelect from "./ProgressSelect.component";

const ResourceSummary = ({
  resourceType,
  resources,
  progressFilterHandler,
}) => {
  const [countCompleted, setCountCompleted] = useState(0);

  useEffect(() => {
    setCountCompleted(
      resources.reduce((acc, el) => {
        return el.progress >= 1 ? ++acc : acc;
      }, 0)
    );
  }, [resources]);

  const resourcesSummary = () => {
    return (
      <div>
        <h2>
          You are proficient in {countCompleted + " "}
          {countCompleted !== 1
            ? resourceType
            : resourceType.slice(
                resourceType[resourceType.length - 1],
                resourceType[resourceType.length]
              )}
          .
        </h2>
        {/* <NavLink to={`/${resourceType}/add`}>Add {resourceType}.</NavLink> */}
      </div>
    );
  };

  return (
    <header className="glass">
      <h1>{resourceType}</h1>
      {resourcesSummary()}
      <ProgressSelect progressFilterHandler={progressFilterHandler} />
    </header>
  );
};

export default ResourceSummary;

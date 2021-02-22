import React, { useState, useEffect } from "react";
import Card from "./card/Card.component";
import getInputDoc from "../helpers/getInputDoc"

const ResourceList = ({
  resources,
  setResources,
  resourceType,
  progressFilter,
  setProgressFilter,
  token
}) => {
  const [filteredDocuments, setFilteredDocuments] = useState([]);

  useEffect(() => {
    // filter and sort cards on mount, changes to resources, and changes to progressFilter
    const filterHandler = () => {
      switch (progressFilter) {
        case "proficient":
          setFilteredDocuments(
            resources[resourceType]
              .filter((el) => el.progress >= 1)
          );
          break;
        case "in progress":
          setFilteredDocuments(resources[resourceType].filter((el) => el.progress < 1));
          break;
        default:
          // setFilteredDocuments(resources.sort(function(a, b){return a.createdAt - b.createdAt}));
          setFilteredDocuments(resources[resourceType]);
          break;
      }
    };
    filterHandler();
  }, [resources, progressFilter, resourceType]);

  return (
    <div className="resource-list">
      <Card
        startingMode="add"
        resourceType={resourceType}
        resources={resources}
        setResources={setResources}
        startingDocument={getInputDoc(resourceType)}
        setProgressFilter={setProgressFilter}
      />
      {(Array.isArray(filteredDocuments) && filteredDocuments.length > 0) ? 
        filteredDocuments.map((document, index) => (
          <Card
            resourceType={resourceType}
            resources={resources}
            setResources={setResources}
            startingDocument={document}
            startingMode="display"
            key={index}
            setProgressFilter={setProgressFilter}
            token={token}
          />
        )) : <h2>no documents</h2>
      }
    </div>
  );
};

export default ResourceList;

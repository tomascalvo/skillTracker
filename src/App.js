// React UI app for displaying skill objects from local storage 01/19/2021

import React, { useState, useEffect } from "react";
import axios from "axios";

import "./App.css";

// import components
import Nav from "./components/Nav.component.js";
import Auth from "./components/auth/Auth.component.js";
import ResourceList from "./components/ResourceList.component.js";
import ResourceSummary from "./components/summary/ResourceSummary.component.js";

function App() {
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState({name: 'no name', title: 'no title'});
  // const [isAuthorized, setIsAuthorized] = useState(false);
  const [resourceType, setResourceType] = useState("skills");
  const [resources, setResources] = useState({
    skills: [],
    projects: [],
    certifications: [],
    answers: [],
    flashcards: [],
  });
  const [progressFilter, setProgressFilter] = useState("all");

  // get resources for ResourceList.component
  useEffect(() => {
    if (token === null) {
      return;
    }
    const typesArray = [
      "skills",
      "projects",
      "certifications",
      "answers",
      "flashcards",
    ];
    let resourceObject = {};
    let promises = [];
    for (let index = 0; index < typesArray.length; index++) {
      const rType = typesArray[index];
      promises.push(
        axios
          .get(`http://localhost:5000/${rType}/`, {
            headers: {
              Authorization: token,
            },
          })
          // eslint-disable-next-line no-loop-func
          .then((res) => {
            resourceObject = {
              ...resourceObject,
              [rType]: res.data,
            };
          })
          .catch((err) =>
            console.log(
              `Error retrieving all ${rType.slice(0, -1)} resources from db: ` +
                err
            )
          )
      );
    }
    Promise.all(promises).then(() => setResources(resourceObject));
  }, [token]);

  const resourceTypeHandler = (e) => {
    e.preventDefault();
    console.log(
      `resourcetypehandler fired\nresourceType: ${resourceType}\ne.target: ${e.target}\ne.target.id: ${e.target.id}`
    );
    setResourceType(e.target.id);
  };

  const progressFilterHandler = (e) => {
    setProgressFilter(e.target.value);
  };

  const handleLogout = (e) => {
    setIsAuthenticated(false);
  };

  // render jsx
  return (
    <div className="App">
      <main>
        {!isAuthenticated ? (
          <Auth setIsAuthenticated={setIsAuthenticated} setToken={setToken} setUser={setUser}/>
        ) : (
          <div className="protected">
            <Nav
              user={user}
              resourceType={resourceType}
              resourceTypeHandler={resourceTypeHandler}
              handleLogout={handleLogout}
            />
            <ResourceSummary
              resourceType={resourceType}
              resources={resources[resourceType]}
              progressFilterHandler={progressFilterHandler}
            />
            <section className="panel">
              <ResourceList
                resourceType={resourceType}
                resources={resources}
                setResources={setResources}
                progressFilter={progressFilter}
                setProgressFilter={setProgressFilter}
                token={token}
              />
            </section>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;

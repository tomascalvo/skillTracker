import React from "react";

const Nav = ({
  user,
  resourceType,
  resourceTypeHandler,
  handleLogout,
}) => {
  // link specs: iterate over this array of objects to render a nav
  const linkSpecs = [
    {
      title: "Skills",
      value: "skills",
      glyph: "wrench",
      route: "/skills",
    },
    {
      title: "Projects",
      value: "projects",
      glyph: "code",
      route: "/projects",
    },
    {
      title: "Certifications",
      value: "certifications",
      glyph: "certificate",
      route: "/certifications",
    },
    {
      title: "Answers",
      value: "answers",
      glyph: "comments",
      route: "/answers",
    },
    {
      title: "Flashcards",
      value: "flashcards",
      glyph: "calendar",
      route: "/flashcards",
    },
  ];

  // render lis with event handler
  const lis = linkSpecs.map((linkSpec, i) => (
    <li
      key={i}
      className={linkSpec.value === resourceType ? "active" : ""}
      onClick={resourceTypeHandler}
      id={linkSpec.value}
    >
      <i className={`fas fa-${linkSpec.glyph}`} title={linkSpec.title}></i>
      <h3>{linkSpec.title}</h3>
    </li>
  ));

  return (
    <nav className="navbar glass">
      <h3 className="appTitle">skillTracker</h3>
      <ul>{lis}</ul>
        <div className="user" onClick={handleLogout}>
          <div className="user-info">
            <h3>{user.name || "user.name goes here"}</h3>
            <p>{user.title || "learner"}</p>
          </div>
          <div className="portrait-container"></div>
        </div>
    </nav>
  );
};

export default Nav;

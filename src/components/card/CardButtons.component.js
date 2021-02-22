import React from "react";

const CardButtons = ({
  tab,
  resourceType,
  document,
  mode,
  tabHandler,
  expanded,
  expansionHandler,
  quizHandler,
  toEditMode,
  editHandler,
  deleteHandler,
  clearHandler,
  submitHandler,
}) => {
  let buttons = [
    {
      title: !expanded ? "expand" : "compress",
      glyph: !expanded ? "expand-arrows-alt": "compress-arrows-alt",
      onClick: expansionHandler,
      value: "description",
    },
  ];

  if (resourceType !== "answers") {
    buttons = [...buttons,     {
      value: "description",
      glyph: "microscope",
      onMouseOver: tabHandler,
      onFocus: tabHandler,
    }];
  }

  if (resourceType === "skills") {
    buttons = [
      ...buttons,
      {
        value: "projects",
        glyph: "code",
        onMouseOver: tabHandler,
        onFocus: tabHandler,
      },
      {
        value: "certifications",
        glyph: "certificate",
        onMouseOver: tabHandler,
        onFocus: tabHandler,
      },
      {
        value: "answers",
        glyph: "comments",
        onMouseOver: tabHandler,
        onFocus: tabHandler,
      },
      {
        value: "prerequisites",
        glyph: "flask",
        onMouseOver: tabHandler,
        onFocus: tabHandler,
      },
      {
        value: "flashcards",
        glyph: "brain",
        onMouseOver: tabHandler,
        onFocus: tabHandler,
        onClick: quizHandler,
      },
    ];
  }

  if (resourceType !== "skills") {
    buttons = [
      ...buttons,
      {
        value: "skills",
        glyph: "dumbbell",
        onMouseOver: tabHandler,
        onFocus: tabHandler,
      },
    ];
  }

  if (mode === "display") {
    buttons = [
      ...buttons,
      {
        value: "edit",
        glyph: "edit",
        onMouseOver: tabHandler,
        onFocus: tabHandler,
        url:`/${resourceType}/edit/${document._id}`,
        onClick: toEditMode,
      },
      {
        value: "delete",
        glyph: "trash",
        onMouseOver: tabHandler,
        onFocus: tabHandler,
        onClick: deleteHandler,
      },
    ];
  }

  if (mode === "add" || mode === "edit") {
    buttons = [
      ...buttons,
      {
        value: "clear",
        title: "Clear Changes",
        glyph: "snowplow",
        onClick: clearHandler,
      },
      {
        value: "submit",
        title: "Submit",
        glyph: "plus",
        onClick: submitHandler,
      },
    ];
  }

  if (tab === "confirm-add") {
    buttons = [];
  }

  function makeButtonXml(btn, index) {
    return (
        <button
          key={index}
          className={btn.value.toLowerCase() + "-btn"}
          title={btn.value}
          value={btn.value}
          onMouseOver={btn.onMouseOver ? btn.onMouseOver : undefined}
          onClick={btn.onClick ? btn.onClick : undefined}
          onFocus={btn.onFocus ? btn.onFocus : undefined}
        >
          <i className={"fas fa-" + btn.glyph}></i>
        </button>
    );
  }
  return (
    <div className="skill-btns">
      {buttons.map((btn, index) => makeButtonXml(btn, index))}
    </div>
  );
};

export default CardButtons;

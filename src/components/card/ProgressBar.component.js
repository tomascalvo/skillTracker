import React from "react";

const ProgressBar = ({ document }) => {
  return (
    <div className="progress-container">
      <div
        className="progress-bar"
        style={{
          top: `${100 - (document.progress * 100)}%`,
          height: `${document.progress * 100}%`
        }}
      ></div>
    </div>
  );
};

export default ProgressBar;

import React from "react";

const ProgressSelect = ({
  // pass in props
  progressFilterHandler,
}) => {
  // manage state (no state object needed for this component)

  return (
    <div className="filter">
      <select name="progress" onChange={progressFilterHandler}>
        <option value="all">all</option>
        <option value="proficient">proficient/complete</option>
        <option value="in progress">in progress</option>
      </select>
    </div>
  );
};

export default ProgressSelect;
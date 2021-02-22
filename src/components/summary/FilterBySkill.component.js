import React from "react";

const Checkboxes = React.memo(({
    skills,
    filterHandler,
}) => {
    console.log('Render: FilterBySkill')
    return (
        <div className="filter-by-skill">
        <h2>Filter projects by skill: </h2>
        <form>
            {skills.map((skill) => (
                <Checkbox key={skill._id} skill={skill} />
            ))}
        </form>
    </div>
    );
});

const Checkbox = React.memo(({ skill, filterHandler }) => {
    console.log('Render: Checkbox ' + skill.name);
    return (
        <div 
            className="checkbox" 
            // key={'skillOptionCheckbox' + index}
        >
        <input 
            type="checkbox" 
            name="skill" 
            value="{skill.id}" 
            id={skill._id} 
            // key={'skillOptionInput' + index}
            onClick={filterHandler}
        ></input>
        <label 
            htmlFor={skill._id}
            // key={"skillOptionLabel" + index}
        >
            {skill.name}
        </label>
    </div>
    );
});

export default Checkboxes;
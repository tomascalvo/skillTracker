const router = require("express").Router();
let Project = require("../models/project.model");

router.route("/add").post((req, res) => {
    const { title, name, description, href, status } = req.body;

    const newProject = new Project({
        title: title,
        name: name,
        description: description,
        href: href,
        status: status
    });
    
    newProject
        .save()
        .then(() => res.json("Project added"))
        .catch(err => res.status(400).json("Error: " + err))

});

router.route("/").get((req, res) => {
    Project.find()
        .then(projects => res.json(projects))
        .catch(err => res.status(400).json("Error: " + err));
});

router.route("/skill/:id").get((req, res) => {
    Project.findById(req.params.id)
        .populate("projects")
        .then(skill => res.json(skill.projects))
        .catch(err => res.status(400).json("error getting projects by skill_id: " + err));
})

router.route("/edit/:id").put((req, res) => {
    Project.findByIdAndUpdate(
        req.params.id,
        {
            $set: req.body // mongoDB $set operator replaces the value of a field with the specified value
        },
        (error, data) => {
            if (error) {
                console.log(error);
            } else {
                res.json(data);
                console.log("Project updated successfully");
            }
        }
    );
});

router.route("/:id").delete((req, res, next) => {
    console.log(req.params.id);
    Project.findByIdAndRemove(req.params.id, (error, data) => {
        if (error) {
            return next(error);
        } else {
            res.status(200).json({
                msg: data
            });
        }
    });
});

module.exports = router;
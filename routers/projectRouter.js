const express = require("express");

const projects = require("../data/helpers/projectModel");

const router = express.Router();

router.get("/", (req, res) => {
  projects
    .get()
    .then(act => {
      res.status(200).json(act);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        Message: "Can't get action"
      });
    });
});

router.get("/:id", (req, res) => {
  const id = req.params.id;
  projects
    .get(id)
    .then(act => {
      if (act) {
        res.status(200).json(act);
      } else {
        res.status(404).json({ message: "ID not found" });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        Message: "Id is doesn't exist"
      });
    });
});

router.post("/:id", (req, res) => {
  projects
    .insert(req.body)
    .then(project => {
      res.status(201).json(project);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: "Error adding the hub"
      });
    });
});

router.post("/:id/projects", validateProId, (req, res) => {
  const id = req.params.id;
  const project = req.body;
  projects
    .insert(id)
    .then(project => {
      res.status(201).json(project);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: "Error getting the action"
      });
    });
});

router.put("/:id", validateProId, (req, res) => {
  const project = req.body;
  console.log(req.project.id);
  console.log(project);
  if (Object.keys(project).length === 0) {
    return res.status(400).json({ message: "Enter description here" });
  } else if (!req.body.name) {
    return res.status(400).json({ message: "Add a name" });
  } else if (!req.body.description) {
    return res.status(400).json({ message: "Add a description" });
  } else
    projects
      .update(req.project.id, project)
      .then(project => {
        res.status(200).json({ message: "Project has been updated." });
      })
      .catch(error => {
        res.status(500).json({ message: "Post has not been updated." });
      });
});

function validateProId(req, res, next) {
  const id = req.params.id;
  projects.get(id);
  next();
}
module.exports = router;

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

router.post("/", (req, res) => {
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

router.post("/:id", validateProId, (req, res) => {
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

router.delete("/:id", validateProId, (req, res) => {
  projects
    .remove(req.params.id)
    .then(count => {
      if (count > 0) {
        res.status(200).json({ message: "The project has been removed" });
      } else {
        res.status(404).json({ message: "The project could not be found" });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: "Error removing the project"
      });
    });
});

router.put("/:id", validateProId, (req, res) => {
  const id = req.params.id;
  const project = { ...req.body };
  projects
    .update(id, project)
    .then(project => {
      projects.get(id);
      if (!id) {
        res.status(404).json({
          message: "The project with the id does not exist."
        });
      } else if (!req.body.name || !req.body.description) {
        res.status(400).json({
          message: "Please provide description and name for the project."
        });
      } else {
        res.status(200).json(project);
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        error: "The project information could not be updated."
      });
    });
});

router.get("/:id/actions", validateProId, (req, res) => {
  const { id } = req.params;

  projects
    .getProjectActions(id)
    .then(project => {
      res.status(200).json(project);
    })
    .catch(error => {
      res.status(500).json({ error: "Actions can not be listed" });
    });
});

function validateProId(req, res, next) {
  const { id } = req.params;
  projects
    .get(id)
    .then(project => {
      if (project) {
        req.project = project;
        next();
      } else {
        res.status(400).json({ message: "Try and Try again" });
      }
    })
    .catch(error => {
      res.status(500).json({ error: "next time Luck ", error });
    });
}

module.exports = router;

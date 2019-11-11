const express = require("express");

const actions = require("../data/helpers/actionModel");

const router = express.Router();

router.get("/", (req, res) => {
  actions
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
  actions
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

router.delete("/:id", validateId, (req, res) => {
  actions
    .remove(req.params.id)
    .then(count => {
      if (count > 0) {
        res.status(200).json({ message: "The action has been removed" });
      } else {
        res.status(404).json({ message: "The action could not be found" });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: "Error removing the actions"
      });
    });
});

router.post("/", (req, res) => {
  actions
    .insert(req.body)
    .then(hub => {
      res.status(201).json(hub);
    })
    .catch(error => {
      // log error to server
      console.log(error);
      res.status(500).json({
        message: "Error adding the hub"
      });
    });
});

router.post("/:id/actions", validateId, (req, res) => {
  const changes = { ...req.body, project_id: req.params.id };

  actions
    .insert(changes)
    .then(message => {
      res.status(210).json(message);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: "Error getting the action"
      });
    });
});

router.put("/", validateId, (req, res) => {
  const changes = { ...req.body, project_id: req.params.id };

  actions
    .update(changes)
    .then(message => {
      res.status(210).json(message);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: "Error getting the action"
      });
    });
});

router.put("/:id/actions", (req, res) => {
  const changes = { ...req.body, project_id: req.actions.project_id };
  actions
    .update(id, changes)
    .then(action => {
      if (!id) {
        res.status(404).json({
          message: "The action with the specified ID does not exist."
        });
      } else if (!req.body.project_id || !req.body.description) {
        res.status(400).json({
          message: "Please provide project_id and description for the action."
        });
      } else {
        res.status(200).json(action);
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        error: "The action information could not be modified."
      });
    });
});

function validateId(req, res, next) {
  const { id } = req.params;
  actions
    .get(id)
    .then(user => {
      if (user) {
        req.user = user;
        next();
      } else {
        res.status(400).json({ message: "invalid user id" });
      }
    })
    .catch(message => {
      res.status(500).json({ message: "The id entered don't match" });
    });
}
module.exports = router;

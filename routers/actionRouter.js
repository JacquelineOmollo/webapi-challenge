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

router.put("/:id", validateId, (req, res) => {
  const change = { ...req.body, project_id: req.project_id };
  const id = req.params.id;

  actions
    .update(id, change)
    .then(action => {
      actions.get(id);
      if (!id) {
        res.status(404).json({
          message: "The action with the does not exist."
        });
      } else if (
        !req.body.project_id ||
        !req.body.description ||
        !req.body.notes
      ) {
        res.status(400).json({
          message: "Please provide description for the action."
        });
      } else {
        res.status(200).json(actions);
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        error: "The action information could not be updated."
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

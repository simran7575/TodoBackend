const express = require("express");
const router = express.Router();
const {
  createTask,
  getLoggedInUserTasks,
  updateTask,
  getOneTask,
} = require("../controllers/taskController");
const { isLoggedIn } = require("../middlewares/user");

// task api
router.route("/task/create").post(isLoggedIn, createTask);
router.route("/mytasks").get(isLoggedIn, getLoggedInUserTasks);
router.route("/task/update").put(isLoggedIn, updateTask);
router.route("/onetask").get(isLoggedIn, getOneTask);

module.exports = router;

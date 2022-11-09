const BigPromise = require("../middlewares/bigPromise");
const Task = require("../models/task");
const User = require("../models/user");
const CustomError = require("../utils/customError");

exports.createTask = BigPromise(async (req, res, next) => {
  const { title, description } = req.body;
  if (!title && !description) {
    return res
      .status(200)
      .json(CustomError("Please provide title and description", 400));
  }

  const task = await Task.create({
    title,
    description,
    user: req.user._id,
  });

  return res.status(200).json({
    success: true,
    message: "Task Created",
    task,
  });
});

exports.getLoggedInUserTasks = BigPromise(async (req, res, next) => {
  const tasks = await Task.find({ user: req.user._id }).sort({ $natural: -1 });
  if (!tasks) {
    return res.status(200).json(CustomError("No Tasks found", 404));
  }

  return res.status(200).json({
    success: true,
    tasks,
  });
});
exports.updateTask = BigPromise(async (req, res, next) => {
  let task = await Task.findById(req.query.id);
  if (!task) {
    return res.status(200).json(CustomError("No Task found", 404));
  }
  if (task.status == "Completed" || task.status == "Cancelled") {
    return res
      .status(200)
      .json(CustomError(`Task is already ${task.status} `, 401));
  }
  //Ongoing or Completed
  if (req.body.status == "Ongoing") {
    task.status = "Ongoing";
    await task.save();
  } else if (req.body.status == "Completed" || req.body.status == "Cancelled") {
    task.status = req.body.status;
    task.taskCompletionTime = Date.now();
    await task.save();
  }

  return res.status(200).json({
    success: true,
    task,
  });
});

exports.getOneTask = BigPromise(async (req, res, next) => {
  const task = await Task.findById(req.query.id);
  if (!task) {
    return res.status(200).json(CustomError("No Task found", 404));
  }

  return res.status(200).json({
    success: true,
    task,
  });
});

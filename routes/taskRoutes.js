import express from "express";
import Task from "../models/task";

const router = express.Router();

router.get("/analysis/search", async (req, res, next) => {
  try {
    const keyword = req.query.keyword ? req.query.keyword.toLowerCase() : "";
    const allTasks = await Task.find();

    let filtered = allTasks.filter((task) => {
      const inTitle = task.title.toLowerCase().includes(keyword);
      const inDesc =
        task.description && task.description.toLowerCase().includes(keyword);

      const inTags = task.tags.some((tag) =>
        tag.toLowerCase().includes(keyword),
      );

      return inTitle || inDesc || inTags;
    });

    if (req.query.sort === "priority") {
      filtered.sort((a, b) => b.priority - a.priority);
    }

    res.status(200).json({
      success: true,
      algorithm: "In-memory Filter & Sort",
      count: filtered.length,
      data: filtered,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const tasks = await Task.find();
    res.status(200).json({ success: true, count: tasks.length, data: tasks });
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const task = await Task.findByIdAndUpdate(req.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!task)
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    res.status(200).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Task deleted" });
  } catch (error) {
    next(error);
  }
});

export default router;

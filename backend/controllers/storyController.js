import Story from "../models/Story.js";

// CREATE STORY (Admin + HR)
export const create = async (req, res) => {
  try {
    if (!req.body.project_id || !req.body.title || !req.body.story_points) {
      return res.status(400).json({
        error: "project_id, title, and story_points are required"
      });
    }

    const story = await Story.create(req.body);
    res.status(201).json({ success: true, data: story });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET ALL STORIES (Admin + HR)
export const getAll = async (req, res) => {
  try {
    const stories = await Story.find()
      .populate("project_id", "name")
      .populate("assigned_employee", "name");

    res.json({ success: true, data: stories });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// EMPLOYEE: GET ONLY ASSIGNED STORIES
export const getAssignedStories = async (req, res) => {
  try {
    console.log("User ID:", req.user.id);

    const allStories = await Story.find();

    const stories = await Story.find({
      assigned_employee: req.user.id   
    });

    res.json({ success: true, data: stories });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET ONE STORY
export const getOne = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id)
      .populate("project_id", "name")
      .populate("assigned_employee", "name");

    if (!story) return res.status(404).json({ error: "Story NOT Found" });

    // Employee restriction: only see their own stories
    if (req.user.role === "Employee" &&
        String(story.assigned_employee) !== String(req.user.id)) {
      return res.status(403).json({ error: "Forbidden" });
    }

    res.json({ success: true, data: story });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE STORY
export const update = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) return res.status(404).json({ error: "Story NOT Found" });

    // Employee check — they can only update status
    if (req.user.role === "Employee") {
      if (String(story.assigned_employee) !== String(req.user.id)) {
        return res.status(403).json({ error: "Forbidden" });
      }
    }

    const updated = await Story.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });

    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE STORY
export const remove = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) return res.status(404).json({ error: "Story NOT Found" });

    // HR only allowed if story is TODO
    if (req.user.role === "HR" && story.status !== "TO_DO") {
      return res.status(403).json({
        error: "HR can delete only TO-DO stories"
      });
    }

    await Story.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Story Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
import WorkCategory from "../models/WorkCategory.js";

/**
 * ✅ Create a new Work Category
 * Admin / Finance only
 */
export const createWorkCategory = async (req, res) => {
  try {
    const { name, allowedBillingTypes, status } = req.body;

    if (!name || !allowedBillingTypes?.length) {
      return res.status(400).json({
        success: false,
        message: "Name and Billing Types are Required"
      });
    }

    const existing = await WorkCategory.findOne({ name });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Work Category already Exists"
      });
    }

    const workCategory = await WorkCategory.create({
      name,
      allowedBillingTypes,
      status
    });

    res.status(201).json({
      success: true,
      data: workCategory
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to Create Work Category",
      error: error.message
    });
  }
};

/**
 * ✅ Get all Work Categories
 * Supports Admin / Finance / Read‑only
 */
export const getAllWorkCategories = async (req, res) => {
  try {
    const { status } = req.query;

    const filter = {};
    if (status) filter.status = status;

    const categories = await WorkCategory.find(filter).sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to Fetch Work Categories",
      error: error.message
    });
  }
};

/**
 * ✅ Get single Work Category by ID
 */
export const getWorkCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await WorkCategory.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Work Category NOT Found"
      });
    }

    res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to Fetch Work Category",
      error: error.message
    });
  }
};

/**
 * ✅ Update Work Category
 * Admin / Finance only
 */
export const updateWorkCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const category = await WorkCategory.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Work Category NOT Found"
      });
    }

    Object.keys(updates).forEach((key) => {
      category[key] = updates[key];
    });

    await category.save();

    res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to Update Work Category",
      error: error.message
    });
  }
};

/**
 * ✅ Soft Delete (Deactivate) Work Category
 * Never hard delete
 */
export const deactivateWorkCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await WorkCategory.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Work Category NOT Found"
      });
    }

    category.status = "Inactive";
    await category.save();

    res.status(200).json({
      success: true,
      message: "Work Category Deactivated Successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to Deactivate Work Category",
      error: error.message
    });
  }
};

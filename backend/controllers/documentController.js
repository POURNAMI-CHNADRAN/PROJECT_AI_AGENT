import Document from "../models/Document.js";

export const uploadDocument = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ error: "No file uploaded" });

    const { employee_id } = req.body;

    const doc = await Document.create({
      employee_id,
      name: req.file.originalname,
      fileUrl: `/uploads/${req.file.filename}`,
      fileType: req.file.mimetype
    });

    res.json({ success: true, data: doc });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getDocumentsByEmployee = async (req, res) => {
  try {
    const docs = await Document.find({ employee_id: req.params.employeeId });

    res.json({ success: true, data: docs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
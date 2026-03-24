import Client from "../models/Client.js";

// ➤ CREATE CLIENT
export const createClient = async (req, res) => {
  try {
    const { client_name } = req.body;

    // Check duplicate client
    const exists = await Client.findOne({ client_name, isActive: true });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Client already Exists"
      });
    }

    const client = await Client.create(req.body);

    res.json({ success: true, data: client });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};


// ➤ GET ALL CLIENTS (Active + Inactive)
export const getClients = async (req, res) => {
  try {
    const clients = await Client.find().sort({ client_name: 1 });
    res.json({ success: true, data: clients });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// ➤ GET A SINGLE CLIENT
export const getClientById = async (req, res) => {
  const client = await Client.findById(req.params.id);

  if (!client || !client.isActive) {
    return res.status(404).json({
      success: false,
      message: "Client NOT Found"
    });
  }

  res.json({ success: true, data: client });
};


// ➤ UPDATE CLIENT
export const updateClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({ success: true, data: client });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};


// ➤ SOFT DELETE CLIENT
export const deleteClient = async (req, res) => {
  await Client.findByIdAndUpdate(req.params.id, { isActive: false });

  res.json({
    success: true,
    message: "Client Archived Successfully"
  });
};
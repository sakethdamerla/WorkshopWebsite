import express from 'express';
import Workshop from '../models/Workshop.js';
import Student from '../models/student.js';
import Registration from '../models/registration.js';

const router = express.Router();

// Get all workshops
router.get('/', async (req, res) => {
  try {
    const workshops = await Workshop.find();
    res.json(workshops);
  } catch (error) {
    console.error('Error fetching workshops:', error);
    res.status(500).json({ message: 'Failed to fetch workshops.' });
  }
});

// Create a new workshop
router.post('/', async (req, res) => {
  const { title, description, image, date } = req.body;
  if (!title || !description || !image || !date) {
    return res.status(400).json({ message: 'All workshop fields are required' });
  }
  try {
    const newWorkshop = new Workshop({ title, description, image, date, registrations: [] });
    await newWorkshop.save();
    res.status(201).json({ message: 'Workshop created successfully', workshop: newWorkshop });
  } catch (error) {
    console.error('Error creating workshop:', error);
    res.status(500).json({ message: 'Failed to create workshop.' });
  }
});

// Delete a workshop
router.delete('/:workshopId', async (req, res) => {
    try {
        const workshopId = req.params.workshopId;
        const deletedWorkshop = await Workshop.findByIdAndDelete(workshopId);

        if (!deletedWorkshop) {
            return res.status(404).json({ message: "Workshop not found" });
        }

        res.json({ message: "Workshop deleted successfully" });
    } catch (error) {
        console.error("Error deleting workshop:", error);
        res.status(500).json({ message: "Failed to delete workshop" });
    }
});


// Register a student for a workshop
router.post('/:workshopId/register', async (req, res) => {
    const workshopId = req.params.workshopId;
    const { studentEmail } = req.body;
    if (!studentEmail) {
        return res.status(400).json({ message: "Student email is required." });
    }
    try {
        const student = await Student.findOne({ email: studentEmail });
        if (!student) return res.status(404).json({ message: "Student not found." });

        const workshop = await Workshop.findById(workshopId);
        if (!workshop) return res.status(404).json({ message: "Workshop not found." });

        const existingRegistration = await Registration.findOne({ student: student._id, workshop: workshop._id });
        if (existingRegistration) {
            return res.status(409).json({ message: "Student already registered for this workshop." });
        }

        const newRegistration = new Registration({ student: student._id, workshop: workshop._id });
        await newRegistration.save();

        workshop.registrations.push(studentEmail);
        await workshop.save();

        res.status(200).json({ message: "Successfully registered!", registration: newRegistration });
    } catch (error) {
        console.error("Error registering for workshop:", error);
        res.status(500).json({ message: "Failed to register for workshop." });
    }
});

export default router;
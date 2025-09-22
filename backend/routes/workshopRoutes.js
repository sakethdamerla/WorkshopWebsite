import express from 'express';
import Workshop from '../models/Workshop.js';
import Student from '../models/student.js';
import Registration from '../models/registration.js';

const router = express.Router();

// Get all workshops
router.get('/', async (req, res) => {
  try {
    const workshops = await Workshop.find().populate('registrations');
    const formattedWorkshops = workshops.map(workshop => ({
      ...workshop.toObject(),
      registrations: workshop.registrations.map(reg => reg.email) // Assuming 'email' is a field in your Student model
    }));
    res.json(formattedWorkshops);
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
    const { studentEmail, phoneNumber } = req.body;
    if (!studentEmail || !phoneNumber) {
        return res.status(400).json({ message: "Student email and phone number are required." });
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

        const newRegistration = new Registration({ student: student._id, workshop: workshop._id, phoneNumber });
        await newRegistration.save();

        workshop.registrations.push(student._id);
        await workshop.save();

        res.status(200).json({ message: "Successfully registered!" });
    } catch (error) {
        console.error("Detailed error during registration:", error);
        res.status(500).json({ message: "Failed to register for workshop." });
    }
});

// Get registered workshops for a student
router.get('/registered-workshops/:email', async (req, res) => {
    try {
        const studentEmail = req.params.email;
        const student = await Student.findOne({ email: studentEmail });

        if (!student) {
            return res.status(404).json({ message: "Student not found." });
        }

        const registrations = await Registration.find({ student: student._id }).populate('workshop');
        const registeredWorkshops = registrations.map(reg => reg.workshop);

        res.status(200).json(registeredWorkshops);
    } catch (error) {
        console.error("Error fetching registered workshops:", error);
        res.status(500).json({ message: "Failed to fetch registered workshops." });
    }
});

// Get all registrations for a specific workshop
router.get('/:workshopId/registrations', async (req, res) => {
    try {
        const workshopId = req.params.workshopId;
        const registrations = await Registration.find({ workshop: workshopId })
            .populate({
                path: 'student',
                select: 'name email' // Select specific fields from the student
            })
            .populate('workshop');

        // Format the registrations to include student details and phone number
        const formattedRegistrations = registrations.map(reg => ({
            _id: reg._id,
            studentName: reg.student ? reg.student.name : 'N/A',
            studentEmail: reg.student ? reg.student.email : 'N/A',
            phoneNumber: reg.phoneNumber,
            registeredAt: reg.registeredAt,
            workshopTitle: reg.workshop ? reg.workshop.title : 'N/A',
        }));

        res.status(200).json({ registrations: formattedRegistrations });
    } catch (error) {
        console.error("Error fetching workshop registrations:", error);
        res.status(500).json({ message: "Failed to fetch workshop registrations." });
    }
});

export default router;
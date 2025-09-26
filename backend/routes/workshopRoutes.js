import express from 'express';
import Workshop from '../models/Workshop.js';
import Student from '../models/student.js';
import Registration from '../models/registration.js';
import multer from 'multer';
import mongoose from 'mongoose';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
// Get all workshops
router.get('/', async (req, res) => {
  try {
    const workshops = await Workshop.find().populate('registrations');
    res.json(workshops);
  } catch (error) {
    console.error('Error fetching workshops:', error);
    res.status(500).json({ message: 'Failed to fetch workshops.' });
  }
});

// Create a new workshop
router.post('/', async (req, res) => {
  const { title, description, image, date, videoUrl, liveUrl } = req.body;
  if (!title || !description || !image || !date) {
    return res.status(400).json({ message: 'All workshop fields are required' });
  }
  try {
    const newWorkshop = new Workshop({ title, description, image, date, videoUrl, liveUrl, registrations: [] });
    await newWorkshop.save();
    res.status(201).json({ message: 'Workshop created successfully', workshop: newWorkshop });
  } catch (error) {
    console.error('Error creating workshop:', error);
    res.status(500).json({ message: 'Failed to create workshop.' });
  }
});

// Get a single workshop by ID
router.get('/:workshopId', async (req, res) => {
  try {
    const { workshopId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(workshopId)) {
      return res.status(400).json({ message: 'Invalid workshop ID format.' });
    }

    const workshop = await Workshop.findById(workshopId);
    if (!workshop) {
      return res.status(404).json({ message: 'Workshop not found.' });
    }
    res.json(workshop);
  } catch (error) {
    console.error('Error fetching workshop details:', error);
    res.status(500).json({ message: 'Failed to fetch workshop details.' });
  }
});

// Update a workshop's video/live URLs
router.put('/:workshopId', upload.single('video'), async (req, res) => {
  try {
    const { workshopId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(workshopId)) {
      return res.status(400).json({ message: 'Invalid workshop ID format.' });
    }

    const { title, description, date, liveUrl, videoUrl } = req.body;

    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (date) updateData.date = date;
    if (liveUrl !== undefined) updateData.liveUrl = liveUrl;
    if (videoUrl !== undefined) updateData.videoUrl = videoUrl;

    if (req.file) {
      console.log('Received video file:', req.file.originalname);
      updateData.video = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
      // When a file is uploaded, we can clear the videoUrl to avoid confusion.
      updateData.videoUrl = '';
    }

    const workshop = await Workshop.findByIdAndUpdate(
      workshopId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!workshop) return res.status(404).json({ message: 'Workshop not found.' });
    res.status(200).json({ message: 'Workshop updated successfully', workshop });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update workshop.', error: error.message });
  }
});

// Get a workshop's uploaded video
router.get('/:workshopId/video', async (req, res) => {
  try {
    const { workshopId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(workshopId)) {
      return res.status(400).json({ message: 'Invalid workshop ID format.' });
    }

    const workshop = await Workshop.findById(workshopId, 'video');
    if (!workshop || !workshop.video || !workshop.video.data) {
      return res.status(404).json({ message: 'Video not found.' });
    }

    const videoData = workshop.video.data;
    const videoSize = videoData.length;
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : videoSize - 1;
      const chunksize = (end - start) + 1;
      
      const head = {
        'Content-Range': `bytes ${start}-${end}/${videoSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': workshop.video.contentType,
      };
      res.writeHead(206, head); // 206 Partial Content
      
      // Create a stream from the buffer chunk and pipe it to the response
      const videoStream = Buffer.from(videoData.slice(start, end + 1));
      res.end(videoStream);
    } else {
      const head = {
        'Content-Length': videoSize,
        'Content-Type': workshop.video.contentType,
      };
      res.writeHead(200, head);
      res.end(videoData);
    }
  } catch (error) {
    console.error('Error fetching workshop video:', error);
    res.status(500).json({ message: 'Failed to fetch video.' });
  }
});
// Delete a workshop
router.delete('/:workshopId', async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { workshopId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(workshopId)) {
            return res.status(400).json({ message: 'Invalid workshop ID format.' });
        }

        const deletedWorkshop = await Workshop.findByIdAndDelete(workshopId, { session });

        if (!deletedWorkshop) {
            return res.status(404).json({ message: "Workshop not found." });
        }

        // Also delete all registrations associated with this workshop
        await Registration.deleteMany({ workshop: workshopId }, { session });

        await session.commitTransaction();
        res.json({ message: "Workshop deleted successfully" });
    } catch (error) {
        await session.abortTransaction();
        console.error("Error deleting workshop:", error);
        res.status(500).json({ message: "Failed to delete workshop." });
    } finally {
        session.endSession();
    }
});


// Register a student for a workshop
router.post('/:workshopId/register', async (req, res) => {
    const { workshopId } = req.params;
    const { studentEmail, phoneNumber } = req.body;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        if (!mongoose.Types.ObjectId.isValid(workshopId)) {
            return res.status(400).json({ message: 'Invalid workshop ID format.' });
        }

        const student = await Student.findOne({ email: studentEmail });
        if (!student) return res.status(404).json({ message: "Student not found." });

        const workshop = await Workshop.findById(workshopId).session(session);
        if (!workshop) return res.status(404).json({ message: "Workshop not found." });

        const existingRegistration = await Registration.findOne({ student: student._id, workshop: workshop._id }).session(session);
        if (existingRegistration) {
            return res.status(409).json({ message: "Student already registered for this workshop." });
        }

        const newRegistration = new Registration({ student: student._id, workshop: workshop._id, phoneNumber: phoneNumber || 'Not Provided' });
        await newRegistration.save({ session });

        workshop.registrations.push(newRegistration._id);
        await workshop.save({ session });

        await session.commitTransaction();

        res.status(200).json({ message: "Successfully registered!" });
    } catch (error) {
        await session.abortTransaction();
        console.error("Detailed error during registration:", error);
        res.status(500).json({ message: "Failed to register for workshop." });
    } finally {
        session.endSession();
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
        // Filter out any null workshops that may result from deleted workshops
        // that still have registrations.
        const registeredWorkshops = registrations.map(reg => reg.workshop).filter(Boolean);

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
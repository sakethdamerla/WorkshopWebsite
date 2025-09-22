
import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  workshop: { type: mongoose.Schema.Types.ObjectId, ref: 'Workshop', required: true },
  registeredAt: { type: Date, default: Date.now },
  phoneNumber: { type: String, required: true },
});

const Registration = mongoose.model('Registration', registrationSchema);

export default Registration;

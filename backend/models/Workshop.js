import mongoose from 'mongoose';

const workshopSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  date: { type: Date, required: true },  registrations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Registration' }],
  videoUrl: { type: String },
  liveUrl: { type: String },
  video: {
    data: Buffer,
    contentType: String,
  },
});

const Workshop = mongoose.model('Workshop', workshopSchema);

export default Workshop;

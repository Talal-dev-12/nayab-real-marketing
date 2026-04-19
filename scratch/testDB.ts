import { connectDB } from '../src/lib/mongodb';
import { Property } from '../src/models/Property';
import { User } from '../src/models/User';
import mongoose from 'mongoose';

async function check() {
  await connectDB();
  console.log("Connected to DB");

  const sellers = await User.find({ role: 'seller' }).select('_id name email');
  console.log("Sellers:");
  for (const s of sellers) {
    console.log(`- ${s.name} (${s.email}) ID: ${s._id}`);
  }

  const properties = await Property.find({}).select('title submittedBy agentId _id approvalStatus');
  console.log("\nProperties:");
  for (const p of properties) {
    console.log(`- ${p.title} | submittedBy: ${p.submittedBy} | agentId: ${p.agentId} | approvalStatus: ${p.approvalStatus}`);
  }

  mongoose.connection.close();
}

check().catch(console.error);

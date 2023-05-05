import mongoose from 'mongoose';

const uri = process.env.MONGO_URI || '';

async function main () {
  await mongoose.connect(uri);
  console.log('Connected on main');
}
main().catch(err => console.log(err));
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function () {
  console.log('DB Connected successfully');
});


export default mongoose;

import mongoose from "mongoose";
const connectdb = async () => {
    mongoose.connection.on('connected', () => {
        console.log("DB Connected");
    })
    await mongoose.connect(`${process.env.MONGODB_URI}/Supervisor-Allotment`)
}
export default connectdb
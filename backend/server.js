import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import adminRouter from "./routes/adminRoute.js";
import doctorRouter from "./routes/doctorRoute.js";
import userRouter from "./routes/userRoute.js";
import doctorModel from "./models/doctorModel.js";
import bcrypt from "bcrypt";

// app config
const app = express();
const port = process.env.PORT || 4000;

// Connect to database (CALL THE FUNCTION)
connectDB();
connectCloudinary();

// middlewares
app.use(express.json());
app.use(cors());

// api endpoints
app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/user", userRouter);

app.get("/", (req, res) => {
  res.send("API Working");
});

app.get("/test-db", (req, res) => {
  const state = mongoose.connection.readyState;
  // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  if (state === 1) {
    res.send("Database is connected");
  } else {
    res.status(500).send("Database is NOT connected");
  }
});

// Seed doctors endpoint
app.get("/seed-doctors", async (req, res) => {
  try {
    // Check if doctors already exist
    const existingDoctors = await doctorModel.countDocuments();
    if (existingDoctors > 0) {
      return res.json({
        success: true,
        message: "Doctors already exist in database",
        count: existingDoctors,
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("doctor123", salt);

    const sampleDoctors = [
      {
        name: "Dr. Richard James",
        email: "james@example.com",
        password: hashedPassword,
        image: "https://via.placeholder.com/150?text=Dr.+James",
        speciality: "General Physician",
        degree: "MBBS",
        experience: "4 Years",
        about:
          "Dr. Richard James is a dedicated and compassionate healthcare professional with a passion for patient care.",
        fees: 50,
        address: { line1: "Medical Plaza, Sector 5", line2: "New York, USA" },
        date: Date.now(),
        available: true,
      },
      {
        name: "Dr. Emily Larson",
        email: "emily@example.com",
        password: hashedPassword,
        image: "https://via.placeholder.com/150?text=Dr.+Emily",
        speciality: "Gynecologist",
        degree: "MD",
        experience: "3 Years",
        about:
          "Dr. Emily Larson specializes in gynecology with extensive experience in women health care.",
        fees: 60,
        address: { line1: "Care Center, Main Street", line2: "London, UK" },
        date: Date.now(),
        available: true,
      },
      {
        name: "Dr. Sarah Patel",
        email: "sarah@example.com",
        password: hashedPassword,
        image: "https://via.placeholder.com/150?text=Dr.+Sarah",
        speciality: "Dermatologist",
        degree: "MBBS",
        experience: "5 Years",
        about:
          "Dr. Sarah Patel is an experienced dermatologist with focus on skin health and treatment.",
        fees: 55,
        address: { line1: "Beauty Health Clinic", line2: "Paris, France" },
        date: Date.now(),
        available: true,
      },
      {
        name: "Dr. Christopher Lee",
        email: "christopher@example.com",
        password: hashedPassword,
        image: "https://via.placeholder.com/150?text=Dr.+Lee",
        speciality: "Neurologist",
        degree: "MD",
        experience: "6 Years",
        about:
          "Dr. Christopher Lee specializes in neurological disorders and brain health.",
        fees: 70,
        address: {
          line1: "Neuro Center, Medical Plaza",
          line2: "Tokyo, Japan",
        },
        date: Date.now(),
        available: true,
      },
      {
        name: "Dr. Jennifer Garcia",
        email: "jennifer@example.com",
        password: hashedPassword,
        image: "https://via.placeholder.com/150?text=Dr.+Jennifer",
        speciality: "Pediatrician",
        degree: "MBBS",
        experience: "3 Years",
        about:
          "Dr. Jennifer Garcia provides compassionate care for children and infants.",
        fees: 45,
        address: { line1: "Child Health Center", line2: "Berlin, Germany" },
        date: Date.now(),
        available: true,
      },
    ];

    await doctorModel.insertMany(sampleDoctors);
    res.json({
      success: true,
      message: "Sample doctors added successfully",
      count: sampleDoctors.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

app.listen(port, () => console.log(`Server started on PORT:${port}`));

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { Kafka } = require("kafkajs");

const app = express();
const PORT = 4003;

app.use(cors());
app.use(express.json());

// =====================
// MongoDB Connection
// =====================

mongoose
  .connect("mongodb://127.0.0.1:27017/smart_clinic_notifications")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB error:", err));

const notificationSchema = new mongoose.Schema({
  message: String,
  type: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Notification = mongoose.model("Notification", notificationSchema);

// =====================
// Kafka Consumer
// =====================

const kafka = new Kafka({
  clientId: "notification-service",
  brokers: ["localhost:9092"],
});

const consumer = kafka.consumer({
  groupId: "notification-group",
});

async function startConsumer() {
  await consumer.connect();
  console.log("Kafka Consumer connected");

  await consumer.subscribe({
    topic: "appointment-created",
    fromBeginning: true,
  });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const data = JSON.parse(message.value.toString());

      const notificationMessage = `Rendez-vous créé pour le patient ${data.patientId} avec ${data.doctor} le ${data.date}`;

      await Notification.create({
        message: notificationMessage,
        type: "APPOINTMENT_CREATED",
      });

      console.log("New notification saved in MongoDB:");
      console.log(notificationMessage);
    },
  });
}

startConsumer().catch((err) => {
  console.log("Kafka Consumer error:", err);
});

// =====================
// Routes
// =====================

app.get("/", (req, res) => {
  res.json({
    message: "Notification Service is running",
  });
});

app.get("/notifications", async (req, res) => {
  try {
    const notifications = await Notification.find().sort({
      createdAt: -1,
    });

    res.json(notifications);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Notification Service running on http://localhost:${PORT}`);
});
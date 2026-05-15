const path = require("path");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const db = require("./database");
const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "appointment-service",
  brokers: ["localhost:9092"],
});

const producer = kafka.producer();

async function connectProducer() {
  await producer.connect();
  console.log("Kafka Producer connected");
}

connectProducer();

const PROTO_PATH = path.join(__dirname, "../proto/appointment.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const appointmentProto =
  grpc.loadPackageDefinition(packageDefinition).appointment;

function GetAllAppointments(call, callback) {
  db.all("SELECT * FROM appointments", [], (err, rows) => {
    if (err) return callback(err);

    callback(null, {
      appointments: rows,
    });
  });
}

function CreateAppointment(call, callback) {
  const { patient_id, date, doctor, status } = call.request;

  db.run(
    "INSERT INTO appointments (patient_id, date, doctor, status) VALUES (?, ?, ?, ?)",
    [patient_id, date, doctor, status],
    function (err) {
      if (err) return callback(err);

      // Envoi événement Kafka
      producer.send({
        topic: "appointment-created",
        messages: [
          {
            value: JSON.stringify({
              patientId: patient_id,
              date,
              doctor,
            }),
          },
        ],
      });

      callback(null, {
        id: this.lastID,
        patient_id,
        date,
        doctor,
        status,
      });
    }
  );
}

const server = new grpc.Server();

server.addService(appointmentProto.AppointmentService.service, {
  GetAllAppointments,
  CreateAppointment,
});

server.bindAsync(
  "127.0.0.1:50052",
  grpc.ServerCredentials.createInsecure(),
  () => {
    console.log("Appointment gRPC Service running on 127.0.0.1:50052");
    server.start();
  }
);
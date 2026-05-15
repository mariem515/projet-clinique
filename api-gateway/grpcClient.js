const path = require("path");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

// =====================
// PATIENT gRPC CLIENT
// =====================

const patientProtoPath = path.join(__dirname, "../proto/patient.proto");

const patientPackageDefinition = protoLoader.loadSync(patientProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const patientProto =
  grpc.loadPackageDefinition(patientPackageDefinition).patient;

const patientGrpcClient = new patientProto.PatientService(
  "127.0.0.1:50051",
  grpc.credentials.createInsecure()
);

// =====================
// APPOINTMENT gRPC CLIENT
// =====================

const appointmentProtoPath = path.join(__dirname, "../proto/appointment.proto");

const appointmentPackageDefinition = protoLoader.loadSync(appointmentProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const appointmentProto =
  grpc.loadPackageDefinition(appointmentPackageDefinition).appointment;

const appointmentGrpcClient = new appointmentProto.AppointmentService(
  "127.0.0.1:50052",
  grpc.credentials.createInsecure()
);

// =====================
// PROMISE WRAPPERS
// =====================

const patientClient = {
  getAllPatients: () => {
    return new Promise((resolve, reject) => {
      patientGrpcClient.GetAllPatients({}, (err, response) => {
        if (err) reject(err);
        else resolve(response.patients);
      });
    });
  },

  getPatientById: (id) => {
    return new Promise((resolve, reject) => {
      patientGrpcClient.GetPatient({ id: Number(id) }, (err, response) => {
        if (err) reject(err);
        else resolve(response);
      });
    });
  },

  createPatient: (data) => {
    return new Promise((resolve, reject) => {
      patientGrpcClient.CreatePatient(data, (err, response) => {
        if (err) reject(err);
        else resolve(response);
      });
    });
  },
};

const appointmentClient = {
  getAllAppointments: () => {
    return new Promise((resolve, reject) => {
      appointmentGrpcClient.GetAllAppointments({}, (err, response) => {
        if (err) reject(err);
        else resolve(response.appointments);
      });
    });
  },

  createAppointment: (data) => {
    return new Promise((resolve, reject) => {
      appointmentGrpcClient.CreateAppointment(data, (err, response) => {
        if (err) reject(err);
        else resolve(response);
      });
    });
  },
};

module.exports = {
  patientClient,
  appointmentClient,
};
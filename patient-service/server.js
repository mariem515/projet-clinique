const path = require("path");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const db = require("./database");

const PROTO_PATH = path.join(__dirname, "../proto/patient.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const patientProto = grpc.loadPackageDefinition(packageDefinition).patient;

function GetAllPatients(call, callback) {
  db.all("SELECT * FROM patients", [], (err, rows) => {
    if (err) {
      return callback(err);
    }
    callback(null, { patients: rows });
  });
}

function GetPatient(call, callback) {
  const id = call.request.id;

  db.get("SELECT * FROM patients WHERE id = ?", [id], (err, row) => {
    if (err) {
      return callback(err);
    }

    if (!row) {
      return callback(null, {
        id: 0,
        nom: "Not found",
        email: "",
        telephone: "",
      });
    }

    callback(null, row);
  });
}

function CreatePatient(call, callback) {
  const { nom, email, telephone } = call.request;

  db.run(
    "INSERT INTO patients (nom, email, telephone) VALUES (?, ?, ?)",
    [nom, email, telephone],
    function (err) {
      if (err) {
        return callback(err);
      }

      callback(null, {
        id: this.lastID,
        nom,
        email,
        telephone,
      });
    }
  );
}

function UpdatePatient(call, callback) {
  const { id, nom, email, telephone } = call.request;

  db.run(
    "UPDATE patients SET nom = ?, email = ?, telephone = ? WHERE id = ?",
    [nom, email, telephone, id],
    function (err) {
      if (err) {
        return callback(err);
      }

      callback(null, {
        id,
        nom,
        email,
        telephone,
      });
    }
  );
}

function DeletePatient(call, callback) {
  const id = call.request.id;

  db.run("DELETE FROM patients WHERE id = ?", [id], function (err) {
    if (err) {
      return callback(err);
    }

    callback(null, {
      success: true,
      message: "Patient deleted successfully",
    });
  });
}

const server = new grpc.Server();

server.addService(patientProto.PatientService.service, {
  GetAllPatients,
  GetPatient,
  CreatePatient,
  UpdatePatient,
  DeletePatient,
});

server.bindAsync(
  "127.0.0.1:50051",
  grpc.ServerCredentials.createInsecure(),
  () => {
    console.log("Patient gRPC Service running on 127.0.0.1:50051");
    server.start();
  }
);
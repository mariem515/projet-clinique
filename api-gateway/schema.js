const { patientClient, appointmentClient } = require("./grpcClient");

const typeDefs = `#graphql

type Patient {
  id: ID!
  nom: String!
  email: String!
  telephone: String!
}

type Appointment {
  id: ID!
  patient_id: Int!
  date: String!
  doctor: String!
  status: String!
}

type Query {
  getAllPatients: [Patient]
  getPatient(id: ID!): Patient
  getAllAppointments: [Appointment]
}

type Mutation {
  createPatient(
    nom: String!
    email: String!
    telephone: String!
  ): Patient

  createAppointment(
    patient_id: Int!
    date: String!
    doctor: String!
    status: String!
  ): Appointment
}
`;

const resolvers = {
  Query: {
    getAllPatients: async () => {
      return await patientClient.getAllPatients();
    },

    getPatient: async (_, { id }) => {
      return await patientClient.getPatientById(id);
    },

    getAllAppointments: async () => {
      return await appointmentClient.getAllAppointments();
    },
  },

  Mutation: {
    createPatient: async (_, args) => {
      return await patientClient.createPatient(args);
    },

    createAppointment: async (_, args) => {
      return await appointmentClient.createAppointment(args);
    },
  },
};

module.exports = {
  typeDefs,
  resolvers,
};
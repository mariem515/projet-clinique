const express = require("express");
const cors = require("cors");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@as-integrations/express4");
const {
  ApolloServerPluginLandingPageLocalDefault,
} = require("@apollo/server/plugin/landingPage/default");

const { typeDefs, resolvers } = require("./schema");
const { patientClient, appointmentClient } = require("./grpcClient");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// =====================
// REST ROUTES
// =====================

app.get("/", (req, res) => {
  res.json({
    message: "Smart Clinic API Gateway is running",
  });
});

app.get("/patients", async (req, res) => {
  try {
    const patients = await patientClient.getAllPatients();
    res.json(patients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/patients/:id", async (req, res) => {
  try {
    const patient = await patientClient.getPatientById(req.params.id);
    res.json(patient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/patients", async (req, res) => {
  try {
    const patient = await patientClient.createPatient(req.body);
    res.status(201).json(patient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/appointments", async (req, res) => {
  try {
    const appointments = await appointmentClient.getAllAppointments();
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/appointments", async (req, res) => {
  try {
    const appointment = await appointmentClient.createAppointment(req.body);
    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =====================
// GRAPHQL
// =====================

async function startServer() {
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: false,
    plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: true })],
  });

  await apolloServer.start();

  app.use(
    "/graphql",
    cors(),
    express.json(),
    expressMiddleware(apolloServer)
  );

  app.listen(PORT, () => {
    console.log(`API Gateway running on http://localhost:${PORT}`);
    console.log(`GraphQL running on http://localhost:${PORT}/graphql`);
  });
}

startServer();
// API Gateway exposes REST and GraphQL endpoints for clients

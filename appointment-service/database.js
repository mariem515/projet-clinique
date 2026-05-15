const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./appointments.db", (err) => {
  if (err) {
    console.error("Erreur SQLite:", err.message);
  } else {
    console.log("Connected to Appointment SQLite database");
  }
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS appointments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      doctor TEXT NOT NULL,
      status TEXT NOT NULL
    )
  `);

  db.run(`
    INSERT INTO appointments (patient_id, date, doctor, status)
    SELECT 1, '2026-05-30', 'Dr Karim', 'confirmed'
    WHERE NOT EXISTS (
      SELECT 1 FROM appointments WHERE patient_id = 1 AND doctor = 'Dr Karim'
    )
  `);
});

module.exports = db;
// SQLite database stores appointment information

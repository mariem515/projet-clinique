const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./patients.db", (err) => {
  if (err) {
    console.error("Erreur SQLite:", err.message);
  } else {
    console.log("Connected to Patient SQLite database");
  }
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS patients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nom TEXT NOT NULL,
      email TEXT NOT NULL,
      telephone TEXT NOT NULL
    )
  `);

  db.run(`
    INSERT INTO patients (nom, email, telephone)
    SELECT 'Patient Test', 'patient@test.com', '22111222'
    WHERE NOT EXISTS (
      SELECT 1 FROM patients WHERE email = 'patient@test.com'
    )
  `);
});

module.exports = db;



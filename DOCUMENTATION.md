# Final Project Documentation

## Smart Clinic Microservices Architecture

This project follows a distributed microservices architecture composed of:

* API Gateway
* Patient Service
* Appointment Service
* Notification Service

---

## Communication Technologies

### REST API

Used between client and API Gateway.

### GraphQL

Used for flexible querying of patients and appointments.

### gRPC

Used between API Gateway and Patient Service.

### Kafka

Used for asynchronous communication between:

* Appointment Service (Producer)
* Notification Service (Consumer)

---

## Databases

### SQLite (SQL)

Used in:

* Patient Service
* Appointment Service

### MongoDB (NoSQL)

Used in:

* Notification Service

---

## Testing Tools

All endpoints were tested using Postman:

* REST requests
* GraphQL queries
* gRPC requests
* Kafka event verification

---

## Final Result

The system successfully demonstrates:

* synchronous communication
* asynchronous communication
* SQL + NoSQL persistence
* API Gateway architecture
* production-like microservices structure
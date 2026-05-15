# Smart Clinic Microservices Project

## Project Overview

This project is a Smart Clinic Management System based on Microservices Architecture using:

* REST API
* GraphQL
* gRPC
* Apache Kafka
* MongoDB (NoSQL)
* SQLite (SQL)
* API Gateway
* Node.js + Express.js

The goal is to demonstrate service communication between multiple independent microservices using modern distributed system architecture.

---

## Microservices Included

### 1. API Gateway

Handles:

* REST requests
* GraphQL queries
* gRPC client communication
* Routing between services

### 2. Patient Service

Handles:

* Patient CRUD operations
* SQLite database
* gRPC server

### 3. Appointment Service

Handles:

* Appointment CRUD operations
* SQLite database
* Kafka Producer for appointment events

### 4. Notification Service

Handles:

* MongoDB storage
* Kafka Consumer for notifications

---

## Technologies Used

* Node.js
* Express.js
* GraphQL
* Apollo Server
* gRPC
* KafkaJS
* MongoDB + Mongoose
* SQLite3
* Postman

---

## Testing

All APIs were tested using Postman:

* REST Collection
* GraphQL Collection
* gRPC Requests
* Kafka Event Verification

---

## Authors

Project realized by:

* Mariem Attia
* Najet Ben Abi Ellotef

Engineering Cycle — Computer Science
SOA & Microservices Project

## Project Status
Project completed successfully and ready for professor evaluation.

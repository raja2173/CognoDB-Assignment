# CognoDB Assignment

## Graph-Based Relationship Explorer

A full-stack web application built using **Angular, Node.js, Express.js, and Neo4j** to demonstrate graph data modeling, Cypher queries, multi-hop graph traversal, and an interactive user interface.

The application allows users to explore relationships between employees, projects, skills, technologies, and companies.

---

## 1. Project Overview

This project demonstrates how a graph database can be used to model and explore connected data.

The application focuses on the following use case:

> Explore employees, the projects they worked on, technologies used by those projects, required skills, and discover related employees through graph relationships.

Instead of treating the data as independent records, the application treats relationships as first-class data.

### Example

An employee can be connected to a project:

Employee → WORKED_ON → Project

The project can then be connected to technologies:

Project → USES_TECHNOLOGY → Technology

The project can also require specific skills:

Project → REQUIRES → Skill

Other employees can have those skills:

Employee → HAS_SKILL → Skill

This allows the application to perform meaningful multi-hop graph traversals.

---

# 2. Technology Stack

## Frontend

- Angular
- TypeScript
- HTML5
- SCSS
- RxJS
- Angular Router
- Responsive UI

## Backend

- Node.js
- Express.js
- JavaScript
- REST API
- Official Neo4j JavaScript Driver

## Database

- Neo4j
- Cypher Query Language

## Development Tools

- Git
- GitHub
- npm
- VS Code
- Neo4j Browser

---

# 3. Application Architecture

```text
                    ┌─────────────────────────┐
                    │     Angular Frontend    │
                    │                         │
                    │  Employee Explorer      │
                    │  Project Explorer       │
                    │  Graph Relationships    │
                    │  Search / Filters       │
                    └────────────┬────────────┘
                                 │
                                 │ REST API
                                 ▼
                    ┌─────────────────────────┐
                    │     Node.js / Express    │
                    │                         │
                    │  API Routes             │
                    │  Services               │
                    │  Cypher Queries         │
                    │  Error Handling         │
                    └────────────┬────────────┘
                                 │
                                 │ Neo4j Driver
                                 ▼
                    ┌─────────────────────────┐
                    │          Neo4j          │
                    │                         │
                    │ Employee                │
                    │ Project                 │
                    │ Technology              │
                    │ Skill                   │
                    │ Company                 │
                    └─────────────────────────┘

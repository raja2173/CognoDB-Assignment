// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const neo4j = require('neo4j-driver');

const app = express();
app.use(cors());
app.use(express.json());

const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
);

app.get('/', (req, res) => {
  res.send('🚀 Neo4j Dependency API is running. Try: /api/packages/express/dependencies');
});

// Endpoint 1: Multi-hop dependencies (for a package)
app.get('/api/packages/:name/dependencies', async (req, res) => {
  const session = driver.session();
  try {
    const result = await session.run(
      `MATCH (p:Package {name: $name})-[:DEPENDS_ON*1..5]->(dep:Package)
       RETURN dep.name AS name, dep.version AS version, length(path) AS depth
       ORDER BY depth`,
      { name: req.params.name }
    );
    res.json(result.records.map(r => ({
      name: r.get('name'),
      version: r.get('version'),
      depth: r.get('depth')
    })));
  } catch (error) {
    res.status(500).json({ error: 'Database query failed' });
  } finally {
    await session.close();
  }
});

// Endpoint 2: CVE Blast Radius (query awkward for relational DBs)
app.get('/api/cves/:id/blast', async (req, res) => {
  const session = driver.session();
  try {
    const result = await session.run(
      `MATCH (cve:CVE {id: $id})-[:AFFECTS]->(vuln:Package)
       MATCH (dependent:Package)-[:DEPENDS_ON*1..5]->(vuln)
       RETURN DISTINCT dependent.name AS dependent, vuln.name AS vulnerable,
              cve.severity AS severity`,
      { id: req.params.id }
    );
    res.json(result.records.map(r => ({
      dependent: r.get('dependent'),
      vulnerable: r.get('vulnerable'),
      severity: r.get('severity')
    })));
  } catch (error) {
    res.status(500).json({ error: 'Database query failed' });
  } finally {
    await session.close();
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
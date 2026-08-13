// verify.js
require('dotenv').config();
const neo4j = require('neo4j-driver');

const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
);

async function verify() {
  const session = driver.session();
  try {
    // Count nodes
    const countResult = await session.run('MATCH (n) RETURN count(n) AS count');
    console.log(`📦 Total nodes: ${countResult.records[0].get('count')}`);

    // Show a sample dependency path
    const pathResult = await session.run(
      `MATCH path = (p:Package {name: 'express'})-[:DEPENDS_ON*1..3]->(d)
       RETURN p.name AS source, [node IN nodes(path) | node.name] AS chain
       LIMIT 3`
    );
    console.log('🔗 Sample dependency chains:');
    pathResult.records.forEach(record => {
      console.log(`  - ${record.get('source')} -> ${record.get('chain').join(' -> ')}`);
    });
  } finally {
    await session.close();
    await driver.close();
  }
}

verify();
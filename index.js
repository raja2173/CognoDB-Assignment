require('dotenv').config();

const neo4j = require('neo4j-driver');

const URI = process.env.NEO4J_URI;
const USERNAME = process.env.NEO4J_USERNAME;
const PASSWORD = process.env.NEO4J_PASSWORD;

const driver = neo4j.driver(
  URI,
  neo4j.auth.basic(USERNAME, PASSWORD)
);

async function main() {
  const session = driver.session();

  try {
    const result = await session.run(
      'RETURN "Neo4j Connected Successfully!" AS message'
    );

    console.log(result.records[0].get('message'));
  } catch (error) {
    console.error('Neo4j connection failed:', error.message);
  } finally {
    await session.close();
    await driver.close();
  }
}

main();
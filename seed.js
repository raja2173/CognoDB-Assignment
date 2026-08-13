// seed.js
require('dotenv').config();
const neo4j = require('neo4j-driver');
const fs = require('fs');

const URI = process.env.NEO4J_URI;
const USERNAME = process.env.NEO4J_USERNAME;
const PASSWORD = process.env.NEO4J_PASSWORD;

const driver = neo4j.driver(URI, neo4j.auth.basic(USERNAME, PASSWORD));

async function seedDatabase() {
  // Read the seed data
  const rawData = fs.readFileSync('seed-data.json');
  const packages = JSON.parse(rawData);

  const session = driver.session();

  try {
    console.log('🌱 Seeding database...');

    for (const pkg of packages) {
      // 1. Create the Package node (MERGE to avoid duplicates)
      await session.run(
        `MERGE (p:Package { name: $name })
         SET p.version = $version,
             p.description = $description,
             p.maintainer = $maintainer`,
        {
          name: pkg.name,
          version: pkg.version,
          description: pkg.description || '',
          maintainer: pkg.maintainer || 'unknown',
        }
      );

      // 2. Create DEPENDS_ON relationships
      for (const dep of pkg.dependencies) {
        await session.run(
          `MATCH (p:Package { name: $pkgName })
           MERGE (d:Package { name: $depName })
           CREATE (p)-[:DEPENDS_ON { version_range: $range }]->(d)`,
          {
            pkgName: pkg.name,
            depName: dep.name,
            range: dep.version_range,
          }
        );
      }
    }

    // 3. Add a CVE (Security Vulnerability) affecting "lodash"
    await session.run(
      `MERGE (c:CVE { id: $cveId })
       SET c.severity = $severity,
           c.description = $description
       WITH c
       MATCH (p:Package { name: $pkgName })
       CREATE (c)-[:AFFECTS { fixed_version: $fixedVer }]->(p)`,
      {
        cveId: 'CVE-2021-23337',
        severity: 'HIGH',
        description: 'Prototype pollution in lodash',
        pkgName: 'lodash',
        fixedVer: '4.17.20',
      }
    );

    console.log('✅ Seed data loaded successfully!');
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
  } finally {
    await session.close();
    await driver.close();
  }
}

seedDatabase();
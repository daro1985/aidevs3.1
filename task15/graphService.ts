var neo4j = require('neo4j-driver');

export async function connectToGraph() {
  // URI examples: 'neo4j://localhost', 'neo4j+s://xxx.databases.neo4j.io'
  const URI = 'neo4j+s://8301c97c.databases.neo4j.io'
  const USER = 'neo4j'
  const PASSWORD = 'UjGicOCS_M-8PvZ0Hm3VYpN30yLAwpdS9vG57hdi3Gg'
  let driver

  try {
    driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD))
    const serverInfo = await driver.getServerInfo()
    console.log('Connection established')
    console.log(serverInfo)
  } catch(err: any) {
    console.log(`Connection error\n${err}\nCause: ${err.cause}`)
  }
  return driver;
}

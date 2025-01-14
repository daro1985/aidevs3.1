import dotenv from 'dotenv';
dotenv.config();

import * as axios from 'axios';
import { llmCall, llmCallv2 } from '../commons/llmapi';
import { captureFlag } from '../commons/answer';
import { connectToGraph } from './graphService';


const apiUrl = 'https://centrala.ag3nts.org/apidb';



async function requestAPI(query: string) {
  const requestBody = {
    "task": "database",
    "apikey": process.env.CENTRALA_API_KEY,
    "query": query
  };
  const response = await axios.default.post(apiUrl, requestBody);
  console.log("###response: "+JSON.stringify(response.data, null, 2));
  return response.data;
}




async function main(){

        // const users = await requestAPI("select * from users;");
        // console.log("###users: "+JSON.stringify(users.reply, null, 2));
        // const connections = await requestAPI("select * from connections;");
        // console.log("###connections: "+JSON.stringify(connections.reply, null, 2));

        // const fs = require('fs');
        // const data = {users: users.reply, connections: connections.reply};
        // fs.writeFileSync(__dirname+'/db_data.json', JSON.stringify(data, null, 2));
        // console.log('Data saved to db_data.json successfully.');

        let driver = await connectToGraph(); 
        
        const session = driver.session();

        const query = `
            UNWIND $users AS user
            MERGE (u:User {id: user.id, name: user.username})
            WITH *
            UNWIND $connections AS conn
            MATCH (u1:User {id: conn.user1_id})
            MATCH (u2:User {id: conn.user2_id})
            MERGE (u1)-[r:CONNECTS_TO]->(u2)
        `;

        // const params = {
        //     users: users.reply,
        //     connections: connections.reply
        // };

        // try {
        //     await session.run(query, params); //insert data into graph
        //     console.log('Data inserted into Neo4j graph successfully.');
            
        //     // await session.run("MATCH (n) DETACH DELETE n"); //clean all data from graph
        //     // console.log('All data cleaned from Neo4j graph successfully.');
          
        // } catch (error) {
        //     console.error('Error inserting data into Neo4j graph:', error);
        // } finally {
        //     await session.close();
        //     await driver.close();
        // }

        let cypherQuery = await llmCall(query,
           `Your task is Write a cypher query to find a shortest path between user Rafał and Barbara.
           Use MATCH p=shortestPath() function.
           <prompt_rules>
           Return only VALID cypher query
           DO NOT USE algo.shortestPath
           Use basic Neo4j shortest path syntax
           </prompt_rules>`,
           "Structure of graph:"
        ) ||"" ;

        cypherQuery = cypherQuery.replace(/```cypher\n/, '').replace(/```$/, '').trim();

        console.log("###cypherQuery: "+cypherQuery);

          let result = await session.run(cypherQuery);
          console.log("###result: "+JSON.stringify(result, null, 2));
          await session.close();
          await driver.close();

          let path = await llmCall(JSON.stringify(result, null, 2),
            "Your task is to interpret the result of the cypher query and return the path between user Rafał and Barbara. Return an string of comma separated user names. DO not use any formatting.",
            "Result of cypher query: "
          );

          console.log("###path: "+path);
    captureFlag('connections', path).then(flag => {
        console.log("###Flag: "+ JSON.stringify(flag, null, 2));
    })
}

main();



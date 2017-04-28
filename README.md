# vaultdragon
1. install and start mongodb
2. enter the following nosql statement

use vaultdragon;
db.createCollection('user');
db.createUser(
   {
     user: "vaultdragon",
     pwd: "123123",
     roles: [ "readWrite", "dbAdmin" ]
   }
)

3. stop mongodb
4. start mongodb with --auth
5. install all node.js using npm install
6. enter this command : npm run build && npm run runApp
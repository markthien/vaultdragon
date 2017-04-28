process.env.mode = 'DEV';

import 'babel-polyfill';
import Koa from 'koa';
import Router from 'koa-router';
const app = new Koa();
const router = new Router();
const koaBody = require('koa-body')();
const MongoClient = require('mongodb').MongoClient;
const co = require('co');

const dbConnectionString = "mongodb://vaultdragon:123123@127.0.0.1:2282/vaultdragon";

let db;

co(function*() {
  
   db = yield MongoClient.connect(dbConnectionString);

   console.log("Connected to yourkeyhere mongodb in app.es6");

}).catch(function(err) {

   console.log(err.stack);

   process.exit(1);

}); 


app.use(router.routes());
app.use(router.allowedMethods());
app.listen(3000);

/***********************************************************
*
* get a user or return timestamp in proper format
*
************************************************************/
router.get('/getUser/:id', koaBody, async function (ctx, next) {

	let param = ctx.params || null;

	let query = ctx.query || null;

	if(query.timestamp) {

		let date = new Date(parseFloat(query.timestamp));	

		ctx.body = date.getHours() + ":" + date.getMinutes();

		return;

	}

	if(!param.id) {

		ctx.body = 'invalid id';

		return; 

	}

	let result = await db.collection('user').findOne({id:param.id});

	if(result) {

		ctx.body = result.name;

	} else {

		ctx.body = 'no result :)';

	}


}); 

/***********************************************************
*
* save or update user
*
************************************************************/
router.post('/saveUser', koaBody, async function (ctx, next) {

	let body = ctx.request.body || null;

	let id = Object.keys(body)[0];

	let name = body[id];

	console.log(`id : ${id} | name ${name}`);

  	let user = await db.collection('user').findOne({id:id});

  	if(user) {

  		console.log('update');

  		let result = await db.collection('user').update({id:id.toString()}, {$set:{name:name}}, {w:1});

  	} else {

  		console.log('insertOne');

  		let result = await db.collection('user').insertOne({id:id.toString(), name:name});

  	}

    ctx.body = name;

}); 

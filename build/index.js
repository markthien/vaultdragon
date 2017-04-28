'use strict';

require('babel-polyfill');

var _koa = require('koa');

var _koa2 = _interopRequireDefault(_koa);

var _koaRouter = require('koa-router');

var _koaRouter2 = _interopRequireDefault(_koaRouter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

process.env.mode = 'DEV';

var app = new _koa2.default();
var router = new _koaRouter2.default();
var koaBody = require('koa-body')();
var MongoClient = require('mongodb').MongoClient;
var co = require('co');

var dbConnectionString = "mongodb://vaultdragon:123123@127.0.0.1:2282/vaultdragon";

var db = void 0;

co(regeneratorRuntime.mark(function _callee() {
	return regeneratorRuntime.wrap(function _callee$(_context) {
		while (1) {
			switch (_context.prev = _context.next) {
				case 0:
					_context.next = 2;
					return MongoClient.connect(dbConnectionString);

				case 2:
					db = _context.sent;


					console.log("Connected to yourkeyhere mongodb in app.es6");

				case 4:
				case 'end':
					return _context.stop();
			}
		}
	}, _callee, this);
})).catch(function (err) {

	console.log(err.stack);

	process.exit(1);
});

app.use(router.routes());
app.use(router.allowedMethods());
app.listen(3000);

router.get('/getUser/:id', koaBody, function () {
	var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(ctx, next) {
		var param, query, date, result;
		return regeneratorRuntime.wrap(function _callee2$(_context2) {
			while (1) {
				switch (_context2.prev = _context2.next) {
					case 0:
						param = ctx.params || null;
						query = ctx.query || null;

						if (!query.timestamp) {
							_context2.next = 6;
							break;
						}

						date = new Date(parseFloat(query.timestamp));


						ctx.body = date.getHours() + ":" + date.getMinutes();

						return _context2.abrupt('return');

					case 6:
						if (param.id) {
							_context2.next = 9;
							break;
						}

						ctx.body = 'invalid id';

						return _context2.abrupt('return');

					case 9:
						_context2.next = 11;
						return db.collection('user').findOne({ id: param.id });

					case 11:
						result = _context2.sent;


						if (result) {

							ctx.body = result.name;
						} else {

							ctx.body = 'no result :)';
						}

					case 13:
					case 'end':
						return _context2.stop();
				}
			}
		}, _callee2, this);
	}));

	return function (_x, _x2) {
		return _ref.apply(this, arguments);
	};
}());

router.post('/saveUser', koaBody, function () {
	var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(ctx, next) {
		var body, id, name, user, result, _result;

		return regeneratorRuntime.wrap(function _callee3$(_context3) {
			while (1) {
				switch (_context3.prev = _context3.next) {
					case 0:
						body = ctx.request.body || null;
						id = Object.keys(body)[0];
						name = body[id];


						console.log('id : ' + id + ' | name ' + name);

						_context3.next = 6;
						return db.collection('user').findOne({ id: id });

					case 6:
						user = _context3.sent;

						if (!user) {
							_context3.next = 14;
							break;
						}

						console.log('update');

						_context3.next = 11;
						return db.collection('user').update({ id: id.toString() }, { $set: { name: name } }, { w: 1 });

					case 11:
						result = _context3.sent;
						_context3.next = 18;
						break;

					case 14:

						console.log('insertOne');

						_context3.next = 17;
						return db.collection('user').insertOne({ id: id.toString(), name: name });

					case 17:
						_result = _context3.sent;

					case 18:

						ctx.body = name;

					case 19:
					case 'end':
						return _context3.stop();
				}
			}
		}, _callee3, this);
	}));

	return function (_x3, _x4) {
		return _ref2.apply(this, arguments);
	};
}());

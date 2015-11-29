var koa = require('koa')
  , router = require('koa-router')
  , index = require('./index.js');

var app = koa();
app.use(require('koa-static')(__dirname))

app.use(function *(next) {
  var start = new Date;
  yield next;
  var ms = new Date - start;
  this.set('X-Response-Time: ',ms, 'ms')
})

app.use(function *(next) {
  var start = new Date;
  yield next;
  var ms = new Date - start;
  console.log('%s, %s - %s ms', this.method, this.url, ms)
})
route = router();
route.get('/', index.get)

app.use(route.routes())

app.listen(3000, function() {
  console.log("Now listening at port 3000")
});
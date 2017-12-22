var koa = require('koa')

var koaBody = require('koa-body')()

var router = require('koa-router')()

var sqlIns= require('./basedata/index')

var moment=require('moment')

var app= new koa()

app.use(koaBody)

router.get('/questionnaire/list',list)
        .get('/questionnaire/add',add)
app.use(router.routes())

async function list(ctx) {
   ctx.body= await sqlIns.getAll()
}
async function add(ctx) {
    ctx.body= await sqlIns.addQuestionnaire({
        title:'蛤蛤蛤',
        deadline:moment.utc(),
        isRelease:1
    })
 }

app.listen(3001)


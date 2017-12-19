var koa = require('koa')

var koaBody = require('koa-body')()

var router = require('koa-router')()

var sqlIns= require('./basedata/index')

var app= new koa()

app.use(koaBody)

router.get('/',list)
      .get('/post/new',add)
      .get('/post/:id',show)
      .post('/post',create)

app.use(router.routes())

// var posts=[]

async function list (ctx) {
    var posts= await sqlIns.getAll()
    await ctx.render('list',{
        posts: posts
    })

}

async function add (ctx) {
    await ctx.render('new')
}

async function create (ctx) {
    var res=await sqlIns.add(ctx.request.body);
    
    ctx.redirect('/')
}

async function show (ctx) {
    var id = ctx.params.id
    
    var post = await sqlIns.get(id)
    console.log(post);
    if(!post) ctx.throw(404,'无效的id')
    await ctx.render('show',{
        post:post[0]
    })
}

app.listen(3001)


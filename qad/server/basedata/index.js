var mysql = require('mysql')

function Mysql() {
    var sqlIns = mysql.createPool({
        host: 'localhost',
        user: 'root',
        password: 'meixi072614',
        database: 'my_blog_post'
    })


    function query (sql){
        return new Promise((resolve,reject)=>{
            sqlIns.query(sql,function(err,res) {
                if(err){
                    reject(err)
                }
                
                resolve(res)
            })
        }).catch(err=>console.log(err))
    }

    // this.getAll = async function (id) {
    //             var res=[]
    //             await sqlIns.query('select * from post', function (err,rows) {
    //                 console.log(rows[0].id);
    //                  res= rows
    //             })

    //             console.log(res)
    //         }

    this.getAll= async function() {
        var result=[]
        await query('select * from post').then(res=>result=res)
        return result
    }

    this.get = async function (id) {
        var r=[]
        await query('select id,title,content from post where id=' + id).then(res=>r=res)
        return r
        
    }

    this.add=async function(obj) {
        var r = []
        await query(`insert into post (title,content) values ('${obj.title}','${obj.content}')`).then(res=>r=res)

        return r
    }



}

module.exports = new Mysql()




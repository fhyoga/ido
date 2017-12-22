var mysql = require('mysql')
var moment=require('moment')

function Mysql() {
    var sqlIns = mysql.createPool({
        host: '192.168.18.240',
        port:'3309',
        user: 'root',
        password: '123456',
        database: 'db_questionnaire'
    })


    function query (sql){
        return new Promise((resolve,reject)=>{
            sqlIns.query(sql,function(err,res) {
                if(err){
                    reject(err)
                }
                resolve(JSON.stringify(res))
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
       return await query('select * from question')
    }

    this.get = async function (id) {
        var r=[]
        await query('select id,title,content from post where id=' + id).then(res=>r=res)
        return r
    }

    this.addQuestionnaire=async function(obj) {
        var r = [] 
        await query(`insert into questionnaire (title,dateline,deadline,isRelease) values ('${obj.title}',${moment.utc()},${obj.deadline},${obj.isRelease})`).then(res=>r=res)
        return r
    }
}

module.exports = new Mysql()




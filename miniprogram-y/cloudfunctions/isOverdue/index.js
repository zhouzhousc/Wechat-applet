// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

//数据库连接
let db = cloud.database()
var punishment = 0
var owner

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  var bdate = new Date();
  var mon = bdate.getMonth() + 1;
 
  if (mon.toString().length == 1) {
    mon = "0" + mon
  }
  var date = bdate.getFullYear() + '-' + mon + '-' + bdate.getDate()
  console.log(date)

  // 积分也需要同步更新，超时惩罚
  await db.collection('targets').where({deadline: date, statekey: 1}).get().then(res => {
    // res.data 包含该记录的数据
    if (res.data.length != 0) {
      punishment = res.data[0].punishment
      owner = res.data[0].owner
    }
  })

  await db.collection("targets").where({deadline: date, statekey: 1}).update({
    data: { 
      state: "已超时", statekey: -1, lasttime: date + " 23:59:59"
    }
  })
  
  await db.collection('users').where({nickname: owner}).get().then(res => {
    amount = res.data[0].amount
  })

  return await db.collection('users').where({nickname: owner}).update({
    data: {amount: parseInt(amount) - parseInt(punishment)}
  });

}

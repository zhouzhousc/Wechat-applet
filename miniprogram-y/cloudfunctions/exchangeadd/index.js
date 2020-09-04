// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

//数据库连接
let db = cloud.database()
let result

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  console.log(event);
  var dbName = "prize";
  var prizename = event.prizeName;
  var prizecost = event.prizeCost;
  var nowtime = event.nowtime;
  var owner = event.owner;
  var amount = 0;

  await db.collection('users').where({nickname: owner}).get().then(res => {
    amount = res.data[0].amount
  })

  if (parseInt(amount) >= parseInt(prizecost)){
    console.log("zaizhe")
    await db.collection('exchange').add({data:[
      {cost: prizecost, createTime: nowtime, prizeName: prizename, owner: owner} 
    ]})
    // 这里要传递用户名来更新该用户积分值

    await db.collection('users').where({nickname: owner}).update({
      data: {amount: parseInt(amount) - parseInt(prizecost)}
    });

    return await db.collection('exchange').where({prizeName: prizename, owner: owner}).get()
    .then(
      res => {
        return res;
      }
    )
    .catch(console.error);
  }

  else {
    return "积分不够"
  }

}

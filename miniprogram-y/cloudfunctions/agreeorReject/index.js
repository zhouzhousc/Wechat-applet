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
  var dbName = "targets";
  var targetCon = event.targetcon;
  var agreeorreject = event.reply;
  var nowtime = event.nowtime;
  var owner = event.owner;
  var rewardsorce = event.targetrew; 

  if (agreeorreject == true){
    var amount;
    console.log("zaizhe")
    await db.collection('reviewed').where({owner: owner, targetContent: targetCon}).update({
      data: {updateTime: nowtime, state: 2}
    })
    await db.collection('users').where({nickname: owner}).get().then(res => {
      // res.data 包含该记录的数据
      console.log(res.data[0].amount)
      amount = res.data[0].amount
    })

    await db.collection('users').where({nickname: owner}).update({
      data: {amount: parseInt(rewardsorce) + parseInt(amount)}
    })
    return await db.collection(dbName).where({owner: owner, content: targetCon}).update({
      data: { 
        state: "已完成", statekey: 3, lasttime: nowtime
      }
    })
    .then(
      res => {
        return targetCon;
      }
    )
    .catch(console.error);
  }

  else {
    console.log("zaina")
    await db.collection('reviewed').where({owner: owner, targetContent: targetCon}).update({
      data: {updateTime: nowtime, state: -1}
    })
    return await db.collection(dbName).where({owner: owner, content: targetCon}).update({
      data: { 
        state: "进行中", statekey: 1, lasttime: nowtime
      }
    })
    .then(
      res => {
        return targetCon;
      }
    )
    .catch(console.error);
  }

}

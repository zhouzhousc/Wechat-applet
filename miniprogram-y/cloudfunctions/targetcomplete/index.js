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
  var thinkcomment = event.comment;
  var targetid = event.targetId;
  var targetcomment = event.targetComment;
  var targetreward = event.targetReward;
  var nowtime = event.nowtime;
  var owner = event.owner;
  var infolength;

  // var page = new Object();
  // page.number = pagee;

  await db.collection('reviewed').where({targetContent: targetcomment}).get().then(res => {
    infolength = res.data.length
  })

  if (targetid != ''){
    if (infolength === 0) {
      console.log("zaizhe")
      await db.collection('reviewed').add({data:[
        {targetReward: targetreward, createTime: nowtime, targetContent: targetcomment, comment: thinkcomment, updateTime: nowtime, state: 1, owner: owner} 
      ]})
    } else {
      console.log("zaizhe222222222")
      await db.collection('reviewed').where({targetContent: targetcomment}).update({data:
        {comment: thinkcomment, updateTime: nowtime, state: 1} 
      })
    }

    return await db.collection(dbName).doc(targetid).update({
      data: { 
        thinkcomment: thinkcomment, state: "审核中", statekey: 2, lasttime: nowtime
      }
    })
    .then(
      res => {
        return res;
      }
    )
    .catch(console.error);
  }

  else {
    return "提交审核至云数据库错误，请检查原因"
  }

}

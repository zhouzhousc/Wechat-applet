// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

//数据库连接
let db = cloud.database()
let result

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  var dbName = "reviewed";
  var owner = event.owner

  const countResult = await db.collection(dbName).where({owner: owner, state: 1}).orderBy("createTime", "asc").count();
  return countResult;

}

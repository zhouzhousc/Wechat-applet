// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

//数据库连接
let db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  // 将新增任务存进云数据库
  if (event){
    try {
      return await db.collection('prize').add({
        data: {
          created: event.nowtime,
          name: event.name,
          imagePath: event.imagePath,
          storeId: event.storeId,
          worth: event.worth,
          score: event.score,
          owner: event.owner
          
        }
      }).then(res => {console.log(res)}).catch(err => {console.log(err)})

    } catch (e) {
      // console.log("qqqqqqqqqqqqqqqqqqqq");
      console.error(e)
    }
  }
  // 云函数要有返回值
  // 返回是否成功状态
  return {
    status: "ok"
  }
}


// 数据格式
// data: {
//   name: that.data.name,
//   imagePath: that.data.tempFilePaths,
//   storeId: that.data.storeId,
//   worth: that.data.worth,
//   score: that.data.score
// }
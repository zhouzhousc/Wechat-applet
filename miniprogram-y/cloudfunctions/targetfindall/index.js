// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

//数据库连接
let db = cloud.database()
let result

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  // 从云数据库获取数据
  if (event){
    try {
      await db.collection('targets').get()
      .then(res => {
        console.log(res.data)
        result = res.data
    }).catch(err => {console.log(err)})

      return result

    } catch (e) {
      // console.log("qqqqqqqqqqqqqqqqqqqq");
      console.error(e)
      return e
    }
  }
  // 云函数要有返回值
  // 返回是否成功状态
}


// 数据格式
// data: {
//   content: that.data.content,
//   deadline: that.data.deadline + " 00:00:00",
//   reward: that.data.reward,
//   punishment: that.data.punishment
// }
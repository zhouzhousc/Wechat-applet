// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

//数据库连接
let db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  // 将新增任务存进云数据库
  if (event){
    try {

      return await db.collection('targets').add({
        data: {
          openid: wxContext.OPENID,
          created: event.nowtime,
          lasttime: event.nowtime,
          thinkcomment: "",
          state: "进行中",
          statekey: 1,
          content: event.content,
          deadline: event.deadline,
          reward: event.reward,
          punishment: event.punishment,
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
//   content: that.data.content,
//   deadline: that.data.deadline + " 00:00:00",
//   reward: that.data.reward,
//   punishment: that.data.punishment
// }
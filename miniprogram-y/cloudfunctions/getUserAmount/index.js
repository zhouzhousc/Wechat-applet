// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

//数据库连接
let db = cloud.database()
let result

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  var nickname = event.nickName

  // 从云数据库获取数据
    try {
      await db.collection('users').where({nickname: nickname}).get()
      .then(res => {
        console.log(res.data)
        result = res.data
        return result
    }).catch(err => {console.log(err)})
      return result

    } catch (e) {
      console.error(e)
      return e
    }
}

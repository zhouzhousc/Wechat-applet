// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

//数据库连接
let db = cloud.database()
let result

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  var owner = event.owner

  // 从云数据库获取数据
  if (event){
    try {
      await db.collection('users').where({nickname: owner}).get()
      .then(res => {
        console.log(res.data)
        try {
          result = res.data[0]["besupervised"]
          console.log(result)
        } catch (e) {
          console.error(e)
          result = "聪少少灬"
        }
        
    })

    return await db.collection('users').where({nickname: result}).get()

    } catch (e) {
      console.error(e)
      return e
    }
  }
  // 云函数要有返回值
  // 返回是否成功状态
}

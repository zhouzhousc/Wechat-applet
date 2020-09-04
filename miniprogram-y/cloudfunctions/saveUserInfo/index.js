// 云函数入口文件
const cloud = require('wx-server-sdk')

// 初始化的环境一定要正确，不然会调用云函数失败
cloud.init(
  {
    env:"extarget-env-t7e2r",
  }
);

//数据库连接
let db = cloud.database()
let infolength = 0;

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();

  await db.collection('users').where({'userInfo.nickName':event.userInfo.nickName}).get().then(res => {
    // res.data 包含该记录的数据
    infolength = res.data.length
    }).catch(res=>{
      console.log(res)
    })

  if (infolength === 0){
    try {
      return await db.collection('users').add({
        data: {
          created: new Date(),
          userInfo: event.userInfo,
          nickname: event.userInfo.nickName,
          avatarurl: event.userInfo.avatarUrl,
          openid: wxContext.OPENID,
          amount: 0,
          besupervised: event.userInfo.nickName
        }
      }).then(res => {console.log(res)}).catch(err => {console.log(err)})

    } catch (e) {
      console.error(e)
    }
  }
  // 云函数要有返回值
  return "云函数保存用户信息出错了"
}
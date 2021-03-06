// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

//数据库连接
let db = cloud.database()
let result

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  var dbName = "prize";
  
  const pagee = event.page;
  const size = event.size;

  var page = new Object();
  page.number = pagee;
  var owner = event.owner;

  const countResult = await db.collection(dbName).where({owner: owner}).orderBy("worth", "asc").count();
  const total = countResult.total;
  page.totalElements = total;
  page.totalPages= Math.ceil(total / size);

  return await db.collection(dbName).where({owner: owner}).orderBy("worth", "asc").skip(pagee * size).limit(size).get().then(
    res => {
      //res.hasMore = hasMore;
      res.page = page;
      return res;
    }
  );

}

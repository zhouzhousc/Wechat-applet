// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

//数据库连接
let db = cloud.database()
let result

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  var dbName = "targets"
  const pagee = event.page
  const size = event.size
  var owner = event.owner
  var sort = "deadline,asc"
  var state = event.state
  //var filter = state==null? ""
  
  var page = new Object();
  page.number = pagee;

  if (state==''){
    const countResult = await db.collection(dbName).where({owner: owner}).orderBy("deadline", "asc").count();
    const total = countResult.total;
    page.totalElements = total;
    page.totalPages= Math.ceil(total / size);

    return await db.collection(dbName).where({owner: owner}).orderBy("deadline", "asc").skip(pagee * size).limit(size).get().then(
      res => {
        //res.hasMore = hasMore;
        res.page = page;
        return res;
      }
    );
  }

  else {
    const countResult = await db.collection(dbName).where({owner: owner, statekey: state}).orderBy("deadline", "asc").count();
    const total = countResult.total;
    page.totalElements = total;
    page.totalPages= Math.ceil(total / size);

    return await db.collection(dbName).where({owner: owner, statekey: state}).orderBy("deadline", "asc").skip(pagee * size).limit(size).get().then(
      res => {
        //res.hasMore = hasMore;
        res.page = page;
        return res;
      }
    );
  }

  // const countResult = state==''?await db.collection(dbName).orderBy("deadline", "asc").count():await db.collection(dbName).orderBy("deadline", "asc").where({statekey: state}).count();
  // const total = countResult.total;
  // page.totalElements = total;
  // page.totalPages= Math.ceil(total / size);

  // return await db.collection(dbName).orderBy("deadline", "asc").where({statekey: state}).skip(pagee * size).limit(size).get().then(
  //   res => {
  //     //res.hasMore = hasMore;
  //     res.page = page;
  //     return res;
  //   }
  // );
}

let storeDownloadObj = require('../request/store/download-file')
let requestBuilder = require('../request/factory/requestObjBuilder')
let storeDao = {
    setStore(storeId,path){
        let stores = wx.getStorageSync('store')||{};
        stores[storeId]=path
        wx.setStorageSync('store', stores)
        console.log("down---------------------------ok")
    },
    getStore(storeId){
        let stores = wx.getStorageSync('store')||{};
        return stores[storeId];
    },
    //下载图片资源并存储
    downloadPicture(storeId){
        let that = this

        let fileUrl = storeId
        console.log("XXXXXXXXXXXXXXXX")
        console.log(storeId)
        console.log(fileUrl)
        wx.cloud.downloadFile({
            fileID: fileUrl,
            success (res) {
                console.log("downdowndowndowndowndowndowndowndown")
                console.log(res)
                console.log('下载资源:' + fileUrl + ' 成功,' + '临时目录：' + res.tempFilePath)
                //存储到本地
                wx.saveFile({
                    tempFilePath: res.tempFilePath,
                    success: res => {
                        console.log('存储到本地成功')
                        that.setStore(storeId, res.savedFilePath)
                    }
                })
        }
        })
    }
}

module.exports = storeDao
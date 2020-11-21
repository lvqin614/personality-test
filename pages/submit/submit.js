// pages/submit/submit.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseInfo: { src: "", name: "" },
    cWidth: 0,
    cHeight: 0,
  },
  onSubmit: function () {
    if (this.data.baseInfo.src === "") {
      return wx.showToast({
        title: "请上传猫咪头像",
        icon: 'none'
      })
    }
    if (this.data.baseInfo.name === "") {
      return wx.showToast({
        title: "请输入猫咪名字",
        icon: 'none'
      })
    }
    wx.redirectTo({
      url: '../canvas/canvas'
    })
  },
  onInputChange: function (e) {
    const name = e.currentTarget.dataset.name
    this.setData({
      baseInfo: {
        ...this.data.baseInfo,
        [name]: e.detail.value
      }
    })
  },
  upload: function () {
    const _this = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        const src = res.tempFilePaths[0]
        wx.getImageInfo({
          src: res.tempFilePaths[0],
          success: function (res) {
            //---------利用canvas压缩图片--------------
            let ratio = 2;
            let canvasWidth = res.width //图片原始长宽
            let canvasHeight = res.height
            while (canvasWidth > 100 || canvasHeight > 100) {// 保证宽高在400以内
              canvasWidth = Math.trunc(res.width / ratio)
              canvasHeight = Math.trunc(res.height / ratio)
              ratio++;
            }
            _this.setData({
              cWidth: canvasWidth,
              cHeight: canvasHeight
            })
            //----------绘制图形并取出图片路径--------------
            let ctx = wx.createCanvasContext('canvas')
            ctx.drawImage(res.path, 0, 0, canvasWidth, canvasHeight)
            ctx.draw(false, setTimeout(function () {
              wx.canvasToTempFilePath({
                canvasId: 'canvas',
                destWidth: canvasWidth,
                destHeight: canvasHeight,
                success: function (res) { //res.tempFilePath 最终图片路径
                  wx.getFileSystemManager().readFile({
                    filePath: res.tempFilePath,
                    success: function (res) {
                      wx.showLoading({
                        title: '图片识别中'
                      })
                      wx.cloud.callFunction({
                        name: 'ContentCheck',
                        data: {
                          contentType: 'image/png',
                          img: res.data
                        },
                        success(res) {
                          wx.hideLoading()
                          if (res.result.errCode == 87014) {
                            wx.showToast({
                              title: '图片可能包含不当敏感信息，请重新上传',
                              icon: "none"
                            })
                          } else {
                            wx.hideLoading()
                            wx.redirectTo({
                              url: `../crop/crop?src=${src}`
                            })
                          }
                        },
                        fail(err) {
                          if (err.errCode === -1) {
                            wx.showToast({
                              title: '图片过大，请重新上传',
                              icon: "none"
                            })
                          }
                        }
                      })
                    }
                  })
                },
                fail: function (res) {
                  wx.showToast({
                    title: '图片上传失败，请重新上传',
                    icon: "none"
                  })
                }
              })
            }, 200))//留一定的时间绘制canvas
          },
          fail: function (err) {
            wx.showToast({
              title: '图片读取失败，请重新上传',
              icon: "none"
            })
          }
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    const { src } = option
    if (src !== "" && src !== undefined) {
      this.setData({
        baseInfo: {
          ...this.data.baseInfo,
          src: src
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
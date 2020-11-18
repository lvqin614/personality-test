var numCount = 6;  //元素个数
var numSlot = 5;  //一条线上的总节点数
var mW = 340;  //Canvas的宽度
var mCenter = mW / 2; //中心点
var mAngle = Math.PI * 2 / numCount; //角度
var mRadius = mCenter - 60; //半径(减去的值用于给绘制的文本留空间)
//获取指定的Canvas
var radCtx = wx.createCanvasContext("radarCanvas")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    chanelArray1: [["社交型", 50], ["权威型", 80], ["理想型", 56], ["实用型", 60], ["艺术型", 95], ["学术型", 30]],
    chanelArray2: [["战绩", 24], ["生存", 60], ["团战", 88], ["发育", 49], ["输出", 46], ["推进", 92]],
    chanelArray3: [["战绩", 88], ["生存", 40], ["团战", 82], ["发育", 41], ["输出", 46], ["推进", 92]]
  },
  // 雷达图
  drawRadar: function () {
    var sourceData1 = this.data.chanelArray1
    var sourceData2 = this.data.chanelArray2
    var sourceData3 = this.data.chanelArray3
    this.drawEdge() //画六边形  
    this.drawLinePoint()
    this.drawRegion(sourceData1, 'rgba(122, 202, 254, 0.5)') //第一个人的  
    // this.drawRegion(sourceData1, 'rgba(255, 0, 0, 0.5)') //第一个人的  
    // this.drawRegion(sourceData2, 'rgba(255, 200, 0, 0.5)') //第二个人  
    // this.drawRegion(sourceData3, 'rgba(122, 202, 254, 0.5)') //第三个人  
    this.drawTextCans(sourceData1)
    this.drawCircle(sourceData1, 'red')
    radCtx.draw()
  },
  drawEdge: function () {
    // radCtx.setStrokeStyle("white")
    // radCtx.setLineWidth(2)  //设置线宽
    // for (var i = 0; i < numSlot; i++) {
    //   //计算半径
    //   radCtx.beginPath()
    //   var rdius = mRadius / numSlot * (i + 1)
    //   //画6条线段
    //   for (var j = 0; j < numCount; j++) {
    //     //坐标
    //     var x = mCenter + rdius * Math.cos(mAngle * j);
    //     var y = mCenter + rdius * Math.sin(mAngle * j);
    //     radCtx.lineTo(x, y);
    //   }
    //   radCtx.closePath()
    //   radCtx.stroke()
    // }
    radCtx.setStrokeStyle("#ccc")  //设置线的颜色
    radCtx.setLineWidth(1)  //设置线宽
    for (var i = 0; i < numSlot; i++) {  //需要几个圆就重复几次
      radCtx.beginPath()
      var rdius = mRadius / numSlot * (i + 1)  //计算每个圆的半径
      radCtx.arc(mCenter, mCenter, rdius, 0, 2 * Math.PI) //开始画圆
      radCtx.stroke()
    }
  },
  // 第二步：绘制连接点
  drawLinePoint: function () {
    radCtx.beginPath();
    for (var k = 0; k < numCount; k++) {
      var x = mCenter + mRadius * Math.cos(mAngle * k);
      var y = mCenter + mRadius * Math.sin(mAngle * k);

      radCtx.moveTo(mCenter, mCenter);
      radCtx.lineTo(x, y);
    }
    radCtx.stroke();
  },
  drawRegion: function (mData, color) {
    radCtx.beginPath();
    for (var m = 0; m < numCount; m++) {
      var x = mCenter + mRadius * Math.cos(mAngle * m) * mData[m][1] / 100;
      var y = mCenter + mRadius * Math.sin(mAngle * m) * mData[m][1] / 100;

      radCtx.lineTo(x, y);
    }
    radCtx.closePath();
    //添加渐变线
    var gradient = radCtx.createLinearGradient(150, 0, 250, 0);

    //添加颜色断点
    gradient.addColorStop(0, "#edc6fb");
    gradient.addColorStop(1, "#6dd5eb");

    // radCtx.fillStyle = grd;
    radCtx.setFillStyle(gradient)
    radCtx.fill();
  },
  drawTextCans: function (mData) {

    radCtx.setFillStyle("#ccc")
    radCtx.font = 'bold 14rpx cursive'  //设置字体
    for (var n = 0; n < numCount; n++) {
      var x = mCenter + mRadius * Math.cos(mAngle * n);
      var y = mCenter + mRadius * Math.sin(mAngle * n);
      // radCtx.fillText(mData[n][0], x, y);
      //通过不同的位置，调整文本的显示位置
      if (mAngle * n >= 0 && mAngle * n <= Math.PI / 2) {
        radCtx.fillText(mData[n][0], x + 5, y + 10);
      } else if (mAngle * n > Math.PI / 2 && mAngle * n <= Math.PI) {
        radCtx.fillText(mData[n][0], x - radCtx.measureText(mData[n][0]).width - 7, y + 10);
      } else if (mAngle * n > Math.PI && mAngle * n <= Math.PI * 3 / 2) {
        radCtx.fillText(mData[n][0], x - radCtx.measureText(mData[n][0]).width - 5, y);
      } else {
        radCtx.fillText(mData[n][0], x + 7, y - 2);
      }

    }
  },
  drawCircle: function (mData, color) {
    var r = 3; //设置节点小圆点的半径
    for (var i = 0; i < numCount; i++) {
      var x = mCenter + mRadius * Math.cos(mAngle * i) * mData[i][1] / 100;
      var y = mCenter + mRadius * Math.sin(mAngle * i) * mData[i][1] / 100;

      radCtx.beginPath();
      radCtx.arc(x, y, r, 0, Math.PI * 2);

      radCtx.fillStyle = color;
      radCtx.fill();
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.drawRadar()
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
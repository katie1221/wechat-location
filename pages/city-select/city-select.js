// pages/city-select/city-select.js
//引入城市JSON数据
let City = require('../../utils/allcity.js')
//引入腾讯位置服务SDK核心类
var qqmapsdk = require('../../utils/qqmap.js');
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		city:[],
		config: {
			horizontal: true, // 第一个选项是否横排显示（一般第一个数据选项为 热门城市，常用城市之类 ，开启看需求）
			animation: true, // 过渡动画是否开启
			search: true, // 是否开启搜索
			searchHeight: 98, // 搜索条高度
			suctionTop: false // 是否开启标题吸顶
		  },
		nowLocationCity:"立即获取"  
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		// // 模拟服务器请求异步加载数据
		this.setData({
			city:City
		})
		this.getLocation()
	},
	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {

	},
	//点击选择城市
	selectCity(e){
		console.log(e.detail)
		wx.setStorageSync('city', e.detail.name)
		wx.setStorageSync('city_code', e.detail.adcode)
		//返回上一页
		wx.navigateBack({
			delta: 1 // 回退前 delta(默认为1) 页面
		})
	},
	//点击当前定位城市
	getNowLocation(e){
		console.log(e.detail)
		let that = this
		if(e.detail == "立即获取"){
			that.getUserLocation()
		}else{
			wx.setStorageSync('city', e.detail.name)
			wx.setStorageSync('city_code', e.detail.adcode)
			//返回上一页
			wx.navigateBack({
				delta: 1 // 回退前 delta(默认为1) 页面
			})
		}
	},
	/**
	  微信小程序定位当前城市信息：
	  步骤1：获取当前地理位置，首先要拿到用户的授权 wx.openSeting
	  步骤2：微信的getLocation接口，获取当前用户的地理位置（微信返回的是经纬度、速度等参数）
	  步骤3：微信没有将经纬度直接转换为地理位置，借用腾讯位置服务中关于小程序的地理位置转换JS SDK 的API（返回信息中包括国家，省、市、区、经纬度等地理位置）
	  注意：在用户首次进入某页面（需要地理位置授权）的时候，在页面进行onLoad、onShow时候，进行调用wx.getLocation要求用户进行授权；
	  以后每次进入该页面时，通过wx.getSetting接口，返回用户授权具体信息
	 */
	 //步骤1：获取当前地理位置，首先要拿到用户的授权 wx.openSeting
	 getUserLocation(){
		let that=this
		//获取用户的当前设置。返回值中只会出现小程序已经向用户请求过的权限
		wx.getSetting({
			success(res){
			  //console.log(res)
			  //scope.userLocation 就是地理授权的标志：
			  //res.authSetting['scope.userLocation'] == undefined 表示初始进入该页面
			  //res.authSetting['scope.userLocation'] == false 表示非初始化进入该页面 且未授权
			  //res.authSetting['scope.userLocation'] == true 表示地理位置授权
			  if(res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true){
				  //表示非初始化进入该页面 且未授权：
				  wx.showModal({
					  title: '请求授权当前位置',
					  content: '需要获取您的地理位置，请确认授权',
					  showCancel: true,
					  cancelText: '取消',
					  cancelColor: '#000000',
					  confirmText: '确定',
					  confirmColor: '#3CC51F',
					  success: (result) => {
						  if(res.cancel){
							  wx.showToast({
								  title: '拒绝授权',
								  icon: 'none',
								  duration: 1000
							  });
						  }else if (result.confirm) {
							 //调起客户端小程序设置界面，返回用户设置的操作结果。 
							 //设置界面只会出现小程序已经向用户请求过的权限
							 wx.openSetting({
								 success: (dataAu) => {
									if(dataAu.authSetting["scope.userLocation"] == true) {
										wx.showToast({
										   title: '授权成功',
										   icon: 'success',
										   duration: 1000
									   });
									   //再次授权之后，调用wx.getLocation的API
									   that.getLocation()
									}else {
										 wx.showToast({
										   title: '授权失败',
										   icon: 'none',
										   duration: 1000
									   });
									}
								 }
							 });
							   
						  }
					  }
				  });
					
			  }else if(res.authSetting['scope.userLocation'] == undefined){
				  //调用wx.getLocation的API
				  that.getLocation()
			  }else{
				  //调用wx.getLocation的API
				  that.getLocation()
			  }
			}

		})
	},
   /**
	* 获取当前位置坐标经纬度
	  步骤2：微信的getLocation接口，获取当前用户的地理位置（微信返回的是经纬度、速度等参数）
	*/
   getLocation(){
	   let that = this 
	   //1.获取当前位置坐标经纬度
	   wx.getLocation({
		   type: 'gcj02', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
		   success: function(res){
			   // success
			   //console.log(res)
			   var latitude=res.latitude //维度
			   var longitude=res.longitude //经度
			   //2.根据经纬度获取对应城市信息(使用腾讯位置服务)
			   that.getLocal(latitude,longitude)
		   }
	   })
   },
   //步骤3：获取当前地理位置
   getLocal:function(latitude,longitude){
	   let that = this
	   //逆地址解析
	   qqmapsdk.reverseGeocoder({
		   location:{
			   latitude:latitude,
			   longitude:longitude
		   },
		   success:function(res){
			   // console.log(res)
			   wx.setStorageSync('first_enter', false)
			   let province = res.result.ad_info.province;
			   let city = res.result.ad_info.city;
			   let cityCode = res.result.ad_info.city_code;
			   let nationCode = res.result.ad_info.nation_code;
			   let city_code=cityCode.substring(nationCode.length)
			   that.setData({
					nowLocationCity:city
				})
				wx.setStorageSync('city', city)
				wx.setStorageSync('city_code', city_code)
		   },
		   fail:function(res){
			   //console.log(res)
		   }
	   })
   }
})
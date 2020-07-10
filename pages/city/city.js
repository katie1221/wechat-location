// pages/city/city.js
const chooseLocation = requirePlugin('chooseLocation')//地图选点结果插件实例
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		latitude:"",
		longitude:"",
		address:"",
		key: 'VEHBZ-QXKLW-YRMR4-RWZSZ-UNGOS-FLFFM',//在腾讯位置服务申请的key
		referer: '微信小程序定位', //调用腾讯位置服务相关插件的app的名称
		rightArrow:"../../images/rightArrow.png"
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {

	},
	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		// 从地图选点插件返回后，在页面的onShow生命周期函数中能够调用插件接口，取得选点结果对象
		const location = chooseLocation.getLocation(); // 如果点击确认选点按钮，则返回选点结果对象，否则返回null
		if(location !=null){
			console.log(location)
			this.setData({
				latitude: location.latitude,
				longitude:location.longitude,
				address:location.name
			})
		}
	},
	//腾讯位置服务地图选点
	clickMap(){
		let that = this
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
									//再次授权之后，调用腾讯位置服务的地图选点插件API
									that.callQQPlugin()
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
				//调用腾讯位置服务的地图选点插件API
				that.callQQPlugin()
			}else{
				//调用腾讯位置服务的地图选点插件API
				that.callQQPlugin()
			}
		}

	  })
	},
	//调用腾讯位置服务的地图选点插件API
	callQQPlugin(){
		const key = this.data.key; //使用在腾讯位置服务申请的key
		const referer = this.data.referer; //调用插件的app的名称
		const latitude = this.data.latitude
		const longitude = this.data.longitude
		if(latitude !="" && longitude !=""){
			const location = JSON.stringify({
			latitude: latitude,
			longitude: longitude
			});
			wx.navigateTo({
				url: 'plugin://chooseLocation/index?key=' + key + '&referer=' + referer + '&location=' + location
			});
	   }else{
			wx.navigateTo({
				url: 'plugin://chooseLocation/index?key=' + key + '&referer=' + referer 
			});
	   }
	},
	//腾讯位置服务路线规划
	routePlan(){
		let that = this
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
									//再次授权之后，调用腾讯位置服务的路线规划插件API
									that.callRoutePlanPlugin()
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
				//调用腾讯位置服务的路线规划插件API
				that.callRoutePlanPlugin()
			}else{
				//调用腾讯位置服务的路线规划插件API
				that.callRoutePlanPlugin()
			}
		}

	  })
	},
	 //
	 callRoutePlanPlugin(){
		let plugin = requirePlugin('routePlan')//路线规划插件
		let key = this.data.key; //使用在腾讯位置服务申请的key
		let referer = this.data.referer; //调用插件的app的名称
		let latitude = this.data.latitude
		let longitude = this.data.longitude
		if(latitude !="" && longitude !=""){
			let endPoint = JSON.stringify({ //终点
				name:this.data.address,
				latitude: latitude,
				longitude: longitude
			})
			wx.navigateTo({
				url: 'plugin://routePlan/index?key=' + key + '&referer=' + referer+'&endPoint= ' +endPoint
			});
	    }else{
			console.log('请先选择地点')
		}
	 }
})
var serverBase = "http://m.hebiptv.com/hbiptv-weixin/";
// var serverBase = "http://jq.kanketv.com/hbiptv-weixin/";

//微信分享
var _wxshare_on=true;

var wxshare = {
		options: {
			m: false,
			title:"看客微信电视",
			logourl:"http://m.hebiptv.com/hbiptv-weixin/images/logo.jpg",
			info:"【微信电视，让微信成为电视遥控器】",
			url:serverBase,
			debug:false
		},
		init: function(data) {	
			this.initEvent_();
			if(data.title!=""&&data.title!=undefined){				
				this.options.title=data.title;
			}			
			if(data.logourl!=""&&data.logourl!=undefined){
				this.options.logourl=data.logourl;
			}
			if(data.info!=""&&data.info!=undefined){
				this.options.info=data.info;
			}
			if(data.url!=""&&data.url!=undefined){
				this.options.url=data.url;
			}
			if(data.debug!=""&&data.debug!=undefined){
				this.options.debug=data.debug;
			}
		},
		initEvent_: function() {
			newget();
			this.config_();
		},
		check_: function(url) {
			if (url.indexOf("detial") == -1) {
				this.weixinshare_(wxshare.options.title, wxshare.options.logourl, wxshare.options.info, wxshare.options.url);
			}
		},
		config_: function() {
			var url = window.location.href.split("#")[0];
			url = encodeURI(url);
			var weixinurl = serverBase + 'wxtv/jsapiTicket';
			var data = {
				url: url
			}
			$.get(weixinurl, data, function(e) {
				var appId = e.appid;
				$.cookie('appId', appId);
				wxshare.check_(url);
				var timestamp = e.timestamp;
				var nonceStr = e.nonceStr;
				var signature = e.signature;
				wx.config({
					debug: wxshare.options.debug,
					appId: appId, // 公众号的唯一标识
					timestamp: timestamp, // 生成签名的时间戳
					nonceStr: nonceStr, // 生成签名的随机串
					signature: signature, // 签名
					jsApiList: ['onMenuShareTimeline',
							'onMenuShareAppMessage',
							'scanQRCode'
						] // 需要使用的JS接口列表
				});
			})
		},
		ready_: function() {
			wxready();
		},
		error_: function() {
			wxerror();
		},
		weixinshare_: function(sharetitle, shareimgurl, sharedesc, url) {
			var appId = $.cookie('appId');
			var code = $.query()['code'] ? $.query()['code'] : '';
			if(url.indexOf('dianbo/detial')> -1){
				$.cookie('dianflag', true);
			}else{
				$.cookie('dianflag', false);
			}
			if (url.indexOf('?code=' + code) > -1) {
				url = url.replace('?code=' + code, '');
			}
			if (url.indexOf('&code=' + code) > -1) {
				url = url.replace('&code=' + code, '');
			}
			if(url.indexOf('&state=123')>-1){
				url = url.replace('&state=123', '');
			}
			if(url.indexOf('?operator=DX')>-1){
				url = url.replace('?operator=DX', '');
			}
			if(url.indexOf('?operator=YD')>-1){
				url = url.replace('?operator=DX', '');
			}
			if(url.indexOf('?operator=LT')>-1){
				url = url.replace('?operator=DX', '');
			}
			if(url.indexOf('?operator=')>-1){
				url = url.replace('?operator=', '');
			}
			if($.cookie('operator')){
				url=url+'?operator='+$.cookie('operator');
			}
			url = encodeURIComponent(url);
			if (url.indexOf('https://open.weixin.qq.com/connect/oauth2/authorize') == -1 && appId != undefined) {
				url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + appId + '&redirect_uri=' + url + '&response_type=code&scope=snsapi_base&state=123#wechat_redirect';
			} else {
				url = decodeURIComponent(url);
			}
			$.cookie('sharedesc', sharedesc);
			$.cookie('sharetitle', sharetitle);
			$.cookie('shareimgurl', shareimgurl);
			$.cookie('urltem', url);
			wxshare.ready_();
			wxshare.error_();
		}
	}
//微信分享
function newget() {
	$.get = function(url, data, success, error) {
		if (jQuery.isFunction(data)) {
			error = success;
			success = data;
			data = undefined;
		}
		url = encodeURI(url);
		jQuery.ajax({
			url: url,
			type: "get",
			dataType: "json",
			cache: false,
			data: data,
			success: success,
			error: error
		});
	}
	$.query = function () {
	    var aQuery = window.location.href.split("?");  //取得Get参数
	    var aGET = new Array();
	    if (aQuery.length > 1) {
	        var aBuf = aQuery[1].split("&");
	        for (var i = 0, iLoop = aBuf.length; i < iLoop; i++) {
	            var aTmp = aBuf[i].split("=");  //分离key与Value
	            aGET[aTmp[0]] = aTmp[1];
	        }
	    }
	    return aGET;
	}
}

function wxready() {
	wx.ready(function() {
		wxshare.options.m = "true";
		wx.onMenuShareTimeline({
			title: $.cookie('sharetitle'),
			link: $.cookie('urltem'),
			imgUrl: $.cookie('shareimgurl'),
			success: function () {
				// 用户确认分享后执行的回调函数
				if($.cookie('dianflag')){
					$('#tshare').hide();
				}
				

			},
			cancel: function () {
				if($.cookie('dianflag')){
					$('#tshare').hide();
				}
				// 用户取消分享后执行的回调函数
			}
		});
		wx.onMenuShareAppMessage({
			title: $.cookie('sharetitle'),
			desc: $.cookie('sharedesc'),
			link: $.cookie('urltem'),
			imgUrl: $.cookie('shareimgurl'),
			success: function () {
				if($.cookie('dianflag')){
					$('#tshare').hide();
				}
				// 用户确认分享后执行的回调函数

			},
			cancel: function () {
				if($.cookie('dianflag')){
					$('#tshare').hide();
				}
				// 用户取消分享后执行的回调函数
			}
		});	
	});
}

function wxerror() {
	wx.error(function(res) {
		if (wxshare.options.m == "true") {
			wxshare.options.m = "false";
			this.config_();
		}
	});
}
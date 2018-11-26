app.controller('testCtrl', ['$rootScope','$scope','$attrs','$http','$cookieStore','$timeout', function($rootScope,$scope, $attrs,$http,$cookieStore,$timeout) {
var serverBase="http://m.hebiptv.com/hbiptv-weixin/";//ygc测试
var apiServerBase="http://172.48.1.11/";//api接口域名----------上线请更改

var webset = {
	base:serverBase,
	tran:serverBase+'tran?DEEPURL=',
	url:serverBase+'tran?DEEPURL=http://api2.kanketv.com/',
	play:serverBase+'tran?DEEPURL=http://play.kanketv.com/playerCode2.0/play/api?linkUrl=',
	device:serverBase+'tran?DEEPURL='+apiServerBase+'hbiptv-api/api/v1/user/bind.json',//正在使用
	ctrl:serverBase+'ctrl/',
	ak:'34DB874AF269B539',
	as:40,
	testurl:serverBase+'tran?DEEPURL='+apiServerBase+'hbiptv-api/api/v1/',
	apiurl:serverBase+'tran?DEEPURL='+apiServerBase+'hbiptv-api/api/v1/',  //正在使用
	initurl:serverBase+'wxtv/init'  //微信初始化  获取openid
};
}]);





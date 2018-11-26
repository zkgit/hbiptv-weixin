

var app = angular.module('webapp',['ngRoute','ngCookies']);
/*app.constant('URLS',{
    "ajaxurl":"http://jq.kanketv.com/hbiptv-api/api/v1/",
    "tran":"/hbiptv-weixin/tran?DEEPURL=",
    "baseurl":"/hbiptv-weixin/",
    "recommend":"http://jq.kanketv.com/hbiptv-api/api/recommend/",
    "ctrl":"/hbiptv-weixin/ctrl/"
});*/
app.constant('URLS',{
    "ajaxurl":"/hbiptv-weixin/tran?DEEPURL=http://172.48.1.11/hbiptv-api/api/v1/",
    "tran":"/hbiptv-weixin/tran?DEEPURL=",
    "baseurl":"/hbiptv-weixin/",
    "recommend":"/hbiptv-weixin/tran?DEEPURL=http://172.48.1.11/hbiptv-api/api/recommend/",
    "ctrl":"/hbiptv-weixin/ctrl/"
});
app.config(['$routeProvider', '$httpProvider', '$logProvider',function($routeProvider, $httpProvider, $logProvider){

    //注册拦截器
    // $httpProvider.interceptors.push('httpInterceptor');

    $httpProvider.defaults.withCredentials = true;/*,默认情况下通过CORS这样的方式是不会传递cookie.一般强制性将cookie添加到header的做法,也会被浏览器拒绝并报错.上面看到了在服务器端会通过添加一个response头,Access-Control-Allow-Credentials来控制是否允许Cookie的提交.*/
    $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
    $httpProvider.defaults.headers.common["Content-Type"] = "application/json;charset=utf-8";


    $routeProvider.
        when('/',{templateUrl:'views/pages/index.html'}).
        when('/:module',{templateUrl:function($routeParams){
            return 'views/'+$routeParams.module+'/index.html'
        }}).
        when('/:module/:page',{templateUrl:function($routeParams){
        	return 'views/'+$routeParams.module+'/'+$routeParams.page+'.html';
        }}).
        when('/404',{templateUrl:'views/pages/404.html'}).
        otherwise({redirectTo: '/404'});
        
}]).run(['$rootScope', '$window','$cookieStore','$location','$http','URLS','$cookies',function ($rootScope, $window,$cookieStore,$location,$http,URLS,$cookies) {
    
/*    if($rootScope.code != null && $rootScope.code != "null" && $rootScope.code != undefined && $rootScope.code!=''&&!$cookies.token) {
        $rootScope.init=true;
        $http.post(URLS.baseurl +'wxtv/init?code=' + $rootScope.code, {}).success(function(e) {
            console.log('user',e)
            if(e.code==0){
                var dt = e.data;
                $cookieStore.put('openid',dt.openId);
                $cookieStore.put('headimgurl',dt.headimgurl);
                $cookieStore.put('nickname',dt.nickname);
                $cookieStore.put('token',dt.token);
                // 获取boxId
                $http.post(URLS.baseurl + 'wxtv/user/check?openId=' + dt.openId + '&type=1', {}).success(function(e) {
                    // $rootScope.openid=dt.openId+'====1';
                    if(e.code==0){
                        //已关注
                        $rootScope.guanzhu=true;
                    }else if(e.code==-1||e.code==-2){
                        //未关注
                        $rootScope.guanzhu=false;
                    }
                });

                $http.post(URLS.ajaxurl + 'user/bind.json?key=' + dt.openId + '&type=1', {}).success(function(e) {
                    if(e && e.response.responseHeader.code == "200"&&e.response.responseBody!="null"&&e.response.responseBody!=undefined&&e.response.responseBody!="") {
                        $cookieStore.put("boxId", e.response.responseBody);
                        // 电信 DX  移动YD 联通LT
                        var yb=e.response.responseBody.substr(0,2).toUpperCase();
                        if(yb=='DX'||yb=='YD'||yb=='LT'){
                            $cookieStore.put("operator", yb);
                        }
                        if($rootScope.operator&&$rootScope.operator!=$cookieStore.get('operator')){
                            //与当前运营不同
                            $rootScope.yunying=false;
                        }
                    }else{
                        //未绑定
                        $rootScope.isbind=false;
                    }
                    $rootScope.flag=true;
                });
            }

        });
    }else if($cookieStore.get('openid')){
        $http.post(URLS.baseurl + 'wxtv/user/check?openId=' + $cookieStore.get('openid') + '&type=1', {}).success(function(e) {
            // $rootScope.openid=$cookieStore.get('openid')+'====2';
            if(e.code==0){
                //已关注
                $rootScope.guanzhu=true;
            }else if(e.code==-1||e.code==-2){
                //未关注
                $rootScope.guanzhu=false;
            }
        });
        $http.post(URLS.ajaxurl + 'user/bind.json?key=' + $cookieStore.get('openid') + '&type=1', {}).success(function(e) {
            if(e && e.response.responseHeader.code == "200"&&e.response.responseBody!="null"&&e.response.responseBody!=undefined&&e.response.responseBody!="") {
                $cookieStore.put("boxId", e.response.responseBody);
                var yb=e.response.responseBody.substr(0,2).toUpperCase();
                if(yb=='DX'||yb=='YD'||yb=='LT'){
                    $cookieStore.put("operator", yb);
                }
                if($rootScope.operator&&$rootScope.operator!=$cookieStore.get('operator')){
                    $rootScope.yunying=false;
                }
            }else{
                //未绑定
                $rootScope.isbind=false;
            }
            $rootScope.flag=true;
        });
    }*/
    $rootScope.$on('$routeChangeStart', function(evt, next, current){
        var href=$window.location.href;
        if(href.indexOf('#/pages/index')>-1||href.indexOf('#/dianbo/index_rb')>-1||href.indexOf('#/dianbo/index_zj')>-1||href.indexOf('#/dianbo/index_zj')>-1||href.indexOf('#/pages/fenlei')>-1||href.indexOf('#/pages/remote')>-1||href.indexOf('#/search/index')>-1||href.indexOf('#/account/index')>-1){
            $cookieStore.put('zbindex',0);
        }
        // console.log(123,$cookieStore.get('codedone'))
        /*if($cookieStore.get('codedone')){
            var code = getUrlParam('code');
            $cookieStore.remove('codedone');
            $window.location.href=$window.location.href.replace(code,'');
        };*/
    });

    if(_wxshare_on) {
        var data = {
            title: "河北IPTV微信电视",
            logourl: "/hbiptv-weixin/img/logo.jpg",
            info: "【微信电视，让微信成为电视遥控器】",
            url: serverBase, //主页分享链接    默认为webset.base，可不传
            debug: false //是否开启调试    true/false  默认为false，可不传
        }
        wxshare.init(data);
    }

}]); 



/*app.constant('URLS',{
    "ajaxurl":"/hbiptv-weixin/tran?DEEPURL=http://172.48.1.14/hbiptv-api/api/v1/",
    "tran":"/hbiptv-weixin/tran?DEEPURL=",
    "baseurl":"/hbiptv-weixin/",
    "recommend":"/hbiptv-weixin/tran?DEEPURL=http://172.48.1.14/hbiptv-api/api/recommend/",
    "ctrl":"/hbiptv-weixin/ctrl/"
});*/





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



app.directive('botnav', function () {
  return {
    restrict: 'A',
    scope:{
      ac:'@active'
    },
    templateUrl:"views/share/botnav.html"
  };
}).directive('indextopline', function () {
  return {
    restrict: 'A',
    scope:{
      ac:'@active'
    },
    templateUrl:"views/share/indextopline.html"
  };
}).directive('yunying', ['$http','URLS','$cookieStore','$cookies','$rootScope',function ($http,URLS,$cookieStore,$cookies,$rootScope) {
    return {
        restrict: 'A',
        scope:{

        },
        templateUrl:"views/share/yunying.html",
        link:function (scope,element,attrs) {

       /*     $rootScope.$watch('ond',function(newValue,oldValue){
                if(newValue!=oldValue){
                    
            }
        })*/
                scope.getAjax=function (v) {
                    if(v){
                        scope.openid=scope.openid?scope.openid:v;
                    }
                    $http.post(URLS.ajaxurl + 'user/getDevice.json?openId='+scope.openid+"&pageNo=1&pageSize=100",{}).success(function(res){
                        console.log("设备列表信息1234",res)
                        if(res && res.responseHeader && res.responseHeader.code == 200) {
                            // $scope.device = $scope.device.concat(res.responseBody);
                            scope.device = res.responseBody.list;
                            if(v){
                                if(scope.device.length){
                                    $rootScope.yunying=false;
                                    $rootScope.selfyunying=true;
                                }else{
                                    $rootScope.isbind=false;
                                }

                            }
                            scope.deviceActive =res.responseBody.active=='null'?'':res.responseBody.active;
                            $cookieStore.put("boxId", scope.deviceActive);
                            if (res.responseBody.length < 10) {
                                scope.datadone = true;
                                scope.loadtext = '已加载全部数据';
                            }else{
                                scope.datadone = false;
                                scope.loadtext = '正在玩命加载···';
                            }
                            $rootScope.flag=true;
                        }else{
                            scope.datadone = true;
                            scope.loadtext = '数据加载错误';
                        }
                    });
                }
                scope.add_d=function () {
                    // 扫一扫添加设备
                    wx.scanQRCode({
                        needResult: 1,
                        desc: '扫描设备码',
                        success: function (res) {
                            var ma = res.resultStr;
                            // var ma = JSON.stringify(res);
                            // http://hbwx.kanke.tv/hbiptv-weixin/wxtv/scan/bind?url=xxxx&openId=xxxxx

                            $http.post(URLS.baseurl + 'wxtv/scan/bind?openId='+scope.openid+"&url="+ma,{}).success(function(res){
                                console.log("设备列表信息",res)
                                if(res.code==0) {
                                    CUES.tip({"msg":"设备添加成功","type":"success"});
                                    $rootScope.init=true;
                                    if(res.boxId.substr(0,2).toUpperCase()==$rootScope.operator){
                                        $rootScope.yunying=true;
                                        $rootScope.isbind=true;
                                    }else{
                                        window.location.href="#/pages/index";
                                    }

                                    /* var obj = {},arr = [];
                                     obj.boxId = res.boxId;
                                     obj.boxName = res.boxId;
                                     obj.id = '';
                                     obj.level = 0;
                                     obj.openId = $scope.openid;
                                     arr.push(obj);
                                     arr.concat($scope.device);*/
                                    // $scope.device=arr.concat($scope.device);
                                    scope.getAjax();
                                    scope.$apply();
                                }else{
                                    CUES.tip({"msg":"设备添加失败","type":"danger"});
                                }

                            });
                        }
                    });
                }
                scope.qiehuan = function(v){
                    if(!v){
                        return false;
                    }
                    // 此处添加切换设备事件
                    $http.post(URLS.ajaxurl + 'user/bind.json?key=' + scope.openid + '&type=0&value='+v, {}).success(function(e) {
                        if(e && e.response.responseHeader.code == "200"&&e.response.responseBody!='null') {
                            scope.deviceActive = v;
                            $rootScope.init=true;
                            $rootScope.yunying=true;
                            $cookieStore.put("boxId", v);
                        };
                    });
                };
                scope.loaddata=function () {
                    scope.openid=$cookieStore.get('openid');
                    scope.getAjax();
                }


                $rootScope.operator = getUrlParam('operator')?getUrlParam('operator').toUpperCase():'';
                $rootScope.guanzhu=true;
                $rootScope.yunying=true;
                $rootScope.isbind=true;
            $rootScope.selfyunying=false;
                scope.code = getUrlParam('code');
                if(scope.code != null && scope.code != "null" && scope.code != undefined && scope.code!=''&&!$cookies.token) {
                    $http.post(URLS.baseurl +'wxtv/init?code=' + scope.code, {}).success(function(e) {
                        console.log('user11',e)
                        if(e.code==0){
                            var dt = e.data;
                            $cookieStore.put('headimgurl',dt.headimgurl);
                            $cookieStore.put('nickname',dt.nickname);
                            $cookieStore.put('token',dt.token);
                            $cookieStore.put('openid',dt.openId);
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
                                        //当前运营商
                                        $rootScope.nowopera=yb;
                                        $.cookie('operator', yb);
                                    }
                                    if($rootScope.operator&&$rootScope.operator!=$rootScope.nowopera){
                                        //如果地址上有运营商与当前运营不同
                                        $rootScope.yunying=false;
                                        scope.loaddata();
                                    }else{
                                        $rootScope.flag=true;
                                    }
                                    $rootScope.init=true;
                                }else{
                                    //未绑定
                                    scope.getAjax(dt.openId);
                                }

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
                                $rootScope.nowopera=yb;
                                $.cookie('operator', yb);
                            }
                            if($rootScope.operator&&$rootScope.operator!=$rootScope.nowopera){
                                $rootScope.yunying=false;
                                scope.loaddata();
                            }else{
                                $rootScope.flag=true;
                            }
                            $rootScope.init=true;
                        }else{
                            //未绑定
                            // $rootScope.isbind=false;
                            scope.getAjax($cookieStore.get('openid'));
                        }
                    });

                }
            



        }

        }

}]).directive('showtvtype', function () {
  return {
    restrict: 'A',
    scope:{
      showtvtype:"="
    },
    link:function(scope,element,attrs){
      if(scope.showtvtype){
        var v = scope.showtvtype;
        if(v=='-2' || v=='1'){
          element.append('<img src="images/icon_tv.png" class="pi_ico_tv">');
        }
      }
    }
  };
}).directive('onFinishRenderFilters', function ($timeout) {
    return {
        restrict: 'A',
        link: function(scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function() {
                    scope.$emit(attr.render);
                });
            };
        }
    };
}).directive('back', function() {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        element.on('click', function() {
            if (window.history.length > 1) {
                window.history.go(-1);
            } else {
                window.location.hash="#/pages/index";
            }
        })
      }
    }
  }).directive('onFinishRenderFilters', function($timeout) {
    return {
        restrict: 'A',
        link: function(scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function() {
                    scope.$emit('ngRepeatFinished');
                });
            }
        }
    };
});

app.filter(
    "to_trusted",['$sce',function($sce){
        return function(text){
            return $sce.trustAsHtml(text);
        }
    }]
).filter(
    "initzero",[function(){
        return function(text){
        	if(text==0 || text==null || text==undefined){
                return 0;
            }else{
                return text;
            }
        }
    }]
).filter(
    "nullmsg",[function(){
        return function(text,msg){
        	if(text==0 || text==null || text==undefined){
            	return msg;
        	}else{
        		return text;
        	}
        }
    }]
).filter(
    "imgclip",[function(){
        return function(url,wh){
            if(url){
                var reg = /\d+x\d+/ig;
                url = url.replace(reg,'720x960');
                url = url + '!c'+wh+'.jpg'
                return url;
            }
        }
    }]
).filter(
    "webandroid",[function(){
        return function(url){
            if(url){
                return url.replace('/web/','/android/');
            }else{
                return url;
            }
        }
    }]
).filter(
    "seetype",[function(){
        return function(num){
            var x = '';
            switch (num)
            {
            case -1:
              x="回看";
              break;
            case 1:
              x="预约";
              break;
            case 0:
              x="直播";
              break;
            case 2:
              x="已预约";
              break;
            }
            return x;
        }
    }]
).filter(
    "initdate",[function(){
        return function(date){
            var str = date.replace(/-/ig,'/');
            return new Date(str).getTime();
        }
    }]
).filter(
    "backtime",[function(){
        return function(date){
            if(date){
                var str = date.replace(/-/ig,'/'),
                    dt = new Date(str);
                return (dt.getMonth()+1)+'月'+dt.getDate()+'日';
            }else{
                return date;
            }
        }
    }]
).filter(
    'to_wan', ['$sce', function($sce) {
        return function(num) {
            if (num >= 100000000) {
                return (num / 100000000).toFixed(3) + '亿';
            } else if (num >= 10000) {
                return (num / 10000).toFixed(1) + '万';
            } else {
                return num;
            }
        }
    }]
);


var CUES = {
    tip:function(options){
        var msg = options.msg;
        var type = options.type?options.type:'info';
        var time = options.time?options.time:1500;
        var elma = this.createdom({"tag":"div","classname":"tippop","msg":'<div class="text '+type+'">'+msg+'</div></div>'});
        document.body.appendChild(elma);
        setTimeout(function(){
            elma.style.opacity = 0;
            elma.style.webkitTransition = 'all 1s';
            setTimeout(function(){
                options.callback && options.callback();
                elma.remove();
            },1500);
        },time);
    },
    alert:function(options){
        var msg = options.msg;
        var elma = this.createdom({"tag":"div","classname":"tippop_alert"});
        var elmb = this.createdom({"tag":"p","classname":"tippop_alert_t","msg":options.msg});
        var elmc = this.createdom({"tag":"a","classname":"tippop_alert_b","msg":"确定"});
        elma.appendChild(elmb),elma.appendChild(elmc);
        document.body.appendChild(elma);

        var elm_bg = this.createdom({"tag":"div","classname":"tippop_bg"});
        document.body.appendChild(elm_bg);

        elmc.addEventListener('click',function(){
            elm_bg.remove();
            elma.remove();
            options.callback && options.callback();
        },false);
    },
    confirm:function(options){
        var msg = options.msg;
        var elma = this.createdom({"tag":"div","classname":"tippop_alert"});
        var elmb = this.createdom({"tag":"p","classname":"tippop_alert_t","msg":options.msg});
        var elmc = this.createdom({"tag":"p","classname":"tippop_alert_b"});
        var a_cal = this.createdom({"tag":"a","classname":"tippop_confirm_btn","msg":"取消"});
        var a_sure = this.createdom({"tag":"a","classname":"tippop_confirm_btn","msg":"确定"});
        elmc.appendChild(a_cal),elmc.appendChild(a_sure);
        elma.appendChild(elmb),elma.appendChild(elmc);
        document.body.appendChild(elma);
        var elm_bg = this.createdom({"tag":"div","classname":"tippop_bg"});
        document.body.appendChild(elm_bg);
        a_cal.addEventListener('click',function(){
            elm_bg.remove();
            elma.remove();
        },false);
        a_sure.addEventListener('click',function(){
            elm_bg.remove();
            elma.remove();
            options.callback && options.callback();
        },false);
    },
    createdom:function(options){
        var dom = document.createElement(options.tag);
        dom.className = options.classname;
        if(options.msg){
            dom.innerHTML = options.msg;
        }
        return dom;
    }
}

var botscroll = function(num){
    var _this = this,wd = $(window);
    this.timer = null;
    this.bdh = 0;
    this.winh = $(window).height();
    this.isoff = true;
    this.setmax = function(nh){
        _this.maximum = nh - _this.winh - num;
    };
    wd.scroll(function(){
        if(_this.isoff){return false;};
        clearTimeout(_this.timer);
        _this.timer = setTimeout(function(){
            var st = wd.scrollTop();
            if(_this.maximum<=st){
                _this.getbot();
            }
        },200);
    });
};

var divScroll = function(options){
    // elm：对象
    // short: 底部距离多少加载
    var _this = this;
    this.opts = options;
    this.seting();
    this.elm.addEventListener('touchstart',function(event){
        var touches = event.targetTouches;
        _this.fy = touches[0].pageY;
    },false)
    this.elm.addEventListener('touchmove',function(event){
        var touches = event.targetTouches;
        _this.ly = touches[0].pageY;
        var cy = _this.fy - _this.ly;
        _this.elm.scrollTop = _this.ofy+cy;
        event.preventDefault();
    },false)
    this.elm.addEventListener('touchend',function(event){
        _this.ofy = _this.ofy + _this.fy - _this.ly;
        if(_this.ofy<=0){
            _this.ofy = 0;
            _this.elm.scrollTop = _this.ofy;
        }else if(_this.ofy>=_this.inh-_this.h){
            _this.ofy = _this.inh-_this.h;
            _this.elm.scrollTop = _this.ofy;
        }
        this.fy = this.ly = 0;
    },false)

    return this;
}
divScroll.prototype.seting = function(){
    var opts = this.opts;
    this.elm = opts.elm;
    this.h = opts.outh;
    this.inh = opts.inh;
    this.fy = this.ly = 0;
    this.ofy = this.elm.scrollTop;
}
divScroll.prototype.seth = function(){
    this.inh = this.elm.children[0].clientHeight;
}

var swiper = function(options){
    this.opt = options;
    this.setting();
    this.bindevent();
}
swiper.prototype.setting = function(){
    var _this = this;
    var opt = this.opt;
    var outer = opt.elm,ls = outer.getElementsByClassName('spimg'),len = ls.length,str = '';
    this.len = len-1;
    this.winw = window.innerWidth;
    for(var i=0;i<len;i++){
        ls[i].style.cssText = 'transform:translateX('+(i*100)+'%);-webkit-transform:translateX('+(i*100)+'%);';
        str += '<span class="po"></span>';
    }
    outer.getElementsByClassName('poter')[0].innerHTML = str;
    this.fx = this.lx = this.ox = this.st = 0;
    this.poters = outer.getElementsByClassName('po');
    this.poter();
}
swiper.prototype.bindevent = function(){
    var _this = this;
    this.elm = _this.opt.elm;
    this.outer = this.elm.getElementsByClassName('spbox')[0];
    this.elm.addEventListener('touchstart',function(event){
        var touches = event.targetTouches;
        _this.fx = touches[0].pageX;
    },false)
    this.elm.addEventListener('touchmove',function(event){
        var touches = event.targetTouches;
        _this.lx = touches[0].pageX;
        _this.ox = _this.lx - _this.fx;
        _this.outer.style.cssText = 'transform:translateX('+(_this.ox+_this.st*_this.winw)+'px);-webkit-transform:translateX('+(_this.ox+_this.st*_this.winw)+'px);';
        event.preventDefault();
    },false)
    this.elm.addEventListener('touchend',function(event){
        if(Math.abs(_this.ox)<=50){
            _this.outer.style.cssText = '-webkit-transition:-webkit-transform 300ms; transition:transform 300ms;transform:translateX('+(_this.st*_this.winw)+'px);-webkit-transform:translateX('+(_this.st*_this.winw)+'px);';
        }else{
            _this.ox>0?_this.st++:_this.st--;
            _this.st<=-_this.len?_this.st=-_this.len:'';
            _this.st>=0?_this.st=0:'';
            _this.outer.style.cssText = '-webkit-transition:-webkit-transform 300ms; transition:transform 300ms;transform:translateX('+(_this.st*_this.winw)+'px);-webkit-transform:translateX('+(_this.st*_this.winw)+'px);';
        }
        _this.fx = _this.lx = _this.ox = 0;
        _this.poter();
    },false)
}
swiper.prototype.poter = function(){
    var len = this.poters.length,ls = this.poters;
    for(var i=0;i<len;i++){
        -this.st==i?ls[i].setAttribute('class','po active'):ls[i].setAttribute('class','po');
    }
};

// 懒加载
var lazyload = function(option){
    function bindappear(){// 绑定事件
        _this.imgs.each(function(i,n){
            var self = $(this);
            if(self.data('loaded')!=1){
                if(self.attr("original")){
                    self.one("appear", function () {
                        var img = new Image,src = self.attr("original");
                        img.src = src;
                        img.onload=function(){
                            self.hide().attr("src", src).removeClass('lazy').fadeIn();
                        }
                        img.onerror=function(){
                            self.hide().attr("src", self.attr('error')).removeClass('lazy').fadeIn();
                        }
                    });
                    self.data('loaded',1);
                }else{
                    self.hide().attr("src", self.attr('error')).removeClass('lazy').fadeIn();
                }
            }
        });
    }
    function setarr(){// 重置数组
        _this.srcarr = [];
        for(var i=0;i<_this.imgs.length;i++){
            _this.srcarr.push(_this.imgs.eq(i).offset().top);
            _this.imgs.eq(i).loaded = true;
        }
    }
    var _this = this;
    _this.imgs = $(option.elm).find(option.class);
    bindappear();
    _this.srcarr = [];
    _this.isoff = false;
    _this.winh = window.innerHeight;
    setarr();

    _this.setlazy = function(imgs){ // 抛出的图片加载事件
        _this.imgs = imgs;
        setarr();
        bindappear();
        $(window).trigger("scroll");
    }

    _this.timer = null;

    $(window).scroll(function(){
        clearTimeout(_this.timer);
        if(_this.isoff){return false;}
        _this.timer = setTimeout(function(){
            var scrollTop = $(window).scrollTop();
            for(var i =0 ;i<_this.srcarr.length;i++){
                if(_this.srcarr[i]>0 && _this.srcarr[i]<=(scrollTop+_this.winh+option.outbot)){
                    _this.imgs.eq(i).trigger("appear");
                    _this.srcarr[i] = -1;
                }
            }
        },10);
    });
    $(window).trigger("scroll");
    return this;
}

function getUrlParam(name) {
    // var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var reg = new RegExp(name + "=([^&#]*)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.href.match(reg); //匹配目标参数
    if (r != null) return unescape(r[1]); return null; //返回参数值
}

$.query = function() {
    var aQuery = window.location.href.split("?"); //取得Get参数
    var aGET = new Array();
    if (aQuery.length > 1) {
        var aBuf = aQuery[1].split("&");
        for (var i = 0, iLoop = aBuf.length; i < iLoop; i++) {
            var aTmp = aBuf[i].split("="); //分离key与Value
            aGET[aTmp[0]] = aTmp[1];
        }
    }
    return aGET;
}

function GetRequest() {
    var url = window.location.hash;
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var start = url.indexOf("?"),str = url.substr(start+1);
        var strs = str.split("&");
        for(var i = 0; i < strs.length; i ++) {
            theRequest[strs[i].split("=")[0]]=decodeURIComponent(strs[i].split("=")[1]);
        }
    }
    return theRequest;
};
// app.factory('httpInterceptor',['$rootScope','$location',function($rootScope,$location){
//     return{
//         'request':function(config){
//              if(config.url.match('.html')==null && config.url.match('.json')==null){
//                 config.url = '/web'+config.url;
//              }
//             return config;
//         }
//     }

// }]);
// (function() {
//     'use strict';
//     var module = angular.module('app.services', []);

//     module.service('settings',['$http','$cookieStore','$q',function ($http,$cookieStore,$q) {
//         var settings = {};
//         return {
//             getsettings:function(){
//                 return '';
//                 // if(settings.settings){
//                 //     return $q.when(settings.settings)
//                 // };
//                 // return $http.get('/settings').then(function(res){
//                 //     settings.settings = res.data.data;
//                 //     settings.settings.employees = ["0-20人","20-99人","100- 499人","500-999人","1000-9999人","10000人以上"];
//                 //     return res.data.data;
//                 // })
//             }
//         }
//     }]);

// }).call(this);
app.controller('accountCtrl', ['$scope','$location','$http','$cookieStore','$timeout','URLS','$rootScope', function($scope, $location,$http,$cookieStore,$timeout,URLS,$rootScope) {
    $rootScope.$watch('init',function(newValue,oldValue){
        if(newValue) {
            $scope.token = $cookieStore.get('token');
            $scope.openid = $cookieStore.get('openid');
            $scope.nickname = $cookieStore.get('nickname');
            $scope.headimg = $cookieStore.get('headimgurl');

            $scope.btext = "用户未绑定设备";

            // 获取boxId
            $scope.code = getUrlParam('code');
            if ($scope.code != null && $scope.code != "null" && $scope.code != undefined) {
                $http.post(URLS.baseurl + 'wxtv/init?code=' + $scope.code, {}).success(function (e) {
                    $http.post(URLS.ajaxurl + 'user/bind.json?key=' + $scope.openid + '&type=1', {}).success(function (e) {
                        if (e && e.response.responseHeader.code == "200" && e.response.responseBody != "null" && e.response.responseBody != undefined && e.response.responseBody != "") {
                            $cookieStore.put("boxId", e.response.responseBody);
                            $scope.btext = "用户已绑定设备";
                            $scope.isbang = true;
                        }
                        ;
                    });
                });
            }
            ;
        }})
}]);

app.controller('accounthisCtrl', ['$scope','$location','$http','$cookieStore','$timeout','URLS','$rootScope', function($scope, $location,$http,$cookieStore,$timeout,URLS,$rootScope) {
   $scope.gettype=function (v) {
       $scope.typess=v;
   }
    $rootScope.$watch('init',function(newValue,oldValue){
        if(newValue) {
            $scope.token = $cookieStore.get('token');
            $scope.openid = $cookieStore.get('openid');
            $scope.nickname = $cookieStore.get('nickname');
            $scope.headimg = $cookieStore.get('headimgurl');


            //openId='+$cookieStore.get('openid')+'&
            // 设置页面类型
            $scope.pagetype = function (type) {
                if (type == "history") {
                    $scope.pagedata = {
                        "type": 'history',
                        "list": "user/history/list.json" + '?openId=' + $scope.openid + '&token=' + $scope.token,
                        "mothed": "post"
                    };
                } else if (type == 'collect') {
                    $scope.pagedata = {
                        "type": 'collect',
                        "list": "user/collect/list.json" + '?openId=' + $scope.openid + '&token=' + $scope.token,
                        "mothed": "post"
                    };
                } else if (type == 'yuyue') {
                    $scope.pagedata = {
                        "type": 'yuyue',
                        "list": "user/userReserveInfo.json?openId=" + $scope.openid,
                        "mothed": "post"
                    };
                }
                ;
                $scope.datainit();
            };
            // 获取列表信息
            $scope.datainit = function () {
                var urlsc = URLS.ajaxurl + $scope.pagedata.list;
                $http.post(urlsc, {}).success(function (res) {
                    // console.log('列表', res);

                    if (res.response.responseBody) {
                        if ($scope.pagedata.type == "yuyue") {
                            $scope.list = res.response.responseBody;
                            if (!$scope.list.length) {

                                $scope.loadtext = "暂无预约";
                            }
                        } else {
                            $scope.list = res.response.responseBody.list;
                            if ($scope.pagedata.type == "collect") {
                                if (!$scope.list.length) {
                                    $scope.loadtext = "暂无收藏";
                                }
                            } else if ($scope.pagedata.type == "history") {
                                if (!$scope.list.length) {
                                    $scope.loadtext = "暂无历史记录";
                                }
                            }
                        }
                    } else {
                        if ($scope.pagedata.type == "yuyue") {
                            if (!res.response.responseBody) {
                                $scope.list = [];
                                $scope.loadtext = "暂无预约";
                            }
                        }
                    }

                    if (!$scope.list.length) {
                        $scope.isedit = false;
                        $scope.allselect = false;
                    }
                });
            }
            if($scope.typess){
                $scope.pagetype($scope.typess)
            }
            // 编辑事件
            $scope.edit = function () {
                if ($scope.list.length) {
                    $scope.isedit = !$scope.isedit;
                }
            };
            $scope.isdel = false;
            $scope.allselect = false;
            $scope.select = function () {
                var checklength = $('.pitem input[type="checkbox"]:checked').length;
                if (checklength == $scope.list.length) {
                    $scope.allselect = true;
                } else {
                    $scope.allselect = false;
                }
            }
            $scope.selectAll = function () {
                $scope.allselect = !$scope.allselect;
                if ($scope.allselect) {
                    $("input[type='checkbox']").each(function () {
                        $(this)[0].checked = true;
                    })
                } else {
                    $("input[type='checkbox']").each(function () {
                        $(this)[0].checked = false;
                    })
                }

            }
            // 获取删除请求地址
            $scope.getdelurl = function (type) {
                if (type == "history") {
                    return URLS.ajaxurl + 'user/history/del.json?openId=' + $scope.openid + '&token=' + $scope.token + '&ids=' + $scope.ids;
                } else if (type == 'collect') {
                    return URLS.ajaxurl + 'user/collect/save.json?openId=' + $scope.openid + '&token=' + $scope.token + '&ids=' + $scope.ids + '&operation=-2';
                } else if (type == 'yuyue') {
                    return encodeURI(URLS.ajaxurl + "user/multiselectReserveLive.json");
                    // return encodeURI(URLS.ajaxurl + "user/multiselectReserveLive.json?isReserve=0&reserveLiveListData="+JSON.stringify($scope.ids));
                }
                ;
            }
            // 删除请求
            $scope.hsdel = function () {
                $scope.isdel = true;
                $scope.ids = [];
                var checkBox = $("input[type='checkbox']:checked");
                if ($scope.pagedata.type == 'yuyue') {
                    checkBox.each(function () {
                        var index = $(this).index('input[type="checkbox"]');
                        var json = {
                            'liveStartTime': $scope.list[index].liveStartTime,
                            'liveEndTime': $scope.list[index].liveEndTime,
                            'openId': $scope.openid,
                            'channelId': $scope.list[index].channelId,
                            'channelCode': $scope.list[index].channelCode,
                            'channelNameZh': encodeURI($scope.list[index].channelNameZh),
                            'channelNameEn': $scope.list[index].channelNameEn,
                            'programName': encodeURI($scope.list[index].programName),
                            'channelPicUrl': $scope.list[index].channelPicUrl,
                            'kankeId': $scope.list[index].kankeId,
                            'vodId': $scope.list[index].vodId
                        };
                        var pindex = parseInt((index) / 10);
                        if ($scope.ids[pindex] === undefined) {
                            $scope.ids[pindex] = [];
                        }
                        $scope.ids[pindex].push(json)
                    })
                } else {
                    checkBox.each(function () {
                        var index = $(this).index('input[type="checkbox"]');
                        $scope.ids.push($scope.list[index].id)
                    })
                    $scope.ids = $scope.ids.join(',');
                }

                if (!$scope.ids.length) {
                    CUES.tip({"msg": "未选择", "type": "danger"});
                    $scope.isdel = false;
                    return false;
                }

                var urldel = $scope.getdelurl($scope.pagedata.type);

                $scope.count = 0;
                $scope.yuyueDel = function () {
                    if (!$scope.ids[$scope.count]) {
                        $scope.isdel = false;
                        $scope.pagetype($scope.pagedata.type);
                        CUES.tip({"msg": "删除操作成功", "type": "success"});
                        return false;
                    }
                    data = {
                        'openId': $scope.openid,
                        isReserve: 0,
                        reserveLiveListData: JSON.stringify($scope.ids[$scope.count])
                    }
                    var transform = function (data) {
                        return $.param(data);
                    };

                    $http[$scope.pagedata.mothed](urldel, data, {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                        },
                        transformRequest: transform
                    }).success(function (res) {
                        if (res.response.responseHeader.code == 200) {
                            $scope.count++;
                            $scope.yuyueDel();
                        }
                    });
                }
                if ($scope.pagedata.type == 'yuyue') {
                    $scope.yuyueDel();
                } else {
                    $http[$scope.pagedata.mothed](urldel, {}).success(function (res) {
                        if (res.response.responseHeader.code == 200) {
                            $scope.isdel = false;
                            $scope.pagetype($scope.pagedata.type)
                            CUES.tip({"msg": "删除操作成功", "type": "success"});
                        }
                    });
                }

            };
        }})
}]);

app.controller('deviceCtrl', ['$scope','$location','$http','$cookieStore','$timeout','URLS','$rootScope', function($scope, $location,$http,$cookieStore,$timeout,URLS,$rootScope) {
    $rootScope.$watch('init',function(newValue,oldValue){
        if(newValue) {
            $scope.token = $cookieStore.get('token');
            $scope.openid = $cookieStore.get('openid');
            $scope.boxId_active = $cookieStore.get('boxId');
            $scope.data = {
                "pageSize": 15,
                "pageNo": 1,
            };
            $scope.bs = new botscroll(100); // 滚动事件
            $scope.device = [];
            $scope.getAjax = function () {
                $http.post(URLS.ajaxurl + 'user/getDevice.json?openId=' + $scope.openid + "&pageNo=" + $scope.data.pageNo + "&pageSize=" + $scope.data.pageSize, {}).success(function (res) {
                    console.log("设备列表信息", res)
                    if (res && res.responseHeader && res.responseHeader.code == 200) {
                        // $scope.device = $scope.device.concat(res.responseBody);
                        $scope.device = res.responseBody.list;
                        $scope.deviceActive = res.responseBody.active == 'null' ? '' : res.responseBody.active;
                        $cookieStore.put("boxId", $scope.deviceActive);
                        console.log($scope.deviceActive)
                        if (res.responseBody.length < 10) {
                            $scope.datadone = true;
                            $scope.loadtext = '已加载全部数据';
                        } else {
                            $scope.datadone = false;
                            $scope.loadtext = '正在玩命加载···';
                        }
                    } else {
                        $scope.datadone = true;
                        $scope.loadtext = '数据加载错误';
                    }

                });
            }
            $scope.getAjax();
            $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
                // $scope.lazy.setlazy($('.lazy'));
                $scope.bs.setmax($('#html').height());
                if (!$scope.datadone) {
                    $scope.bs.isoff = false;
                }
            })
            // 滚动底部加载
            $scope.bs.getbot = function () {
                $scope.data.pageNo++;
                $scope.bs.isoff = true;
                $scope.getAjax();
            };
            // 静态设备列表信息
            // $scope.device = {"list":[{"boxId": "666666","boxName": "","id":3},{"boxId": "222222222222","boxName": "客厅电视","id":3},{"boxId": "444444444444","boxName": "卧室电视","id":5}],"active": "666666"}

            // 编辑事件
            $scope.edit = function () {
                $scope.isedit = !$scope.isedit;
            };

            // 切换默认设备
            $scope.qiehuan = function (v) {
                if (!$scope.isedit) {

                    // 此处添加切换设备事件
                    // alert('此处添加切换设备事件')
                    $http.post(URLS.ajaxurl + 'user/bind.json?key=' + $scope.openid + '&type=0&value=' + v, {}).success(function (e) {
                        if (e && e.response.responseHeader.code == "200" && e.response.responseBody != 'null') {
                            $scope.deviceActive = v;
                            $cookieStore.put("boxId", v);
                        }
                        ;
                    });

                    // $cookieStore.put("boxId",v);
                }
                ;
            };

            $scope.pop = {};
            $scope.pop.show = false;
            $scope.pop.edit = false;
            $scope.pop.del = false;
            // 隐藏弹层
            $scope.cancel = function () {
                $scope.pop = {};
            };

            // 编辑设备
            $scope.editdevice = function (v) {
                $scope.active_device = v;
                $scope.dname = v.boxName || v.boxId;
                $scope.pop.show = true;
                $scope.pop.edit = true;
            };

            // 更新设备名称
            $scope.surename = function () {
                if (!$scope.dname || $scope.dname.length == 0) {
                    CUES.tip({"msg": "请输入设备名称", "type": "danger"});
                    return false;
                }
                ;

                // http://hbwechat.kanketv.com/hbiptv-api/api/v1/user/device/update.json?openId=ohQIKwY3xR0u0a7irnoughMWz2j0&boxId=abcd123&boxName=卧室
                $http.get(URLS.ajaxurl + 'user/device/update.json?openId=' + $scope.openid + "&boxId=" + $scope.active_device.boxId + "&boxName=" + $scope.dname, {}).success(function (res) {
                    console.log("设备更新", res)
                    if (res) {
                        CUES.tip({"msg": "设备更新成功", "type": "success"});
                        $scope.active_device.boxName = $scope.dname;
                        $scope.pop = {};
                        $scope.isedit = !$scope.isedit;
                    } else {
                        CUES.tip({"msg": "设备更新失败", "type": "danger"});
                    }

                });
            };

            //删除设备
            $scope.deldevice = function (v, index) {
                /*if(v.boxId==$scope.boxId_active){
                 CUES.tip({"msg":"此设备正在使用，无法删除","type":"danger"});
                 return false;
                 };*/
                console.log(v, index)
                $scope.delobj = v; // 缓存将要删除的信息
                $scope.delindex = index;
                $scope.pop.show = true;
                $scope.pop.del = true;

            };
            // 删除设备
            $scope.godelete = function () {
                $http.get(URLS.ajaxurl + 'user/device/delete.json?openId=' + $scope.openid + "&boxId=" + $scope.delobj.boxId, {}).success(function (res) {
                    console.log("设备更新", res)
                    if (res.responseHeader.code == '200') {
                        CUES.tip({"msg": "设备删除成功", "type": "success"});
                        $cookieStore.put("boxId", "");
                        $scope.device.splice($scope.delindex, 1);
                        $scope.pop = {};
                        $scope.isedit = !$scope.isedit;
                    } else {
                        CUES.tip({"msg": "设备删除失败", "type": "danger"});
                    }

                });
            };
            // 扫一扫添加设备
            $scope.add_d = function () {
                wx.scanQRCode({
                    needResult: 1,
                    desc: '扫描设备码',
                    success: function (res) {
                        var ma = res.resultStr;
                        // var ma = JSON.stringify(res);
                        // http://hbwx.kanke.tv/hbiptv-weixin/wxtv/scan/bind?url=xxxx&openId=xxxxx

                        $http.post(URLS.baseurl + 'wxtv/scan/bind?openId=' + $scope.openid + "&url=" + ma, {}).success(function (res) {
                            console.log("设备列表信息", res)
                            if (res.code == 0) {
                                CUES.tip({"msg": "设备添加成功", "type": "success"});
                                /* var obj = {},arr = [];
                                 obj.boxId = res.boxId;
                                 obj.boxName = res.boxId;
                                 obj.id = '';
                                 obj.level = 0;
                                 obj.openId = $scope.openid;
                                 arr.push(obj);
                                 arr.concat($scope.device);*/
                                // $scope.device=arr.concat($scope.device);
                                $scope.getAjax();
                                $scope.$apply();
                            } else {
                                CUES.tip({"msg": "设备添加失败", "type": "danger"});
                            }

                        });

                    }
                });

            }
        }})
}]);

app.controller('systemCtrl', ['$scope','$location','$http','$cookieStore','$timeout','URLS','$rootScope', function($scope, $location,$http,$cookieStore,$timeout,URLS,$rootScope) {
    $rootScope.$watch('init',function(newValue,oldValue){
        if(newValue) {
            $scope.token = $cookieStore.get('token');
            $scope.openid = $cookieStore.get('openid');
            $http.post(URLS.ajaxurl + 'msg/getmsg.json?userid=' + $scope.openid, {}).success(function (res) {
                console.log("系统消息", res)
                if (res && res.responseHeader && res.responseHeader.code == 'SYS_200') {
                    $scope.list = res.responseBody;
                    for (var i = 0, len = $scope.list.length; i < len; i++) {
                        $scope.list[i].shou = true;
                    }
                }

            });

            //标记已读
            $scope.readed = function (v) {
                for (var i = 0, len = $scope.list.length; i < len; i++) {
                    if ($scope.list[i].msgId != v.msgId) {
                        $scope.list[i].shou = true;
                    }
                }
                v.shou = !v.shou;
                $http.get(URLS.ajaxurl + 'msg/upload.json?userid=' + $scope.openid + '&array=' + v.msgId, {}).success(function (res) {
                    console.log("标记已读", res)
                    if (res && res.responseHeader && res.responseHeader.code == 'SCC_002') {
                        v.status = 1;
                    }

                });
            };

            //标记所有
            $scope.allreaded = function () {
                var arr = [], dt = $scope.list;
                for (var i = 0; i < $scope.list.length; i++) {
                    if (dt[i].status == 0) {
                        arr.push(dt[i].msgId);
                        dt[i].status = 1;
                    }
                }
                $http.get(URLS.ajaxurl + 'msg/upload.json?openId=' + $scope.openid + '&userid=' + $scope.openid + '&array=' + arr.join(','), {}).success(function (res) {
                    console.log("标记已读", res)
                });
            }
        }})
}]);





app.controller('dianlistCtrl', ['$scope','$location','$http','$cookieStore','$timeout','URLS','$rootScope', function($scope, $location,$http,$cookieStore,$timeout,URLS,$rootScope) {
    $rootScope.$watch('init',function(newValue,oldValue){
        if(newValue) {
            $scope.sc = GetRequest();

            // var wu = window.location.href,name="classId";
            // var reg = new RegExp(name + "=([^&#]*)"); //构造一个含有目标参数的正则表达式对象
            // console.log(wu.substr(1).match(reg)); //匹配目标参数

            $scope.toptil = $scope.sc.coltype ? {
                "tv": "电视剧",
                "film": "电影",
                "arts": "综艺",
                "anime": "动漫",
                "documentary": "纪录片"
            }[$scope.sc.coltype] : "频道获取失败";

            // 预定义查询参数
            $scope.data = {
                "videoType": $scope.sc.coltype,
                "region": '',
                "year": '',
                "type": '',
                "pageSize": 12,
                "pageNo": 1,
                "ismatch": 1,
                "queryStr": "",
                "solrOrder": '',
                "openId": $cookieStore.get('openid')
            };

            //二级分类
            $http.get(URLS.ajaxurl + 'vod/classType.json?openId=' + $cookieStore.get('openid') + '&type=' + $scope.sc.coltype, {}).success(function (res) {
                console.log('二级菜单', res);
                if (res && res.response.responseHeader && res.response.responseHeader.code == 200) {
                    $scope.typels = res.response.responseBody;
                    $scope.active_sub();
                }
                ;
            });

            $scope.tindex = 0;

            // 高亮标签
            $scope.active_sub = function () {
                // $scope.data.queryStr = decodeURIComponent($scope.typels[0].solrSql);
                if ($scope.sc.classId) {
                    var v = $scope.sc.classId, dt = $scope.typels, len = dt.length;
                    for (var i = 0; i < len; i++) {
                        if (dt[i].id == v) {
                            $scope.tindex = i;
                            $scope.data.queryStr = dt[i].solrSql;
                            $scope.data.solrOrder = dt[i].solrOrder;
                            break;
                        }
                        ;
                    }
                    ;
                }
                ;
                // 获取列表
                $scope.getAjax();
            };

            // 预定义懒加载
            $scope.lazy = new lazyload({
                'class': '.lazy',
                'elm': '#J_list',
                'outbot': 100
            });

            $scope.bs = new botscroll(100); // 滚动事件
            $scope.datadone = false;

            $scope.$on('lazy', function (ngRepeatFinishedEvent) {
                $scope.lazy.setlazy($('.lazy'));
                $scope.bs.setmax($('#html').height());
                if (!$scope.datadone) {
                    $scope.bs.isoff = false;
                }
            })
            $scope.$on('goscroll', function (ngRepeatFinishedEvent) {
                var elm = $('.typelstable_ls.active').eq(0)[0];
                document.getElementById('J_typelstable').scrollLeft = elm.getBoundingClientRect().left;
            });

            $scope.list = []; // 预定义内容数组
            $scope.loadtext = '正在玩命加载···';

            // 数据查询
            $scope.getAjax = function () {
                var senturl = URLS.ajaxurl + 'vod/siftings.json',
                    transform = function (data) {
                        return $.param(data);
                    };
                $http.post(senturl, $scope.data, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                    transformRequest: transform
                }).success(function (e) {
                    console.log('结果', e.response);
                    if (e && e.response.responseHeader && e.response.responseHeader.code == 200) {
                        $scope.list = $scope.list.concat(e.response.responseBody.list);
                        if (e.response.responseBody.list.length < 12) {
                            console.log('in')
                            $scope.datadone = true;
                            $scope.loadtext = '已加载全部数据';
                            if (!$scope.list.length) {
                                $scope.loadtext = '暂无数据';
                            }
                        } else {
                            $scope.datadone = false;
                            $scope.loadtext = '正在玩命加载···';
                        }
                    } else {
                        $scope.datadone = true;
                        $scope.loadtext = '数据加载错误';
                    }
                    ;
                }).error(function (error) {
                    $scope.loadtext = '数据加载错误';
                });
            };


            // 滚动底部加载
            $scope.bs.getbot = function () {
                $scope.data.pageNo++;
                $scope.bs.isoff = true;
                $scope.getAjax();
            };

            // 切换tag
            $scope.changetype = function (v, index) {
                $scope.tindex = index;
                $scope.list = [];
                $scope.data.tags = v;
                $scope.data.pageNo = 1;
                $scope.data.queryStr = decodeURIComponent(v.solrSql);
                $scope.data.solrOrder = decodeURIComponent(v.solrOrder);
                $scope.getAjax();
            };

            $scope.$on("$destroy", function () {
                $scope.bs.isoff = true;
            });
        }})
}]);

app.controller('chooseCtrl', ['$scope','$location','$http','$cookieStore','$timeout','URLS','$rootScope', function($scope, $location,$http,$cookieStore,$timeout,URLS,$rootScope) {
    $rootScope.$watch('init',function(newValue,oldValue){
        if(newValue) {
            $scope.sc = GetRequest();

            $scope.toptil = $scope.sc.coltype ? {
                "tv": "电视剧",
                "film": "电影",
                "arts": "综艺",
                "anime": "动漫",
                "documentary": "纪录片"
            }[$scope.sc.coltype] : "频道获取失败";


            // 预定义查询参数
            $scope.data = {
                "videoType": $scope.sc.coltype,
                "region": '',
                "year": '',
                "type": '',
                "pageSize": 12,
                "pageNo": 1,
                "ismatch": 1,
                "openId": $cookieStore.get('openid')
            };


            // 预定义懒加载
            $scope.lazy = new lazyload({
                'class': '.lazy',
                'elm': '#J_list',
                'outbot': 100
            });

            $scope.bs = new botscroll(100); // 滚动事件
            $scope.datadone = false;


            $scope.$on('lazy', function (ngRepeatFinishedEvent) {
                $scope.lazy.setlazy($('.lazy'));
                $scope.bs.setmax($('#html').height());
                if (!$scope.datadone) {
                    $scope.bs.isoff = false;
                }
            })

            $scope.list = []; // 预定义内容数组
            $scope.loadtext = '正在玩命加载···';

            // 数据查询
            $scope.getAjax = function () {
                var senturl = URLS.ajaxurl + 'vod/siftings.json',
                    transform = function (data) {
                        return $.param(data);
                    };
                $http.post(senturl, $scope.data, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                    transformRequest: transform
                }).success(function (e) {
                    console.log('结果', e.response);
                    if (e && e.response.responseHeader && e.response.responseHeader.code == 200) {
                        $scope.list = $scope.list.concat(e.response.responseBody.list);
                        if (e.response.responseBody.list.length < 12) {
                            console.log('in')
                            $scope.datadone = true;
                            $scope.loadtext = '已加载全部数据';
                        } else {
                            $scope.datadone = false;
                            $scope.loadtext = '正在玩命加载···';
                        }
                    } else {
                        $scope.datadone = true;
                        $scope.loadtext = '数据加载错误';
                    }
                    ;
                });
            };
            $scope.getAjax();


            // 滚动底部加载
            $scope.bs.getbot = function () {
                $scope.data.pageNo++;
                $scope.bs.isoff = true;
                $scope.getAjax();
            };

            $scope.$on("$destroy", function () {
                $scope.bs.isoff = true;
            });

            // 查询选择条件
            $http.post(URLS.ajaxurl + 'vod/getcolumncategory.json?openId=' + $cookieStore.get('openid'), {}).success(function (res) {
                console.log('选择条件', res);
                var t = $scope.sc.coltype,
                    dt = res.response.responseBody,
                    len = dt.length;
                for (var i = 0; i < len; i++) {
                    if (dt[i].name == t) {
                        $scope.category = dt[i].list;
                    }
                    ;
                }
            });

            // 设置筛选条件
            $('#choosetable').on('click', '.choose_ls', function () {
                var self = $(this),
                    tp = self.attr('vtype'),
                    val = self.attr('vval') == "全部" ? "" : self.attr('vval');
                self.parent().parent().find('.choose_ls').removeClass('active');
                self.addClass('active');
                $scope.data[tp] = val;
               /* if (tp == "device") {
                    $scope.data.ismatch = (val == '') ? '' : 1;
                }*/
                ;

                $scope.data.pageNo = 1;
                $scope.list = [];
                $scope.getAjax();
            });

            // // 展示选择条件
            // $scope.showxuan = function() {
            //     if(!$scope.pop.xuan){
            //         $scope.pop.boxshow = true;
            //         $scope.pop.xuan = true;
            //         $scope._divs.seth();
            //     }else{
            //         $scope.pop = {};
            //     }
            // };
            // // 条件选择完成
            // $scope.xuanze = function() {
            //     $scope.data.pageNo = 1;
            //     $scope.pop = {};
            //     $scope.list = [];
            //     $scope.getAjax();
            // };
        }})
}]);

app.controller('reboCtrl', ['$scope','$location','$http','$cookieStore','$timeout','URLS','$rootScope', function($scope, $location,$http,$cookieStore,$timeout,URLS,$rootScope) {
    $rootScope.$watch('init',function(newValue,oldValue){
        if(newValue) {
            $scope.net = false;
            if (window.navigator.onLine == true) {
                $scope.net = true;
            } else {
                $scope.net = false;
            }

            $http.get(URLS.ajaxurl + 'vod/getHomes.json?openId=' + $cookieStore.get('openid') + '&type=rb&v=' + (new Date()).getTime(), {}).success(function (res) {
                console.log('热播推荐', res);
                $scope.result = res.response.responseBody;
            });
            $scope.$on('rbanner', function () {
                new swiper({"elm": document.getElementById('J_banner')});
            });
        }})
}]);


app.controller('zhuijuCtrl', ['$scope','$location','$http','$cookieStore','$timeout','URLS','$rootScope', function($scope, $location,$http,$cookieStore,$timeout,URLS,$rootScope) {
    $rootScope.$watch('init',function(newValue,oldValue){
        if(newValue) {
            $scope.net = false;
            if (window.navigator.onLine == true) {
                $scope.net = true;
            } else {
                $scope.net = false;
            }
            $http.get(URLS.ajaxurl + 'vod/getHomes.json?openId=' + $cookieStore.get('openid') + '&type=zj&v=' + (new Date()).getTime(), {}).success(function (res) {
                console.log('追剧', res);
                $scope.result = res.response.responseBody;
            });

            $scope.$on('rbanner', function () {
                new swiper({"elm": document.getElementById('J_banner')});
            });
        }})
}]);

app.controller('diandetialCtrl', ['$scope','$location','$http','$cookieStore','$cookies','$timeout','URLS','$rootScope', function($scope, $location,$http,$cookieStore,$cookies,$timeout,URLS,$rootScope) {
    $rootScope.$watch('init',function(newValue,oldValue){
        if(newValue) {
            $scope.net = false;
            if (window.navigator.onLine == true) {
                $scope.net = true;
            } else {
                $scope.net = false;
            }
            $scope.cmobj = {};
            $scope.tvtishi = false;
            $scope.sc = GetRequest();
            $scope.code = getUrlParam('code');
            $scope.statecheck = function () {
                //点赞 收藏状态
                var stateurl = URLS.ajaxurl + 'user/state/check.json?openId=' + $cookieStore.get('openid') + '&kankeId=' + $scope.sc.kankeId + '&vodId=' + $scope.sc.vodId + '&token=' + $scope.token;
                $http.post(stateurl, {}).success(function (e) {
                    // console.log('点赞收藏', e.response);
                    if (e && e.response.responseHeader && e.response.responseHeader.code == 200) {
                        $scope.infodone = true;
                        $scope.states = e.response.responseBody;
                        $scope.is_collect = parseInt($scope.states.isCollectioned); //是否收藏
                        $scope.likenum = parseInt($scope.states.beLikeCount); //点赞数量
                        $scope.is_like = $scope.states.beLike != 0 ? true : false; //是否点赞
                    }
                });
            }
            // 获取用户信息并储存
            if ($scope.code != null && $scope.code != "null" && $scope.code != undefined && $scope.code != '' && !$cookies.token) {
                $http.post(URLS.baseurl + 'wxtv/init?code=' + $scope.code, {}).success(function (e) {
                    console.log('user', e)
                    if (e.code == 0) {
                        var dt = e.data;
                        $cookieStore.put('openid', dt.openId);
                        $cookieStore.put('headimgurl', dt.headimgurl);
                        $cookieStore.put('nickname', dt.nickname);
                        $cookieStore.put('token', dt.token);
                        $scope.token = dt.token;

                        $scope.nickname = dt.nickname;
                        $scope.headimg = dt.headimgurl;

                        // 获取boxId
                        $http.post(URLS.ajaxurl + 'user/bind.json?key=' + dt.openId + '&type=1', {}).success(function (e) {
                            console.log('boxid', e)
                            if (e && e.response.responseHeader.code == "200" && e.response.responseBody != "null" && e.response.responseBody != undefined && e.response.responseBody != "") {
                                $cookieStore.put("boxId", e.response.responseBody);
                            }
                        });
                        $scope.statecheck();

                    }
                });
            } else {
                $scope.token = $cookieStore.get('token');
                $scope.nickname = $cookieStore.get('nickname');
                $scope.headimg = $cookieStore.get('headimgurl');
                $scope.statecheck();

            }
            ;
            /**/
            $scope.openid = $cookieStore.get('openid');
            //openId='+$cookieStore.get('openid')+'&
            $scope.commentfocus = function () {
                $("#J_text").focus();
            }


            //获取节目详情
            $scope.getdetaildata = function (kankeId, vodId) {
                var url = URLS.ajaxurl + 'vod/detail.json?openId=' + $scope.openid + '&kankeId=' + kankeId + '&vodId=' + vodId;
                $http.get(url, {}).success(function (e) { // get 修改为post
                    console.log('节目详情', e.response);
                    if (!e && !e.response || !e.response.responseBody) {
                        return false;
                    }
                    ;

                    $scope.detial = e.response.responseBody;
                    $scope.sc.isMatch = $scope.sc.isMatch ? $scope.sc.isMatch : $scope.detial.isMatch;
                    $scope.desc = $scope.detial.shortdes;

                    if ($scope.sc.columnType != 'film') {
                        $scope.getdm_tv(1);
                        $scope.pageobj.key_en = $scope.detial.details.length ? $scope.detial.details[0].key_en : '';
                        $scope.getdm_mb(1);
                    }
                    ;
                    if (_wxshare_on) {
                        //微信分享
                        var urltem = window.location.href;
                        wxshare.weixinshare_(e.response.responseBody.title, e.response.responseBody.lpic + '!m180x180.jpg', e.response.responseBody.description.substr(0, 26) + '···', urltem);
                    }
                });
            };
            $scope.getdetaildata($scope.sc.kankeId, $scope.sc.vodId);

            // 切换简介
            $scope.changedesc = function () {
                $scope.desc = $scope.desc == $scope.detial.shortdes ? $scope.detial.description : $scope.detial.shortdes;
            };

            // 推荐列表
            var urltj = URLS.ajaxurl + 'vod/iti_vod.json?openId=' + $scope.openid + '&kanke_id=' + $scope.sc.kankeId + '&vodId=' + $scope.sc.vodId;
            $http.post(urltj, {}).success(function (e) {
                // console.log('相关推荐', e.response)
                if (e && e.response.responseHeader && e.response.responseHeader.code == 200) {
                    $scope.parttj = true;
                    $scope.tjlist = e.response.responseBody;
                }
                ;
            });

            // 评论
            // 是否可以评论
            $http.post(URLS.ajaxurl + 'user/getcommentkey.json?openId=' + $scope.openid, {}).success(function (e) {
                // console.log('是否评论开关', e);
                if (e && e.responseHeader && e.responseHeader.code == 200) {
                    $scope.key = e.responseBody.key;
                    if ($scope.key && ($scope.key == 0 || $scope.key == "0")) {
                        $scope.getpl();
                    }
                }
            });

            //评论列表
            $scope.getpl = function () {
                var plurl = URLS.ajaxurl + 'user/comment/list.json?openId=' + $scope.openid + '&vodId=' + $scope.sc.vodId + '&kankeId=' + $scope.sc.kankeId;
                $http.post(plurl, {}).success(function (e) {
                    console.log('评论列表', e.response);
                    if (e && e.response.responseHeader && e.response.responseHeader.code == 200) {
                        $scope.pllist = e.response.responseBody.list;
                        $scope.pltotal = e.response.responseBody.totalrecords;
                    }
                });
            };

            /*//点赞 收藏状态
             var stateurl = URLS.ajaxurl + 'user/state/check.json?kankeId=' + $scope.sc.kankeId + '&vodId=' + $scope.sc.vodId + '&token=' + $scope.token;
             $http.post(stateurl, {}).success(function(e) {
             // console.log('点赞收藏', e.response);
             if(e && e.response.responseHeader && e.response.responseHeader.code == 200) {
             $scope.infodone = true;
             $scope.states = e.response.responseBody;
             $scope.is_collect = parseInt($scope.states.isCollectioned); //是否收藏
             $scope.likenum = parseInt($scope.states.beLikeCount); //点赞数量
             $scope.is_like = $scope.states.beLike != 0 ? true : false; //是否点赞
             }
             });*/
            $scope.shareyin = false;
            // 分享事件
            $scope.goshare = function () {
                // alert('直接调用jssdk事件');
                $('#tshare').show();
            };
            $scope.tshare = function ($event) {
                $event.stopPropagation()
            }
            $scope.hideshare = function () {
                $('#tshare').hide();
            }
            // 明星列表
            var starurl = URLS.recommend + 'stars.json?openId=' + $scope.openid + '&kanke_id=' + $scope.sc.kankeId;
            // var starurl = '/hebei/api/starlist.json';
            $http.get(starurl, {}).success(function (e) {
                console.log('明星列表', e);
                if (e && e.responseHeader && e.responseHeader.code == 200) {
                    $scope.actorslist = e.responseBody;
                }
            });
            // 发表评论
            $scope.sentmsg = function () {
                if (!$scope.cmobj.text || $scope.cmobj.text.length == 0) {
                    CUES.tip({"msg": "请输入评论内容", "type": "danger"});
                    return false;
                }
                ;
                if ($scope.sc.vodId == 0 && $scope.sc.kankeId == '') {
                    CUES.tip({"msg": "无法评论", "type": "danger"});
                    return false;
                }
                ;

                var senturl = URLS.ajaxurl + 'user/comment/save.json?',
                    data = {
                        "kankeId": $scope.sc.kankeId,
                        "vodId": $scope.sc.vodId,
                        "context": $scope.cmobj.text,
                        "token": $scope.token,
                        "openId": $scope.openid
                    },
                    transform = function (data) {
                        return $.param(data);
                    };

                $http.post(senturl, data, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                    transformRequest: transform
                }).success(function (e) {
                    // console.log('发表评论', e.response)
                    if (e && e.response.responseHeader && e.response.responseHeader.code == 200) {
                        CUES.tip({"msg": "评论成功", "type": "success"});
                        var dt = new Date();
                       /* $scope.pllist = [{
                            addtime: dt.getFullYear() + '-' + (dt.getMonth() + 1) + '-' + dt.getDate() + ' ' + dt.getHours() + ':' + dt.getMinutes(),
                            context: $scope.cmobj.text,
                            nickname: $scope.nickname,
                            headImgurl: $scope.headimg
                        }].concat($scope.pllist)*/
                        $scope.getpl();
                        $scope.cmobj.text = undefined;
                    }
                });
            };

            // 点赞 取消点赞
            $scope.like = function () {
                if (!$scope.detial || !$scope.infodone) {
                    CUES.tip({"msg": '无法点赞', "type": "warning"});
                    return false;
                }
                ;
                if ($scope.is_like) { //取消点赞                 
                    var urlscy = URLS.ajaxurl + 'user/collect/save.json?openId=' + $scope.openid + '&operation=-1&token=' + $scope.token + '&vodId=' + $scope.sc.vodId + '&kankeId=' + $scope.sc.kankeId;
                } else { //点赞               
                    var urlscy = URLS.ajaxurl + 'user/collect/save.json?openId=' + $scope.openid + '&operation=1&token=' + $scope.token + '&vodId=' + $scope.sc.vodId + '&kankeId=' + $scope.sc.kankeId;
                }
                $http.post(urlscy, {}).success(function (e) {
                    // console.log('点赞||取消点赞', e.response);
                    if (e && e.response.responseHeader && e.response.responseHeader.code == 200) {
                        CUES.tip({"msg": ($scope.is_like ? '取消点赞' : '点赞成功'), "type": "success"});
                        $scope.is_like ? $scope.likenum-- : $scope.likenum++;
                        $scope.is_like = !$scope.is_like;
                    } else {
                        CUES.tip({"msg": ($scope.is_like ? '取消点赞失败' : '点赞失败'), "type": "warning"});
                    }
                });
            };

            // 收藏 取消收藏
            $scope.collect = function () {
                if (!$scope.detial) {
                    CUES.tip({"msg": '无法添加收藏', "type": "warning"});
                    return false;
                }
                ;
                if ($scope.is_collect) { //取消收藏
                    var urlscy = URLS.ajaxurl + 'user/collect/save.json?openId=' + $scope.openid + '&operation=-2&token=' + $scope.token + '&ids=' + $scope.is_collect;
                } else { //收藏
                    // var urlscy = URLS.ajaxurl + 'user/collect/save.json?operation=2&token=' + $scope.token + '&vodId=' + $scope.sc.vodId + '&kankeId=' + $scope.sc.kankeId;
                    var urlscy = URLS.ajaxurl + 'user/collect/save.json?openId=' + $scope.openid + '&operation=2&token=' + $scope.token + '&vodId=' + $scope.sc.vodId + '&kankeId=' + $scope.sc.kankeId;
                }
                $http.post(urlscy, {}).success(function (e) {
                    // console.log('收藏', e.response);
                    if (e && e.response.responseHeader && e.response.responseHeader.code == 200) {
                        CUES.tip({"msg": ($scope.is_collect ? '取消收藏' : '收藏成功'), "type": "success"});
                        $scope.is_collect = e.response.responseBody;
                    } else {
                        CUES.tip({"msg": ($scope.is_collect ? '取消收藏失败' : '收藏失败'), "type": "warning"});
                    }
                });
            };

            // 选择播放方式 电影剧集
            $scope.getsingle = function (v, eq) {
                $scope.activejson = $scope.detial.details[eq];
                $scope.playmb();
            };

            // 关闭弹层
            $scope.closechoose = function () {
                $scope.chooseshow = false;
            };
            $scope.drama = "";
            //手机播放
            $scope.playmb = function () {
                if ($scope.sc.columnType == "film") {
                    $scope.drama = "";
                    $scope.playvideo($scope.activejson.link ? $scope.activejson.link : $scope.detial.details[0].link);
                } else {
                    if ($scope.sc.columnType == "arts" || $scope.sc.columnType == "documentary") {
                        $scope.drama = $scope.activejson.deTitle + "   " + $scope.activejson.description;
                    } else {
                        $scope.drama = "第" + $scope.activejson.deTitle + "集";
                    }
                    $scope.playvideo($scope.activejson.link ? $scope.activejson.link : $scope.pageobj.darma_mb[0].link);
                }
            };

            // 跳转手机播放并添加播放历史记录
            $scope.playvideo = function (url) {
                $scope.addhis(url);
            };
            //绑定提示框
            $scope.tips = false;
            $scope.stopBubble = function ($event) {
                $event.stopPropagation()
            }
            $scope.resetstate = function () {
                $scope.tips = false;
            }
            // 电视推送并添加历史记录
            $scope.playtv = function (tvtu) {
                $scope.tvtishi = false;
                $("body").off("touchmove");
                if (!$cookieStore.get("boxId")) {
                    $scope.tips = true;
                    return false;
                }
                var urlpv = URLS.ctrl;
                if ($scope.sc.columnType == "film" || tvtu) {
                    $scope.activejson = {};
                    $scope.activejson = $scope.sc.columnType == "film" ? $scope.detial.vod_details : $scope.pageobj.darma_tv[0];
                }
                /*if(!$scope.activejson.programCode) {
                 //urlpv += 'playVideo.json?boxId=' + $cookieStore.get("boxId") + '&mediaType=' + $scope.activejson.mediaType + '&code=' + $scope.activejson.code + '&title=' + $scope.detial.title;
                 urlpv += 'playVideo.json?boxId=' + $cookieStore.get("boxId") + '&mediaType=video&code=' + $scope.activejson.code + '&title=' + $scope.detial.title;
                 } else {
                 //urlpv += 'playVideo.json?boxId=' + $cookieStore.get("boxId") + '&code=' + $scope.activejson.code + '&mediaType=' + $scope.activejson.mediaType + '&seriesCode=' + $scope.activejson.programCode + '&title=' + $scope.detial.title;
                 urlpv += 'playVideo.json?boxId=' + $cookieStore.get("boxId") + '&code=' + $scope.activejson.code + '&mediaType=series&seriesCode=' + $scope.activejson.programCode + '&title=' + $scope.detial.title;
                 }*/
                if ($scope.sc.columnType == "film") {
                    $scope.drama = '';
                    urlpv += 'playVideo.json?boxId=' + $cookieStore.get("boxId") + '&mediaType=video&code=' + $scope.activejson.code + '&title=' + $scope.detial.title;
                } else {
                    $scope.drama = $scope.activejson.name;
                    if ($scope.activejson.code == undefined || $scope.activejson.code == "") {
                        urlpv += 'playVideo.json?openId=' + $cookieStore.get('openid') + '&boxId=' + $cookieStore.get("boxId") + '&mediaType=video&code=' + $scope.activejson.programCode + '&title=' + $scope.detial.title;
                    } else {
                        urlpv += 'playVideo.json?openId=' + $cookieStore.get('openid') + '&boxId=' + $cookieStore.get("boxId") + '&code=' + $scope.activejson.programCode + '&mediaType=series&seriesCode=' + $scope.activejson.code + '&title=' + $scope.detial.title;
                    }
                }
                console.log('推送播放串：', $scope.activejson);
                $http.post(urlpv, {}).success(function (res) {
                    console.log('电视播放:', res);
                    if (res && res.result == "SUCCESS") {
                        CUES.tip({"msg": "推送成功", "type": "success"});
                    } else {
                        CUES.tip({"msg": "推送失败", "type": "warning"});
                    }
                });
                $scope.chooseshow = false;
                $scope.addhis();
            };
            $scope.body = function () {
                $("body").on("touchmove", function (event) {
                    event.preventDefault;
                }, false)
            }
            // 添加播放历史记录并回调
            $scope.addhis = function (backurl) {
                if (!$scope.detial) {
                    return false;
                }
                var urlhis = URLS.ajaxurl + 'user/history/save.json?openId=' + $cookieStore.get('openid') + '&token=' + $scope.token + '&kankeId=' + $scope.sc.kankeId + '&vodId=' + $scope.sc.vodId + '&drama=' + $scope.drama;
                $http.post(urlhis, {}).success(function (e) {
                    console.log('成功添加历史', e)
                    if (backurl) {
                        window.location.href = backurl
                    }
                    ;
                }).error(function () {
                    if (backurl) {
                        window.location.href = backurl
                    }
                    ;
                });
            };

            $scope.showjj = 'tv'; // 预设剧集想选卡
            if ($scope.sc.isMatch == '3') {
                $scope.showjj = 'mb';
                $scope.ctvmb = "onlymb";
            } else if ($scope.sc.isMatch == '-2') {
                $scope.showjj = 'tv';
                $scope.ctvmb = "onlytv";
            }
            if (!$cookieStore.get('tvtishi') && (($scope.sc.columnType == 'film') && ($scope.sc.isMatch == 1 || $scope.sc.isMatch == -2))) {
                $scope.tvtishi = true;
                $cookieStore.put('tvtishi', true);
            }
            // 切换选项卡
            $scope.changepagetab = function (v) {
                if (v == 'tv') {
                    $scope.updaterecords = $scope.tvrecords;
                } else if (v == 'mb') {
                    $scope.updaterecords = $scope.mobilerecords;
                }
                if ($scope.sc.isMatch == '1') {
                    $scope.showjj = v;
                }
                ;
            };
            //电视推送提示框
            $scope.tvtip = function () {
                $scope.tvtishi = false;
                $("body").off("touchmove");
            }

            //设置临时参数
            $scope.pageobj = {
                "tvtotal": [],
                "mbtotal": [],
                "index_tv": 0,
                "index_mb": 0,
                "darma_tv": [],
                "darma_mb": [],
                "sindex": 0,
                "key_en": '',
                "pageSize": '',
            };
            if ($scope.sc.columnType == 'documentary' || $scope.sc.columnType == 'arts') {
                $scope.pageobj.pageSize = 5;
            } else {
                $scope.pageobj.pageSize = 20;
            }

            // 获取电视剧集
            $scope.getdm_tv = function (pageNo) {
                // pageNo 页码
                $scope.sc.vodId = $scope.sc.vodId ? $scope.sc.vodId : $scope.detial.videoId;
                $scope.pageobj.index_tv = pageNo - 1; // 高亮剧集区间
                var tvurl = URLS.ajaxurl + 'vod/vodDrama.json?openId=' + $scope.openid + '&pageSize=' + $scope.pageobj.pageSize + '&pageNo=' + pageNo + '&vodId=' + $scope.sc.vodId;
                $http.post(tvurl, {}).success(function (e) {
                    console.log('电视剧集', e.response);
                    if (e && e.response.responseHeader && e.response.responseHeader.code == 200) {
                        $scope.tvrecords = e.response.responseBody.totalrecords;
                        if ($scope.showjj == 'tv') {
                            $scope.updaterecords = $scope.tvrecords;
                        } else if ($scope.showjj == 'mb') {
                            $scope.updaterecords = $scope.mobilerecords;
                        }
                        $scope.newarr(e.response.responseBody.totalPage, 'tvtotal', $scope.pageobj.pageSize);
                        $scope.pageobj.darma_tv = e.response.responseBody.list;
                        if (!$cookieStore.get('tvtishi') && ($scope.sc.columnType != 'film' && ($scope.sc.isMatch == 1 || $scope.sc.isMatch == -2) && $scope.pageobj.darma_tv.length > 0)) {
                            $scope.tvtishi = true;
                            $scope.body();
                            $cookieStore.put('tvtishi', true);
                        }
                    } else {
                        $scope.pageobj.darma_tv = [];
                    }
                }).error(function () {
                    $scope.pageobj.darma_tv = [];
                });
            };

            // 生成分页数组
            $scope.newarr = function (num, type, p) {
                var len = parseInt(num),
                    arr = [];
                for (var i = 0; i < len; i++) {
                    var obj = {};
                    obj.part = (i * p + 1) + '-' + ((i + 1) * p);
                    arr.push(obj);
                }
                ;
                $scope.pageobj[type] = arr;
            };

            // 来源切换
            $scope.gesoursepage = function (v, index) {
                $scope.pageobj.sindex = index;
                console.log(v)
                $scope.pageobj.key_en = v;
                $scope.getdm_mb(1);
            };

            // 获取手机剧集
            $scope.getdm_mb = function (pageNo) {
                $scope.pageobj.index_mb = pageNo - 1;
                var dmurl = URLS.ajaxurl + 'vod/mobileDrama.json?openId=' + $scope.openid + '&pageSize=' + $scope.pageobj.pageSize + '&pageNo=' + pageNo + '&videoType=' + $scope.sc.columnType + '&id=' + $scope.sc.kankeId.split('_')[1] + '&keyEn=' + $scope.pageobj.key_en;
                $http.post(dmurl, {}).success(function (e) {
                    console.log('手机剧集', e.response);
                    if (e && e.response.responseHeader && e.response.responseHeader.code == 200) {
                        $scope.newarr(e.response.responseBody.totalPage, 'mbtotal', $scope.pageobj.pageSize);
                        $scope.mobilerecords = e.response.responseBody.totalrecords;
                        if ($scope.showjj == 'tv') {
                            $scope.updaterecords = $scope.tvrecords;
                        } else if ($scope.showjj == 'mb') {
                            $scope.updaterecords = $scope.mobilerecords;
                        }
                        $scope.pageobj.darma_mb = e.response.responseBody.list;
                    }
                });
            };

            // 获取电视播放的剧集信息并推送
            $scope.playjson_tv = function (v) {
                $scope.activejson = $scope.pageobj.darma_tv[v];
                $scope.activejson.vp = v + 1 + $scope.pageobj.index_tv * $scope.pageobj.pageSize;
                $scope.playtv();
            };

            //获取手机剧集链接并跳转
            $scope.playlink = function (v) {
                console.log(v)
                $scope.activejson = v;
                $scope.playmb();
            };
        }})
}]);







    

app.controller('indexCtrl', ['$scope','$location','$http','$cookieStore','$cookies','$timeout','URLS','$rootScope', function($scope, $location,$http,$cookieStore,$cookies,$timeout,URLS,$rootScope) {
    $rootScope.$watch('init',function(newValue,oldValue){
        if(newValue){
            // $rootScope.roload=false;
         $scope.net=false;
        if(window.navigator.onLine==true) {
            $scope.net=true;
        }else {
            $scope.net=false;
        }
           
    $scope.$on('rbanner',function(){
    	new swiper(
            {
                "elm":document.getElementById('J_banner')
            }
        );
    });

            $http.get(URLS.ajaxurl + 'vod/getHomes.json?openId='+$cookieStore.get('openid')+'&type=tj&v='+(new Date()).getTime(),{}).success(function(res){
                console.log('首页推荐',res);
                $scope.result = res.response.responseBody;
                // $rootScope.roload=true;
            });
            if(_wxshare_on) {
                //微信分享
                var urltem = window.location.href;
                wxshare.weixinshare_("河北IPTV",  "http://m.hebiptv.com/hbiptv-weixin/images/logo.jpg", "【微信电视，让微信成为电视遥控器】", urltem);
            }
        }
    })


    
}]);

app.controller('fenleiCtrl', ['$scope','$location','$http','$cookieStore','$timeout','URLS','$rootScope', function($scope, $location,$http,$cookieStore,$timeout,URLS,$rootScope) {
    $rootScope.$watch('init',function(newValue,oldValue){
        if(newValue) {
            $http.get(URLS.ajaxurl + 'vod/secondType.json?openId=' + $cookieStore.get('openid') + '&v=' + (new Date()).getTime(), {}).success(function (res) {
                console.log('分类', res);
                if (res && res.response.responseHeader && res.response.responseHeader.code == 200) {
                    $scope.list = res.response.responseBody;
                }
            });
            $http.post(URLS.ajaxurl + 'epg/t_liveCate.json?openId=' + $cookieStore.get('openid') + '&typeIds=', {}).success(function (res) {
                // console.log('所有频道：', res.response.responseBody.list);
                $scope.zblist = res.response.responseBody.list;
                /* $scope.tindex = 0;
                 $scope.list = [];
                 $scope.changecn($scope.zblist[0],0);*/
            });
            $scope.fencook = function (eq) {
                $cookieStore.put('zbindex', eq);
                window.location.href = "#/zhibo/index";
            }
        }})
}]);




app.controller('remoteCtrl', ['$scope','$location','$http','$cookieStore','$cookies','$timeout','URLS','$rootScope', function($scope, $location,$http,$cookieStore,$cookies,$timeout,URLS,$rootScope) {
    $rootScope.$watch('init',function(newValue,oldValue){
        if(newValue) {
            var wh = window.innerHeight,
                bh = $('#J_remote').height();
            if (bh - wh < 0) {
                $('#J_remote').css('min-height', wh);
            }
            ;


            document.body.addEventListener('touchstart', function (event) {
            });

            $scope.pop = {};

            $scope.shownumber = function () {
                $scope.pop.number = true;
                $scope.pop.box = true;
            };
            $scope.closepop = function () {
                $scope.pop = {};
            };

            $scope.code = getUrlParam('code');
            // $scope.code = "0014aIrB0g37dd245XoB0gpMrB04aIr1";
            // 获取用户信息并储存
            if ($scope.code != null && $scope.code != "null" && $scope.code != undefined && $scope.code != '' && !$cookies.token) {
                $http.post(URLS.baseurl + 'wxtv/init?code=' + $scope.code, {}).success(function (e) {
                    console.log('user', e)
                    if (e.code == 0) {
                        var dt = e.data;
                        $cookieStore.put('openid', dt.openId);
                        $cookieStore.put('headimgurl', dt.headimgurl);
                        $cookieStore.put('nickname', dt.nickname);
                        $cookieStore.put('token', dt.token);
                        // 获取boxId
                        $http.post(URLS.ajaxurl + 'user/bind.json?key=' + dt.openId + '&type=1', {}).success(function (e) {
                            console.log('boxid', e)
                            if (e && e.response.responseHeader.code == "200" && e.response.responseBody != "null" && e.response.responseBody != undefined && e.response.responseBody != "") {
                                $cookieStore.put("boxId", e.response.responseBody);
                            }
                        });
                    }
                });
            } else {
                $scope.boxId = $cookieStore.get('boxId');
            }
            ;

            // 发送code码
            $scope.sentcode = function (v) {
                if (!$scope.boxId) {
                    return false;
                }
                ;
                $http.get(URLS.ctrl + 'control?openId=' + $cookieStore.get('openid') + '&keyCode=' + v + '&boxId=' + $scope.boxId, {}).success(function (res) {
                    console.log("code码发送状态", res);
                });
            };
            if (_wxshare_on) {
                //微信分享
                var urltem = window.location.href;
                wxshare.weixinshare_("遥控器", "http://www.kanketv.com/IMG/Home/Logo_b0.png", "【微信电视，让微信成为电视遥控器】", urltem);
            }
        }})
}]);



app.controller('searchCtrl', ['$scope','$location','$http','$cookieStore','$timeout','URLS','$rootScope', function($scope, $location,$http,$cookieStore,$timeout,URLS,$rootScope) {
    $rootScope.$watch('init',function(newValue,oldValue){
        if(newValue) {
            $http.post(URLS.ajaxurl + 'vod/hotsearchword.json?openId=' + $cookieStore.get('openid') + '&size=10', {}).success(function (res) {
                console.log('搜索热词', res.response);
                if (res && res.response.responseHeader && res.response.responseHeader.code == 200) {
                    $scope.hotlist = res.response.responseBody;
                    $scope.hotlist_f = $scope.hotlist.splice(0, 5);
                    $scope.hotlist_e = $scope.hotlist;
                }
            });
            // $('#search_show').css({'height': window.innerHeight - 0.9 * window.rem});

            $scope.hiskey = $cookieStore.get('hiskey') || []; // 搜索历史记录
            $scope.list = [];
            $scope.isresult = false; // 页面切换变量
            $scope.loadtext = "正在玩命加载···";

            $scope.lazy = new lazyload({ // 预定于懒加载
                'class': '.lazy',
                'elm': '#J_list',
                'outbot': 100
            });

            $scope.bs = new botscroll(100); // 滚动事件
            $scope.datadone = false;

            $scope.$on('lazy', function (ngRepeatFinishedEvent) {
                $scope.lazy.setlazy($('.lazy'));
                $scope.bs.setmax($('#html').height());
                if (!$scope.datadone) {
                    $scope.bs.isoff = false;
                }
            });
            // 搜索关键词
            $scope.search = function (key) {
                $scope.textlist = [];
                if (key) {
                    $scope.key = key;
                    $scope.textlist = [];
                }
                if (!$scope.key || $scope.key.length == 0) {
                    CUES.tip({"msg": "请输入关键词", "type": "danger"});
                    return false;
                }
                ;
                $scope.list = [];
                $scope.setkey($scope.key);
                $scope.sdata.key = $scope.key;
                $scope.sdata.pageNo = 1;
                $scope.getAjax();
                $scope.isresult = true;
            };

            // 记录关键词
            $scope.setkey = function (v) {
                if (!$scope.isinhis(v)) {
                    var arr = [v];
                    $scope.hiskey = arr.concat($scope.hiskey).splice(0, 6);
                    $cookieStore.put('hiskey', $scope.hiskey);
                }
                ;

            };

            // 判断是否已在历史记录
            $scope.isinhis = function (v) {
                var is = false, dt = $scope.hiskey, len = dt.length;
                for (var i = 0; i < len; i++) {
                    if (dt[i] == v) {
                        is = true;
                    }
                }
                ;
                return is;
            };
            // 清除历史记录
            $scope.clearhis = function () {
                $scope.hiskey = [];
                $cookieStore.put('hiskey', $scope.hiskey);
            };

            // 设置关键字并搜索
            $scope.selectkey = function (key) {
                $scope.list = [];
                $scope.key = key;
                $scope.sdata.key = $scope.key;
                $scope.sdata.pageNo = 1;
                $scope.recomFlag = false;
                $scope.getAjax();
                $scope.isresult = true;
                $scope.keyempty = true;
            };

            // 检测关键字
            $scope.keylen = function (v) {
                if (!v || v.length == 0) {
                    $scope.isresult = false;
                    $scope.keyempty = false;
                } else {
                    $scope.keyempty = true;
                }
                $http.post(URLS.ajaxurl + 'vod/searchword.json?openId=' + $cookieStore.get('openid') + '&pageNo=1&pageSize=10&key=' + $scope.key.replace(/\s/ig, ''), {}).success(function (res) {
                    console.log($scope.keyword + '联想结果：', res);
                    $scope.textlist = res.response.responseBody;
                });
            }

            //清除关键字
            $scope.search_clear = function () {
                $scope.isresult = false;
                $scope.key = '';
                $scope.keyempty = false;
                $scope.textlist = [];
            }
            $scope.sdata = { // 预设搜索参数
                "pageNo": 1,
                "pageSize": 10,
                "columnType": "",
                "key": "",
                "openId": $cookieStore.get('openid')
            };
            $scope.recomFlag = false;
            $scope.recommend = function () {
                $http.post(URLS.ajaxurl + 'vod/hotsearchword.json?openId=' + $cookieStore.get('openid') + '&size=15', {}).success(function (res) {
                    console.log('搜索热词_推荐', res.response);
                    if (res && res.response.responseHeader && res.response.responseHeader.code == 200) {
                        $scope.recommendlist = res.response.responseBody;
                    }
                });
            }
            // 搜索
            $scope.getAjax = function () {
                $scope.loadtext = "正在玩命加载···";
                var senturl = URLS.ajaxurl + 'vod/search.json',
                    transform = function (data) {
                        return $.param(data);
                    };

                $http.post(senturl, $scope.sdata, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                    transformRequest: transform
                }).success(function (res) {
                    console.log('搜索结果', res.response);
                    if (res && res.response.responseHeader && res.response.responseHeader.code == 200) {
                        var resls = res.response.responseBody.list;
                        $scope.list = $scope.list.concat(resls);
                        if (resls.length < 10) {
                            $scope.datadone = true;
                            if (resls.length == 0) {
                                $scope.loadtext = '';
                                $scope.recomFlag = true;
                                $scope.recommend();
                            } else {
                                $scope.loadtext = '已加载全部数据';
                            }
                        }
                    } else {
                        $scope.loadtext = '数据加载出现错误';
                    }
                }).error(function () {
                    $scope.loadtext = '数据加载出现错误';
                });
            };
            $scope.token = $cookieStore.get('token');
            // 添加播放历史记录并回调
            $scope.addhis = function (v, backurl) {
                if (!v) {
                    return false;
                }
                var urlhis = URLS.ajaxurl + 'user/history/save.json?openId=' + $cookieStore.get('openid') + '&token=' + $scope.token + '&kankeId=' + v.kankeId + '&vodId=' + v.vodId;
                $http.post(urlhis, {}).success(function (e) {
                    console.log('成功添加历史', e)
                    if (backurl) {
                        window.location.href = backurl
                    }
                    ;
                }).error(function () {
                    if (backurl) {
                        window.location.href = backurl
                    }
                    ;
                });
            };

            //获取节目详情
            $scope.getdetaildata = function (kankeId, vodId) {
                var url = URLS.ajaxurl + 'vod/detail.json?openId=' + $cookieStore.get('openid') + '&kankeId=' + kankeId + '&vodId=' + vodId;
                $http.get(url, {}).success(function (e) { // get 修改为post
                    console.log('节目详情', e.response);
                    if (!e && !e.response || !e.response.responseBody) {
                        return false;
                    }
                    ;

                    if (e.response.responseBody.details.length) {
                        var url = e.response.responseBody.details[0].link;
                        $scope.addhis(url);
                        window.location.href = url;
                    } else {
                        CUES.tip({"msg": "暂无手机剧集", "type": "danger"});
                    }

                });
            };
            // 电视推送并添加历史记录
            $scope.playtv = function (vv, v) {
                if (!$cookieStore.get("boxId")) {
                    $scope.tips = true;
                    return false;
                }
                var urlpv = URLS.ctrl;
                if (vv.videoType == "film") {
                    urlpv += 'playVideo.json?openId=' + $cookieStore.get('openid') + '&boxId=' + $cookieStore.get("boxId") + '&mediaType=video&code=' + $scope.activejson.code + '&title=' + vv.name;
                } else {
                    if ($scope.activejson.code == undefined || $scope.activejson.code == "") {
                        urlpv += 'playVideo.json?openId=' + $cookieStore.get('openid') + '&boxId=' + $cookieStore.get("boxId") + '&mediaType=video&code=' + $scope.activejson.programCode + '&title=' + vv.name;
                    } else {
                        urlpv += 'playVideo.json?openId=' + $cookieStore.get('openid') + '&boxId=' + $cookieStore.get("boxId") + '&code=' + $scope.activejson.programCode + '&mediaType=series&seriesCode=' + $scope.activejson.code + '&title=' + vv.name;
                    }
                }
                console.log('推送播放串：', $scope.activejson);
                $http.post(urlpv, {}).success(function (res) {
                    console.log('电视播放:', res);
                    if (res && res.result == "SUCCESS") {
                        CUES.tip({"msg": "推送成功", "type": "success"});
                    } else {
                        CUES.tip({"msg": "推送失败", "type": "warning"});
                    }
                });
                $scope.addhis(v);
            };
            //绑定提示框
            $scope.tips = false;
            $scope.stopBubble = function ($event) {
                $event.stopPropagation()
            }
            $scope.resetstate = function () {
                $scope.tips = false;
            }
            // 获取电视播放的剧集信息并推送
            $scope.playjson_tv = function (vv, v) {
                if (!$cookieStore.get("boxId")) {
                    $scope.tips = true;
                    return false;
                }
                $scope.activejson = vv;
                $scope.activejson.vp = vv.key;
                $scope.playtv(vv, v);
            };
            // 滚动底部加载
            $scope.bs.getbot = function () {
                $scope.sdata.pageNo++;
                $scope.bs.isoff = true;
                $scope.getAjax();
            };

            $scope.$on("$destroy", function () {
                $scope.bs.isoff = true;
            });
        }})

}]);








app.controller('stardetialCtrl', ['$scope','$location','$http','$cookieStore','$timeout','URLS','$rootScope', function($scope, $location,$http,$cookieStore,$timeout,URLS,$rootScope) {
    $rootScope.$watch('init',function(newValue,oldValue){
        if(newValue) {
            $scope.sc = GetRequest();

            // 明星详情
            var starurl = URLS.recommend + 'star/profiles.json?openId=' + $cookieStore.get('openid') + '&id=' + $scope.sc.id;
            // var starurl = '/hebei/api/stardetial.json';
            $scope.isshot = true;
            $http.get(starurl, {}).success(function (e) {
                console.log('明星详情', e);
                if (e && e.responseHeader.code == 200) {
                    $scope.detial = e.responseBody;
                    $scope.intro = $scope.detial.introduction.substr(0, 100) + '···';
                    $scope.getreco();
                    if (_wxshare_on) {
                        //微信分享
                        var urltem = window.location.href;
                        wxshare.weixinshare_($scope.detial.actorName, $scope.detial.localImageSmall + '!m180x180.jpg', $scope.detial.introduction.substr(0, 26) + '···', urltem);
                        // wxshare.weixinshare_($scope.sc.channelName, $scope.sharedata.icon2 + '!m180x180.jpg', "【微信电视，让微信成为电视遥控器】", urltem);
                    }

                }
            });

            $scope.getintro = function () {
                if ($scope.isshot) {
                    $scope.intro = $scope.detial.introduction;
                    $scope.isshot = false;
                } else {
                    $scope.isshot = true;
                    $scope.intro = $scope.detial.introduction.substr(0, 100) + '···'
                }
            };

            // 作品推荐
            $scope.getreco = function () {
                var starurl = URLS.recommend + 'people/related.json?openId=' + $cookieStore.get('openid') + '&id=' + $scope.detial.id + '&columnType=all&pageNo=1&pageSize=6';
                // var starurl = '/hebei/api/starreco.json';
                $http.get(starurl, {}).success(function (e) {
                    console.log('作品推荐', e);
                    if (e && e.responseHeader.code == 200) {
                        $scope.list = e.responseBody;
                        $scope.islist = true;
                    }
                });
            };

        }})
}]);





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





app.controller('zhiboCtrl', ['$scope','$location','$http','$cookieStore','$timeout','URLS','$rootScope', function($scope, $location,$http,$cookieStore,$timeout,URLS,$rootScope) {
    $rootScope.$watch('init',function(newValue,oldValue){
        if(newValue) {
            $scope.net = false;
            if (window.navigator.onLine == true) {
                $scope.net = true;
            } else {
                $scope.net = false;
            }
            $scope.openid = $cookieStore.get('openid');
            $http.get(URLS.ajaxurl + 'vod/getHomes.json?openId=' + $scope.openid + '&type=zb&v=' + (new Date()).getTime(), {}).success(function (res) {
                // console.log('poster',res);
                $scope.poster = res.response.responseBody.poster;
            });

            $scope.$on('rbanner', function () {
                new swiper({"elm": document.getElementById('J_banner')});
            });
            $scope.sc = GetRequest();
            $http.post(URLS.ajaxurl + 'epg/t_liveCate.json?openId=' + $scope.openid + '&typeIds=', {}).success(function (res) {
                // console.log('所有频道：', res.response.responseBody.list);
                $scope.zblist = res.response.responseBody.list;
                if ($cookieStore.get('zbindex')) {
                    $scope.tindex = $cookieStore.get('zbindex');
                    $scope.scroll = true;
                } else {
                    $scope.scroll = false;
                    $scope.tindex = 0;
                }
                $scope.list = [];
                $scope.changecn($scope.zblist[$scope.tindex], $scope.tindex, $scope.scroll);
            });

            $scope.lazy = new lazyload({
                'class': '.lazy',
                'elm': '#J_list',
                'outbot': 100
            });

            $scope.$on('lazy', function (ngRepeatFinishedEvent) {
                $scope.lazy.setlazy($('.lazy'));
                if (!$scope.list.length) {
                    $scope.loadtext = "暂无数据";
                } else {
                    $scope.loadtext = "已加载全部数据";
                }
            });

            $scope.changecn = function (v, index, flag) {
                if (flag) {
                    $scope.scroll = true;
                } else {
                    $scope.scroll = false;
                }
                $scope.tindex = index;
                $cookieStore.put('zbindex', $scope.tindex);
                // console.log(v.channels)
                var list = v.channels, len = list.length;
                for (i = 0; i < len; i++) {
                    var epgs = list[i].epgs, elen = epgs.length;
                    if (elen > 2) {
                        epgs.splice(2);
                    }
                    ;
                }
                ;

                $scope.list = list;
                if (!$scope.list.length) {
                    $scope.loadtext = "暂无数据";
                }


            };
            var f = false;
            var timer = null;
            $(document).scroll(function () {
                clearTimeout(timer);
                timer = setTimeout(function () {
                    var scrollTop = $(window).scrollTop();
                    var scrolllen = 1.42 * window.rem;
                    if ((scrollTop >= scrolllen) && f) {
                        $('.typelstable').css({'position': 'fixed', 'top': '0.36rem', 'z-index': 999, 'width': '100%'});
                        $('#hcheng').show();
                        f = false;
                    } else if ((scrollTop < scrolllen) && !f) {
                        $('#hcheng').hide();
                        $('.typelstable').css({'position': 'static'});
                        f = true;
                    }
                }, 1)
            })
            $scope.$on('jmtab', function (ngRepeatFinishedEvent) {
                if ($scope.scroll) {
                    $('.typelstable').scrollLeft($('.typelstable .active').offset().left - 150);
                    $scope.scroll = false;
                }
            });
            $scope.$on("$destroy", function () {
                $(window).unbind('scroll');
            });
        }})
}]);
app.controller('zhibohotCtrl', ['$scope','$location','$http','$cookieStore','$timeout','URLS','$rootScope', function($scope, $location,$http,$cookieStore,$timeout,URLS,$rootScope) {
    $rootScope.$watch('init',function(newValue,oldValue){
        if(newValue) {
            $scope.typels = [
                {"name": "电视剧", "type": "T", "typename": "tv"},
                {"name": "综艺", "type": "E", "typename": "arts"},
                {"name": "电影", "type": "F", "typename": "film"},
                {"name": "动漫", "type": "C", "typename": "anime"},
                {"name": "纪录片", "type": "D", "typename": "documentary"}
            ];

            $scope.data = {
                "pageSize": 10,
                "pageNo": 1,
                "type": ""
            };
            $scope.bs = new botscroll(100); // 滚动事件

            $scope.datadone = false;
            $scope.list = [];
            $scope.getAjax = function () {
                $http.post(URLS.ajaxurl + 'hotepg/mixed.json?openId=' + $cookieStore.get('openid') + '&type=' + $scope.data.type + '&pageNo=' + $scope.data.pageNo + '&pageSize=10', {}).success(function (res) {
                    console.log('当前热播:' + $scope.data.type, res.response)

                    if (res && res.response.responseHeader && res.response.responseHeader.code == 200) {
                        $scope.list = $scope.list.concat(res.response.responseBody.list);
                        if (res.response.responseBody.list.length < 10) {
                            $scope.datadone = true;
                            $scope.loadtext = '已加载全部数据';
                        } else {
                            $scope.datadone = false;
                            $scope.loadtext = '正在玩命加载···';
                        }
                        ;
                    } else {
                        $scope.datadone = true;
                        $scope.loadtext = '数据加载错误';
                    }
                });
            }

            // 滚动底部加载
            $scope.bs.getbot = function () {
                if ($scope.datadone) {
                    return false;
                }
                $scope.data.pageNo++;
                $scope.bs.isoff = true;
                $scope.getAjax();
                console.log($scope.data.pageNo)
            };

            $scope.changetype = function (v, index) {
                $scope.tindex = index;
                $scope.list = [];
                $scope.data.pageNo = 1;
                $scope.data.type = v.typename;
                $scope.getAjax();
            };

            $scope.lazy = new lazyload({
                'class': '.lazy',
                'elm': '#J_list',
                'outbot': 100
            });

            $scope.changetype($scope.typels[0], 0);

            $scope.$on('lazy', function (ngRepeatFinishedEvent) {
                $scope.lazy.setlazy($('.lazy'));

                $scope.bs.setmax($('#html').height());

                if (!$scope.datadone) {
                    $scope.bs.isoff = false;
                }

            });

            $scope.$on("$destroy", function () {
                $scope.bs.isoff = true;
            });
        }})
}]);

app.controller('zhibodetialCtrl', ['$scope','$location','$http','$cookieStore','$cookies','$timeout','URLS','$rootScope', function($scope, $location,$http,$cookieStore,$cookies,$timeout,URLS,$rootScope) {
    $rootScope.$watch('init',function(newValue,oldValue){
        if(newValue) {
            $scope.sc = GetRequest();
            // console.log('参数',$scope.sc);

            // $scope.udata = $cookieStore.get('udata');
            // console.log('user ',$scope.udata)

            $scope.J_jmlist = $('#J_jmlist');

            //电视推送提示框
            $scope.tvtip = function () {
                $scope.tvtishi = false;
                $("body").off("touchmove");
            }
            //获取播放链接
           var zhibourl;
            if($scope.sc.channelId == 901) {
                zhibourl='cctv1';
            } else if($scope.sc.channelId == 902) {
                zhibourl='cctv2';
            } else if($scope.sc.channelId == 3) {
                zhibourl='cctv3';
            } else if($scope.sc.channelId == 904) {
                zhibourl='cctv4';
            } else if($scope.sc.channelId == 905) {
                zhibourl='cctv5p';
            } else if($scope.sc.channelId == 5) {
                zhibourl='cctv5';
            } else if($scope.sc.channelId == 6) {
                zhibourl='cctv6';
            }else if($scope.sc.channelId == 907) {
                zhibourl='cctv7';
            }else if($scope.sc.channelId == 8) {
                zhibourl='cctv8';
            }
            $scope.zhiboUrl = 'http://wtv.hebiptv.com/wechatlive/' + zhibourl + '/playlist.m3u8';
                console.log($scope.zhiboUrl)
            document.getElementById('J_video').setAttribute('src', $scope.zhiboUrl);

            /* var channel = "";
             var classname = "";
             if($scope.sc.channelId == 901) {
             channel = 'pa://cctv_p2p_hdcctv1';
             classname = "cctv";
             } else if($scope.sc.channelId == 902) {
             channel = 'pa://cctv_p2p_hdcctv2';
             classname = "cctv";
             } else if($scope.sc.channelId == 3) {
             channel = 'pa://cctv_p2p_hdcctv3';
             classname = "cctv";
             } else if($scope.sc.channelId == 904) {
             channel = 'pa://cctv_p2p_hdcctv4';
             classname = "cctv";
             } else if($scope.sc.channelId == 905) {
             channel = 'pa://cctv_p2p_hdcctv5';
             classname = "cctv";
             } else if($scope.sc.channelId == 5) {
             channel = 'pa://cctv_p2p_hdcctv5';
             classname = "cctv";
             } else if($scope.sc.channelId == 101) {
             channel = 'pa://cctv_p2p_hdhebei';
             classname = "cctv";
             }*/

            /*$http.get(URLS.tran + 'http://play.kanketv.com/playerCode2.0/live/api?appKey=34DB874AF269B539&appScrect=40&channel=' + channel + '&classname=cctv', {}).success(function(e) {
             console.log('播放链接', e.playurl);
             document.getElementById('J_video').setAttribute('src', e.playurl);
             $scope.zhiboUrl=e.playurl;
             });*/

            $scope.code = getUrlParam('code');
            $scope.tvtui = true;
            $scope.body = function () {
                $("body").on("touchmove", function (event) {
                    event.preventDefault;
                }, false)
            }

            if (!$cookieStore.get('tvtishi') && $scope.tvtui) {
                $scope.tvtishi = true;
                $scope.body();
                $cookieStore.put('tvtishi', true);
            }
            // $scope.code = "0014aIrB0g37dd245XoB0gpMrB04aIr1";
            // 获取用户信息并储存
            if ($scope.code != null && $scope.code != "null" && $scope.code != undefined && $scope.code != '' && !$cookies.token) {
                $http.post(URLS.baseurl + 'wxtv/init?code=' + $scope.code, {}).success(function (e) {
                    console.log('user', e)
                    if (e.code == 0) {
                        var dt = e.data;
                        $cookieStore.put('openid', dt.openId);
                        $cookieStore.put('headimgurl', dt.headimgurl);
                        $cookieStore.put('nickname', dt.nickname);
                        $cookieStore.put('token', dt.token);
                        $scope.token = dt.token;
                        $scope.nickname = dt.nickname;
                        $scope.headimg = dt.headimgurl;
                        $scope.openid = dt.openId;

                        // 获取boxId
                        $http.post(URLS.ajaxurl + 'user/bind.json?key=' + dt.openId + '&type=1', {}).success(function (e) {
                            console.log('boxid', e)
                            if (e && e.response.responseHeader.code == "200" && e.response.responseBody != "null" && e.response.responseBody != undefined && e.response.responseBody != "") {
                                $cookieStore.put("boxId", e.response.responseBody);
                            }
                        });
                    }
                });
            } else {
                $scope.token = $cookieStore.get('token');
                $scope.nickname = $cookieStore.get('nickname');
                $scope.headimg = $cookieStore.get('headimgurl');
                $scope.openid = $cookieStore.get('openid');
            }
            ;
            $scope.openid = $cookieStore.get('openid');
            //openId='+$cookieStore.get('openid')+'&
            $scope.loadtext = "正在玩命加载中...";
          /*  $http.post(URLS.ajaxurl + 'epg/t_playLive.json?openId=' + $scope.openid + '&channelId=' + $scope.sc.channelId + '&&openId=' + $scope.openid, {}).success(function (e) {
                console.log('播放链接', e.response);
                if (e.response.responseHeader.code == '200') {
                    var list = e.response.responseBody.list;
                    $scope.zhiboUrl = 'http://live.kanketv.com/wechat_live/hebei' + $scope.sc.channelId + '/desc.m3u8?tm=' + list[0].tm + '&sign=' + list[0].sign;
                    console.log($scope.zhiboUrl)
                    document.getElementById('J_video').setAttribute('src', $scope.zhiboUrl);
                }

            })*/
            $scope.tvtui = true;
            var wh = window.innerHeight,
                boxh = window.rem * 1.13,
                videoh = $('.video').outerHeight();
            $scope.boxh = {"height": (wh - boxh - videoh) + 'px'};
            $scope.emptyJm = {
                "width": "100%",
                "height": "100%",
                "text-align": "center",
                "color": "#aaa",
                "line-height": (wh - boxh) + 'px'
            };

            var data = new Date(),
                charr = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
                egarr = ['mon', 'tue', 'wed', 'thr', 'fri', 'sat', 'sun'],
                day = data.getDay(),
                days = [];

            $scope.dates = data.getFullYear() + '-' + (data.getMonth() + 1 < 10 ? ('0' + (data.getMonth() + 1)) : (data.getMonth() + 1)) + '-' + (data.getDate() >= 10 ? data.getDate() : ('0' + data.getDate()));

            $scope.dact = egarr[day];

            data.setDate(data.getDate() - 3);
            for (var i = 0; i < 7; i++) {
                data.setDate(data.getDate() + 1);
                var obj = {}, wd = data.getDay(), y = data.getFullYear(), m = data.getMonth() + 1, d = data.getDate();
                obj.egn = egarr[wd];
                obj.chn = charr[wd];
                if (i == 2) {
                    obj.chn = "今天";
                }
                obj.ts = y + '-' + (m < 10 ? ('0' + m) : m) + '-' + (d >= 10 ? d : ('0' + d));
                days.push(obj);
            }
            ;
            $scope.days = days;

            $scope.changeday = function (v) {
                if (v.ts == $scope.days[2].ts) {
                    $scope.tvtui = true;
                } else {
                    $scope.tvtui = false;
                }
                $scope.dateback = v.ts;
                $scope.goeq = 0;
                $scope.dact = v.egn;
                var jmurl = URLS.ajaxurl + 'epg/epgLive.json?openId=' + $scope.openid + '&channelId=' + $scope.sc.channelId + '&date=' + v.ts;
                $http.post(jmurl, {}).success(function (e) {
                    console.log('节目单', e.response)
                    if (!e.response.responseBody || !e.response.responseBody.list) {
                        return false;
                    }
                    $scope.sharedata = e.response.responseBody.list[0];
                    var jmlist = e.response.responseBody.list;
                    len = jmlist.length,
                        t = new Date(),
                        tm = t.getTime(),
                        tstr = v.ts.replace(/-/ig, '/');
                    if (e.response.responseBody.list.length) {
                        $scope.loadtext = "";
                    } else {
                        $scope.loadtext = "暂无节目单";
                    }
                    for (var i = 0; i < len; i++) {
                        var dt = jmlist[i],
                            nt = new Date(tstr + ' ' + dt.startTime).getTime(),
                            et = new Date(tstr + ' ' + dt.endTime).getTime();
                        if (tm < nt) {
                            dt.timestate = 1;
                        } else if (tm > et) {
                            dt.timestate = -1;
                        } else {
                            dt.timestate = 0;
                            $scope.goeq = i;
                            $scope.zhibojson = dt;
                            $scope.activejson = dt;
                        }
                        ;
                    }
                    ;
                    $scope.jmlist = jmlist;
                    var data = $scope.jmlist;
                    var orderlistUrl = URLS.ajaxurl + "user/userReserveInfo.json?openId=" + $scope.openid;
                    $http.post(orderlistUrl, {}).success(function (res) {
                        console.log(res.response.responseBody);
                        if (res.response.responseBody) {
                            $scope.list = res.response.responseBody;
                            for (var i = 0; i < len; i++) {
                                var liveStartTime_i = v.ts + " " + data[i].startTime;
                                var liveEndTime_i = v.ts + " " + data[i].endTime;
                                var nt = new Date(tstr + ' ' + data[i].startTime).getTime();
                                if (t < nt) {
                                    if ($scope.list != undefined && $scope.list != '') {
                                        var orderInfo = 'liveStartTime=' + liveStartTime_i + '&liveEndTime=' + liveEndTime_i + '&channelId=' + $scope.sc.channelId;
                                        for (j = 0, lens = $scope.list.length; j < lens; j++) {
                                            var orderInfo_j = 'liveStartTime=' + $scope.list[j].liveStartTime + '&liveEndTime=' + $scope.list[j].liveEndTime + '&channelId=' + $scope.list[j].channelId;
                                            if (orderInfo_j == orderInfo) {
                                                console.log('已预约节目', orderInfo);
                                                data[i].timestate = 2;
                                            }
                                        }
                                    }

                                }
                            }
                        }
                    });
                    if (_wxshare_on) {
                        //微信分享
                        var urltem = window.location.href;
                        wxshare.weixinshare_($scope.sc.channelName, $scope.sharedata.icon2, "【微信电视，让微信成为电视遥控器】", urltem);
                        // wxshare.weixinshare_($scope.sc.channelName, $scope.sharedata.icon2 + '!m180x180.jpg', "【微信电视，让微信成为电视遥控器】", urltem);
                    }
                })
            };
            $scope.changeday($scope.days[2]);

            $scope.$on('goeq', function (ngRepeatFinishedEvent) {
                $scope.J_jmlist[0].scrollTop = ($scope.goeq - 3) * (0.29 * window.rem);
                // $scope.J_jmlist.find('.jmli').eq($scope.goeq).addClass('active');
            });

            //
            $scope.seeaction = function (v, eq) {
                if (v.timestate == 1) {
                    $scope.yuyue(v, eq);
                    $scope.tvtui = true;
                    $scope.activejson = $scope.zhibojson;
                } else if (v.timestate == -1) {
                    console.log('huikan');
                    $scope.huikan(v, eq);
                } else if (v.timestate == 0) {
                    console.log('zhibo')
                    $scope.activejson = v;
                    $scope.tvtui = true;
                    if ($scope.zhiboUrl) {
                        document.getElementById('J_video').setAttribute('src', $scope.zhiboUrl);
                        document.getElementById('J_video').play();
                    }
                    // $scope.zhibo(v,eq);
                } else if (v.timestate == 2) {
                    $scope.tvtui = true;
                    $scope.activejson = $scope.zhibojson;
                    CUES.tip({'msg': '请勿重复预约', 'type': 'warning'});
                }
            };

            // 预约
            $scope.yuyue = function (v, eq) {
                var liveStartTime = v.date + " " + v.startTime,
                    liveEndTime = v.date + " " + v.endTime,
                    orderUrl = encodeURI(URLS.ajaxurl + "user/reserveLive.json?openId=" + $scope.openid + "&liveStartTime=" + liveStartTime + "&liveEndTime=" + liveEndTime + "&channelId=" + $scope.sc.channelId + "&channelCode=" + $scope.sc.ChannelCode + "&channelNameZh=" + encodeURI(v.channelZh) + "&channelNameEn=" + v.channelKEn + "&programName=" + encodeURI(v.title) + "&isReserve=1&channelPicUrl=" + v.icon2 + "&kankeId=" + v.kankeId + "&vodId=" + v.vodId);

                $http.get(orderUrl, {}).success(function (e) {
                    console.log('预约节目', e.response);
                    if (e && e.response.responseHeader.code == 200) {
                        v.timestate = 2;
                        // $scope.J_jmlist.find('.jmli').eq(eq).addClass('active');
                        CUES.tip({'msg': '预约成功', 'type': 'success'});
                    } else {
                        CUES.tip({'msg': '预约失败', 'type': 'warning'});
                    }
                });
            };
            // http://test2.kanketv.com/hbiptv-weixin/ctrl/playBack.json?StartDate=20161118&StartTime=00:58:00&boxId=1111&channelNumber=209&code=00000001000000070000000031114555&title=
            //回看
            $scope.huikan = function (v, eq) {
                if (v.code) {
                    $scope.tvtui = true;
                } else {
                    $scope.tvtui = false;
                }
                $scope.activejson = v;
                var date = v.date.replace(/-/g, '');
                var startTime = v.startTime.replace(':', '') + '00';
                var endTime = v.endTime.replace(':', '') + '00';
                var videoUrl = $scope.zhiboUrl + "&startTime=" + date + startTime + "&endTime=" + date + endTime;

                document.getElementById('J_video').setAttribute('src', videoUrl);
                document.getElementById('J_video').play();
            };
            // 直播
            $scope.zhibo = function (v, eq) {
                if (v.timestate == 0) {
                    var senturl = URLS.ctrl + 'playLive.json',
                        data = {
                            "boxId": $cookieStore.get('boxId'),
                            "channelId": $scope.sc.channelId,
                            "openId": $scope.openid
                        };
                    var transform = function (data) {
                        return $.param(data);
                    };
                    $http.post(senturl, data, {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                        },
                        transformRequest: transform
                    }).success(function (res) {
                        console.log('直播电视播放:', res);
                        if (res && res.result == "SUCCESS") {
                            CUES.tip({'msg': '推送成功', 'type': 'success'});
                        } else {
                            CUES.tip({'msg': '推送失败', 'type': 'warning'});
                        }
                    });
                } else if (v.timestate == -1) {
                    var StartDate = $scope.dateback.replace('-', '').replace('-', '');
                    // var StartTime = v.startTime.replace(':','') + '00';
                    var back_url = URLS.ctrl + 'playBack.json?openId=' + $scope.openid + '&StartDate=' + StartDate + '&StartTime=' + v.backTime + '&boxId=' + $cookieStore.get('boxId') + '&channelNumber=' + v.channelId + '&code=' + v.code + '&find=0&title=' + v.title;
                    $http.post(back_url, {}).success(function (res) {
                        console.log('回看电视播放:', res);
                        if (res && res.result == "SUCCESS") {
                            CUES.tip({'msg': '推送成功', 'type': 'success'});
                        } else {
                            CUES.tip({'msg': '推送失败', 'type': 'warning'});
                        }
                    });
                }
            };
//绑定提示框
            $scope.tips = false;
            $scope.stopBubble = function ($event) {
                $event.stopPropagation()
            }
            $scope.resetstate = function () {
                $scope.tips = false;
            }

            // 直播推送
            $scope.tuisong = function () {
                $scope.tvtishi = false;
                $("body").off("touchmove");
                if (!$cookieStore.get("boxId")) {
                    $scope.tips = true;
                    return false;
                }
                $scope.zhibo($scope.activejson, $scope.goeq);
            };

        }})

}]);


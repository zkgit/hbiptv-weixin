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

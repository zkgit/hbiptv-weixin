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




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



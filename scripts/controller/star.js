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





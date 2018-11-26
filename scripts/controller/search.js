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








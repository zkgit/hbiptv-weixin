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







    

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


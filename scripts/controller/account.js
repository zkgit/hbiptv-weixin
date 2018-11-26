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





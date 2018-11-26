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
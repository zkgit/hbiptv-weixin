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


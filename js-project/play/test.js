(function(){

    function heredoc(fn) {
        return fn.toString().split('\n').slice(1,-1).join('\n') + '\n'
    }
    function clazz(proto){
        function extend(o){
            $.extend(this,o);
        }
        var self={extend:extend},methods={extend:extend};
        proto(self,methods);
        $.extend(self,methods);
        return self;
    }
    function map(data,propmap){
        var obj = {};
        for(var prop in propmap){
            var v = data[prop],prop1=propmap[prop];
            if( v != null ){
                obj[prop1] = v;
            }
        }
        return obj;
    }
    define('suning.yun.diamond',clazz(function(self,methods){
        self.extend({
            debug : req['yun.diamond'],
            service : {
                play : '//vip.suning.com/pointGame/execute.do?dt={encodeURIComponent(bd.rst())}&inputNum={dinput}&gameActivitiesConfigureId={gameid}',
                query_points : '//vip.suning.com/ajax/list/memberPoints.do',
                records : '//localhost:8443/demo1-web/simple/add-play-records.jsonp'//http://localhost:8080/demo1-web/simple/add-play-records.jsonp'
            },
            propmap : {
                awardsResult : 'p',
                content:'msg',
                result:'rindex',
                resultCode:'rcode',
                resultType:'rtype',
                state:'rstate'
            }
        });
        function play(dinput,callback){
            var gameid = $("#gameActivitiesConfigureId").val();
            var params = {dinput:dinput,gameid:gameid,playtime:Date.now().format()};
            var url = self.service.play.format(params);
            $.get(url,function(json){
                //success{"awardsResult":1.0,"content":"恭喜您获得10个云钻!","result":"020","resultCode":"GAMEACTIVITIES_DEDUCT_POINT_FAIL","resultType":"1","state":"1"}
                var data = map(json,self.propmap);
                if( data.p ){
                    var doutput = data.p * params.dinput;
                    data.doutput = doutput;
                    data.dresult = data.doutput - params.dinput;
                    records(params,data);   
                }else{
                    self.debug && console.info('error result',data);
                }
                callback && callback(params,data);
                (self.debug||!callback) && console.table([params]);
                (self.debug||!callback) && console.table([data]);
            },'json');
        }
        function query_points(callback){
            $.jsonp(self.service.query_points,{},function(json){
                var points = json.pointNum;
                !callback && console.info('query points',points);
                callback && callback(points);
            },function(){
                console.info('query points error');
            });
        }
        function records(params,result,callback){
            params = $.extend({},params,result);
            $.jsonp(self.service.records,{params:JSON.stringify(params)},function(json){
                self.debug && console.info('add play records',json);
                if( json.success ){
                    self.debug && console.info('add play records success');
                    callback && callback(json);
                }else{
                    self.debug && console.info('add play records fail');
                }
            },function(){
                console.info('add play records error');
            });
        }
        methods.extend({
            play : play,
            query_points:query_points,
            records : records
        });
    }));
	
})();


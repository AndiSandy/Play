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
                if( data.p != null ){
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
                    (self.debug||!callback) && console.info('add play records success');
                    callback && callback(json);
                }else{
                    (self.debug||!callback)  && console.info('add play records fail');
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
	
    define('suning.yun.diamond.player',clazz(function(self,methods){
        self.extend({
            dlevels : [10,20,30,40,50],
            level_max : 5,
            level : 0,
            dinput : 10,
            el :{
                sys_input : '.diam-num',
                sys_points : '#points'
            },
            history:[],
            3dstyle : "text-shadow: 0 1px 0 #fff,0 2px 0 #c9c9c9,0 3px 0 #bbb,0 4px 0 #b9b9b9,0 5px 0 #aaa,0 6px 1px rgba(0,0,0,.1),0 0 5px rgba(0,0,0,.1),0 1px 3px rgba(0,0,0,.3),0 3px 5px rgba(0,0,0,.2),0 5px 10px rgba(0,0,0,.25),0 10px 10px rgba(0,0,0,.2),0 20px 20px rgba(0,0,0,.15);font-size:5em;color:red;"
        });
        function up(){
            self.level ++;
            self.dinput = self.dlevels[Math.abs(self.level%self.level_max)];
            $(self.el.sys_input).val(self.dinput);
        }
        function down(){
            self.level --;
            self.dinput = self.dlevels[Math.abs(self.level%self.level_max)];
            $(self.el.sys_input).val(self.dinput);
        }
        function play(){
            suning.yun.diamond.play(self.dinput,function(params,result){
                var r = $.extend({},params,result);
                self.history.push(r);
                console.info("%c恭喜您,云钻x%s倍,获得了%s个云钻!",_3dstyle,r.p,r.output);
                console.info(r.msg);
            });
        }
        function query(){
            suning.yun.diamond.query_points(function(points){
                $(self.el.sys_points).html(points);
            });
        }
        function initialize(){
            $(document).on('keydown',function(e){
                if( e.keyCode == 40 ){
                    down();
                    e.preventDefault();
                }else if( e.keyCode == 38 ){
                    up();
                    e.preventDefault();
                }else if( e.keyCode == 37 ){
                    play();
                    e.preventDefault();
                }else if( e.keyCode == 39 ){
                    //console.clear();
                }else if( e.keyCode == 17 ){
                    query();
                    e.preventDefault();
                }
            });
        }
        $(function(){
            initialize();
        });
        methods.extend({
            up : up,
            down : down,
            play : play,
            query : query,
            initialize : initialize
        });
    }));
})();


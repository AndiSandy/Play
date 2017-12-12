/**
 * 数字滚动js
 * @param {Object} $
 */
(function($) {
if(!document.defaultView || !document.defaultView.getComputedStyle){
    var oldCurCSS = jQuery.curCSS;
    jQuery.curCSS = function(elem, name, force){
        if(name === 'background-position'){
            name = 'backgroundPosition';
        }
        if(name !== 'backgroundPosition' || !elem.currentStyle || elem.currentStyle[ name ]){
            return oldCurCSS.apply(this, arguments);
        }
        var style = elem.style;
        if ( !force && style && style[ name ] ){
            return style[ name ];
        }
        return oldCurCSS(elem, 'backgroundPositionX', force) +' '+ oldCurCSS(elem, 'backgroundPositionY', force);
    };
}

var oldAnim = $.fn.animate;
$.fn.animate = function(prop){
    if('background-position' in prop){
        prop.backgroundPosition = prop['background-position'];
        delete prop['background-position'];
    }
    if('backgroundPosition' in prop){
        prop.backgroundPosition = '('+ prop.backgroundPosition + ')';
    }
    return oldAnim.apply(this, arguments);
};

function toArray(strg){
    strg = strg.replace(/left|top/g,'0px');
    strg = strg.replace(/right|bottom/g,'100%');
    strg = strg.replace(/([0-9\.]+)(\s|\)|$)/g,"$1px$2");
    var res = strg.match(/(-?[0-9\.]+)(px|\%|em|pt)\s(-?[0-9\.]+)(px|\%|em|pt)/);
    return [parseFloat(res[1],10),res[2],parseFloat(res[3],10),res[4]];
}

$.fx.step.backgroundPosition = function(fx) {
    if (!fx.bgPosReady) {
        var start = $.css(fx.elem,'backgroundPosition');

        if(!start){//FF2 no inline-style fallback
            start = '0px 0px';
        }

        start = toArray(start);

        fx.start = [start[0],start[2]];

        var end = toArray(fx.end);
        fx.end = [end[0],end[2]];

        fx.unit = [end[1],end[3]];
        fx.bgPosReady = true;
    }

    var nowPosX = [];
    nowPosX[0] = ((fx.end[0] - fx.start[0]) * fx.pos) + fx.start[0] + fx.unit[0];
    nowPosX[1] = ((fx.end[1] - fx.start[1]) * fx.pos) + fx.start[1] + fx.unit[1];
    fx.elem.style.backgroundPosition = nowPosX[0]+' '+nowPosX[1];
};
})(jQuery);

(function(){

    function heredoc(fn) {
        return fn.toString().split('\n').slice(1,-1).join('\n') + '\n'
    }
    function clazz(proto){
        function extend(o){
            $.extend(this,o);
        }
        function loader(initFn){$(function(){initFn();});}
        var self={extend:extend},methods={extend:extend};
        proto(self,methods,{l:loader});
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
                wap_play : '//vip.suning.com/m/pointGame/execute.do?dt={encodeURIComponent(token)}&X-CSRF-TOKEN={csrftoken}',
                query_points : '//vip.suning.com/ajax/list/memberPoints.do',
                records : '//localhost:8443/demo1-web/simple/add-play-records.jsonp',
                records_query : '//localhost:8443/demo1-web/simple/query-records.jsonp',
                analzye : '//localhost:8443/demo1-web/simple/analzye-play-records.jsonp',
                query_player : '//vip.suning.com/ajax/list/memberInfo.do'
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
                try{
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
                }catch(e){
                    callback && callback(params,{rstate:'0',msg:'执行返回异常'});
                    console.error(e);
                }
                
            },'json');
        }
        function wap_play(dinput,callback){
            bd.rss(function(token) {
                var gameid = $('.bl-rule a').attr('href').match(/gameActivitiesConfigureId=(\w+)/)[1];
                var params = {dinput:dinput,gameid:gameid,csrftoken:csrftoken,token:token,playtime:Date.now().format()};
                var data1 = {inputNum:dinput,gameActivitiesConfigureId:gameid};
                var url = self.service.wap_play.format(params);
                $.post(url,data1,function(json){
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
            });
        }
        function query_player(callback){
            var url = self.service.query_player;
            $.post(url,{},function(json){
                callback && callback(json);
                (self.debug||!callback) && console.table([json]);
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
        function analyze_recoreds(callback){
            $.jsonp(self.service.analzye,{},function(json){
                !callback && console.info('query points',json);
                callback && callback(json);
            },function(){
                console.info('query points error');
            });
        }
        function records(params,result,callback){
            params = $.extend({},params,result);
            $(window).trigger('record.before',[params]);
            $.jsonp(self.service.records,{params:JSON.stringify(params)},function(json){
                self.debug && console.info('add play records',json);
                if( json.success ){
                    (self.debug) && console.info('add play records success');
                    callback && callback(json);
                }else{
                    (self.debug||!callback)  && console.info('add play records fail');
                }
            },function(){
                console.info('add play records error');
            });
        }
        function query_records(params,callback){
            $.jsonp(self.service.records_query,{params:JSON.stringify(params)},function(json){
                if( json.success ){
                    (self.debug) && console.info('query play records success');
                    callback && callback(json);
                }else{
                    (self.debug||!callback)  && console.info('query play records fail');
                }
            },function(){
                console.info('add play records error');
            });
        }
        methods.extend({
            play : play,
            wap_play : wap_play,
            query_points:query_points,
            query_player : query_player,
            analyze_recoreds : analyze_recoreds,
            query_records : query_records,
            records : records
        });
    }));
	
    define('suning.yun.diamond.chart',clazz(function(self,methods){
        var data = {
            length : 0,
            datetime : [],
            dinput : [],
            doutput : [],
            p : []
        };
        var option = {
            title : {
                text: '--变化',
                show : false
            },
            tooltip : {
                trigger: 'axis'
            },
            legend: {
                data:['输入','输出','倍数']
            },
            toolbox: {
                show : true,
                feature : {
                    mark : {show: true},
                    dataView : {show: true, readOnly: false},
                    magicType : {show: true, type: ['line', 'bar']},
                    restore : {show: true},
                    saveAsImage : {show: true}
                }
            },
            calculable : true,
            xAxis : [
                {
                    boundaryGap : false,
                    data : data.datetime
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    name : '钻',
                    axisLabel : {
                        formatter: '{value} 钻'
                    }
                },
                {
                    type : 'value',
                    name : '倍',
                    axisLabel : {
                        formatter: '{value} 倍'
                    }
                }
            ],
            series : [
                {
                    name:'输入',
                    type:'bar',
                    barMaxWidth : 30,
                    barMinHeight : 5,
                    data:data.dinput
                },
                {
                    name:'输出',
                    type:'bar',
                    barMaxWidth : 30,
                    barMinHeight : 5,
                    data:data.doutput
                },
                {
                    name:'倍数',
                    type:'line',
                    yAxisIndex: 1,
                    data:data.p
                }
            ]
        };
        self.extend({
            max : 50,
            data : data,
            option : option
        });
        function update(r){
            if(data.length > self.max ){
                data.datetime.shift();
                data.dinput.shift();
                data.doutput.shift();
                data.p.shift();
            }
            data.datetime.push(r.playtime);
            data.dinput.push(r.dinput);
            data.doutput.push(r.doutput);
            data.p.push(r.p);
            data.length ++;

            option.xAxis[0].data = data.datetime;
            option.series[0].data = data.dinput;
            option.series[1].data = data.doutput;
            option.series[2].data = data.p;
        }
        function initialize(chartid){
            echarts.registerTheme('macarons',echarts.theme.macarons);
            var dchart = echarts.init(document.getElementById(chartid),'macarons');
            self.dchart = dchart;
            dchart.showLoading();
            $(window).on('chart.load',function(e,r){
                update(r);
                dchart.setOption(option);
                dchart.hideLoading();
            });
        }
        methods.extend({
            initialize : initialize
        });
    }));

    define('suning.yun.diamond.game.view',clazz(function(self,methods,env){
        var view_html = heredoc(function(){/*
            <style>
                .game-viewport{position:fixed;bottom:0px;width:100%;height:350px;background:white;z-index:9999;}
                #all{
                    width: 100%;
                    margin: 0 auto;
                    background: #ffffff;
                }
                #all .t_num i {
                    width: 33px;
                    height: 47px;
                    display: inline-block;
                    background: url('//127.0.0.1:7071/play/number1.png') no-repeat;
                    background-position: 0 0;
                }
                .t_num span{
                    font-size: 70px;line-height: 41px;
                }
                #dchart,#dchart-history,#records-history{height:300px;width:100%;}
                #records-history{display:none;}
            </style>
            <div class='game-viewport'>
                <div id="all">
                    当前账户<span class="t_num t_num1" points></span>
                    当前第<span class="t_num t_num1" playindex></span>次输入<span class="t_num t_num1" dinput></span>
                    输出<span class="t_num t_num1" doutput><i style="background-position: 0px 0px;"></i></span>
                    本次结算<span class="t_num t_num1" cpoints></span>
                    一个周期结算<span class="t_num t_num1" rpoints></span>
                    <button history-review>历史查看</button>
                </div>
                <div id="dchart">
                </div>
                <div id="records-history">
                    <div id="dchart-history">
                        //history
                    </div>
                </div>
            </div>
        */});
        self.extend({
            view_html : view_html,
            el : {
                points : '[points]',
                dinput : '[dinput]',
                doutput : '[doutput]',
                playindex : '[playindex]',
                cpoints : '[cpoints]',
                rpoints  : '[rpoints]',
                chart : 'dchart'
            }
        });
        
        function show_num(n,el,bsign) {
            el = el || '.t_num1',bsign = bsign == null ? false : bsign;
            if(bsign){
                var sign='+';
                if( n < 0 ){
                    sign = '-';
                    n = Math.abs(n);
                }
                var selm = $($('[n-sign]',el)[0]||'<span n-sign></span>').html(sign);
                $(el).prepend(selm);
            }else{
                n = Math.abs(n);
            }
            var len = String(n).length;
            $(el+" i:gt("+(len-1)+")").remove();
            var it = $(el+" i");
            for(var i = 0; i < len; i++) {
                if(it.length <= i) {
                    $(el).append("<i></i>");
                }
                var num = String(n).charAt(i);
                //根据数字图片的高度设置相应的值
                var y = -parseInt(num) * 58;
                var obj = $(el+" i").eq(i);
                obj.animate({
                    backgroundPosition: '(0 ' + String(y) + 'px)'
                }, 'slow', 'swing', function() {});
            }
        }
        function initialize(){
            self.viewport = $(view_html);
            $('body').append(self.viewport);
            self.viewport.height(window.innerHeight);
            $('#dchart').height(Math.max(200,window.innerHeight-50));
            $(window).on('game.play.after',function(e,r,po){
                show_num(r.points,self.el.points);
                show_num(r.doutput,self.el.doutput);
                show_num(po.playindex,self.el.playindex);
                show_num(po.current.points,self.el.cpoints,true);
                $(window).trigger('chart.load',[r]);
            });
            $(window).on('dinput.change',function(e,player){
                show_num(player.dinput,self.el.dinput);
                show_num(player.points,self.el.points);
            });
            $(window).on('points.loaded',function(e,points,dinput,po){
                show_num(points,self.el.points);
                show_num(dinput,self.el.dinput);
                show_num(po.playindex,self.el.playindex);
                show_num(po.current.points,self.el.cpoints,true);
            });
            $(window).on('ro.play.after',function(e,ro){
                show_num(ro.records.points,self.el.rpoints,true);
            });
            $(window).on('ro.loaded',function(e,ro){
                show_num(ro.records.points,self.el.rpoints,true);
            });
            $('[history-review]').toggle(function(){
                $('#records-history').show();
                $('#dchart').hide();
            },function(){
                $('#records-history').hide();
                $('#dchart').show();
            });
            suning.yun.diamond.chart.initialize(self.el.chart);
            $(window).trigger('game.view.loaded');
        }
        methods.extend({
            initialize : initialize,
            show_num : show_num
        });
        env.l(initialize);
    }));
    define('suning.yun.diamond.game.records',clazz(function(self,methods,env){

        function query(params){
            suning.yun.diamond.query_records(params,function(){
                
            });
        }
        function initialize(){
            $(window).on('player.loaded',function(e,playerid){
                self.playerid = playerid;
            });
            var params = {
                page : 0,
                pagesize : 50,
                playerid : self.playerid,
            };
            //翻页事件绑定
            suning.yun.diamond.query_records(params,function(json){
                //init records chart
            });
        }
        $(window).on('game.view.loaded',function(){
            initialize();
        });
    }));
    define('suning.yun.diamond.player',clazz(function(self,methods,env){
        self.extend({
            debug : req['yun.debug'],
            dlevels : [10,20,30,40,50],
            rlevels : [0.5,0,1,3,5],
            rnames : ['h','z','o','t','f'],
            level_max : 5,
            level : 0,
            dlevel : 0,
            dinput : 10,
            points : 0,
            playindex : 0,
            el :{
                sys_input : '.diam-num,.bet-num',
                sys_points : '#points,.residue-number .number'
            },
            history:{
                rates : []
            },
            current : {
                points : 0,
                rlevels : [],
                records : [],
                rates : [],
                ratemap : {}
            },
            pre : {},
            style : {
                r : "text-shadow: 0 1px 0 #fff,0 2px 0 #c9c9c9,0 3px 0 #bbb,0 4px 0 #b9b9b9,0 5px 0 #aaa,0 6px 1px rgba(0,0,0,.1),0 0 5px rgba(0,0,0,.1),0 1px 3px rgba(0,0,0,.3),0 3px 5px rgba(0,0,0,.2),0 5px 10px rgba(0,0,0,.25),0 10px 10px rgba(0,0,0,.2),0 20px 20px rgba(0,0,0,.15);font-size:5em;color:red;",
                n : 'color:black;font-size:14px;'   
            }
        });
        function logStyle(content,styles){
            styles.unshift(content);
            console.info.apply(console,styles);
        }
        function go2(level){
            self.level = level;
            self.dlevel = (self.level%self.level_max+self.level_max)%self.level_max
            self.dinput = self.dlevels[self.dlevel];
            $(self.el.sys_input).val(self.dinput);
            self.debug && console.info('当前账户：[{points}],当前输入[{dinput}]'.format(self));
            $(window).trigger('dinput.change',[self]);
        }
        function up(){
            self.level ++;
            go2(self.level);
        }
        function down(){
            self.level --;
            go2(self.level);
        }
        function $up(){
            self.dlevel ++;
            self.dlevel = Math.min(self.dlevel,self.level_max-1);
            go2(self.dlevel);
        }
        function $down(){
            self.dlevel --;
            self.dlevel = Math.max(self.dlevel,0);
            go2(self.dlevel);
        }
        //分析
        function analyze(r){
            r.pre = self.pre;
            self.pre.next = r;
            self.pre = r;

            r.points = self.points = self.points + r.dresult;
            self.current.points += r.dresult;
            r.cpoints = self.current.points;
            r.rlevel = self.rlevels.indexOf(r.p);
            r.dlevel = self.dlevel;
            r.rname = self.rnames[self.rlevel];

            self.current.rlevels.unshift(r.rlevel);
            self.current.records.unshift(r);

            $(window).trigger('analyze.before',[r]);
            self.current.ratemap[r.p]++;
            self.current.rates = rmap2rates(self.current.ratemap);
            calc_rates(self.current.rates);
            $(window).trigger('analyze.after',[r]);
        }
        function calc_rates(rates){
            var psum = 0;
            for(var i=0;i<rates.length;i++){
                var rate = rates[i];
                psum += rate.pcount;
            }
            for(var i=0;i<rates.length;i++){
                var rate = rates[i];
                rate.prate = parseFloat((rate.pcount/psum).toFixed(4));
            }
        }
        function rmap2rates(rmap){
            var rates = [];
            for(var p in rmap ){
                var pcount = rmap[p];
                rates.push({p:parseFloat(p),pcount:pcount});
            }
            return rates;
        }
        function play(callback){
            $(window).trigger('game.play.before',[self.pre,self]);
            function play$callback(params,result){
                self.playindex++;
                var r = $.extend({},params,result);
                if( r.rstate == '1' ){
                    analyze(r);
                    if( r.p > 1 ){
                        var content = "%c恭喜您,云钻[{dinput}]%cx{p}%c倍,获得了%c{doutput}({dresult})%c个云钻!,账户余额[{points}]".format(r);
                        with(self.style){
                            var styles = [n,r,n,r,n];
                            logStyle(content,styles);
                        }
                    }
                    self.debug && console.info('shit,投入{dinput},获得{doutput}({dresult})个云钻!账户余额[{points}]'.format(r));
                    $(window).trigger('game.play.after',[r,self]);
                }else{
                    console.info(r.msg);
                }
                callback && callback(r);
            }
            if( location.href.indexOf('/m/') >=0 ){
                suning.yun.diamond.wap_play(self.dinput,play$callback);
            }else{
                suning.yun.diamond.play(self.dinput,play$callback);    
            }
        }
        function query(){
            suning.yun.diamond.query_points(function(points){
                $(self.el.sys_points).html(points);
                self.points = points;
                console.info('当前账户：[{points}]'.format(self));
                $(window).trigger('points.loaded',[points,self.dinput,self]);
            });
        }
        function query_player(){
            suning.yun.diamond.query_player(function(player){
                self.playerid = player.userName || player.nickName || player.custNum;
                console.info('playerid',self.playerid);
                $(window).trigger('player.loaded',[self.playerid]);
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
                    console.clear();
                    console.info('当前统计：');
                    console.table(self.current.rates);
                    console.info('历史统计：');
                    console.table(self.history.rates);
                }else if( e.keyCode == 17 ){
                    query();
                    e.preventDefault();
                }
            });
            for(var i = 0; i < self.rlevels.length;i++){
                var r = self.rlevels[i];
                self.current.ratemap[r] = 0;
            }
            query();
            query_player();
            $(window).on('record.before',function(e,params){
                params.playerid = self.playerid
            });
            suning.yun.diamond.analyze_recoreds(function(json){
                if( json.success && json.rates ){
                    self.history.rates = json.rates;
                    calc_rates(json.rates);
                    console.info('历史统计：');
                    console.table(self.history.rates);
                }
            });
        }
        env.l(initialize);
        methods.extend({
            up : up,
            down : down,
            $up : $up,
            $down : $down,
            go2 : go2,
            play : play,
            query : query,
            initialize : initialize
        });
    }));
    
    define('suning.yun.diamond.game.helper',clazz(function(self,methods){
        var node_network = {};
        var mv_Fn_map = {};
        var exec_Fn_map = {};
        self.extend({
            debug : req['helper.debug'],
            node_network : node_network,
            mv_Fn_map : mv_Fn_map,
            exec_Fn_map : exec_Fn_map,
        });
        function __eval_code__(code,context){
            try{
                return (function(){
                    with(context||window){
                        return eval("("+(code)+")");
                    }
                }.apply(context||window));
            }catch(e){
                error('{0}eval处理异常-{1}',code,e);
            }
        }
        function __eval_fn__(fn,context,args){
            return __eval_code__(fn.toString().replace(/([^{]+\{)([\n\S\s]+?)(\}$)/,'$1 with(context){$2}$3('+(args||'')+')'),context);
        }
        function __eval__(obj,context,args){
            if( $.isStr(obj) ){
               return __eval_code__(obj,context);
            }else if( $.isFunction(obj) ){
                return __eval_fn__(obj,context,args);
            }
        }
        var __const__ = {
            __noop__ : 0x0,
            __break__ : 0x1,
            __continue__ : 0x2,
            __match__ : 0x3
        };
        var cmd = {
            is_break : function(c){return c == __const__.__break__;},
            is_continue : function(c){return c == __const__.__continue__;},
            is_match : function(c){return c == __const__.__match__;}
        };
        var NEXT = __const__.__continue__,STOP=__const__.__break__,MATCH=__const__.__match__,NOOP=__const__.__noop__;
        function error(desc){
            var d = new Date().toLocaleString();
            req['helper.debug'] && console.warn('['+d+']','[error]','字符串格式化错误 ',desc.formata(Array.copy(arguments,1)));
        }
        function route_node(node_name,context){
            try{
                var node = node_network[node_name];
                var c = node.__match__(context);
                //no matched
                if( !cmd.is_match(c) ) return c;
                //route
                c = node.__route__(context);
                if( cmd.is_match(c) ){//match sub route
                    //over
                    c = STOP;
                }else{
                    req['helper.debug'] && console.info('matched',node_name);
                    c = node.__exec__(context);
                }
                return c;
            }catch(e){
                error('nodes-route2-{0}-处理{1}异常-{2}',node_name,e);
                throw e;
            }
        }
        $.isStr = function(s){
            return typeof s == 'string';
        }
        function Node(node,node_name){
            
            //匹配
            function node_match(context){
                var matches = null,mo=node_matchvalue_parse(context),matchvalue=mo.mv;
                //matchvalue regex match
                if( $.isRegex(node.match) ){//regex
                    matches = matchvalue.match(node.match);
                }else if($.isFunction(node.match)){//match function
                    if( $.isRegex(node.regex) && matchvalue ){
                        var re_matches = matchvalue.match(node.regex);
                        if( re_matches != null ){
                            matches = node.match(context,re_matches);
                        }
                    }else{
                        matches = node.match(context);
                    }
                }else if( $.isStr(node.match) ){
                    var evel_str = node.match;
                    matches = __eval_code__(evel_str,$.extend(mo,context,{params:node.params}));
                }else if( $.isArray(node.match) ){
                    var match_arr = node.match;
                    for(var i=0;i<match_arr.length;i++){
                        var match = match_arr[i];
                        matches = __eval_code__(match,$.extend(mo,context,{params:node.params}));
                        (self.debug || req['helper.match.debug']) && console.info('|',node.name,i,'node_match',match,matches,mo);
                        if(matches) break;
                    }
                }else{
                    matches = true;
                }
                (self.debug || req['helper.match.debug']) && console.info('|',node.name,'node_match',node.match,matches,mo);
                matches && console.info('------------>',node.name,'node_match',node.match,matches,mo);
                var c = node.match == null || !(matches == null || matches === false) ? MATCH : null;
                return c;
            }
            //路由
            function node_route(context){
                if( node.route == null ){
                    return NOOP;
                }
                var next_route=null,route_ret,route_matched;
                var mo=node_matchvalue_parse(context),matchvalue=mo.mv;
                if( $.isFunction(node.route) ){
                    next_route = node.route(context,matchvalue);
                }else if( $.isPlainObject(node.route) ){
                    for(var route_name in node.route ){
                        var route_obj = node.route[route_name];
                        if( $.isRegex(route_obj) && matchvalue ){
                            var regex = route_obj;
                            route_matched = matchvalue.match(regex);
                            if( route_matched ){
                                next_route = route_name;
                                break;
                            }
                        }else if( $.isFunction(route_obj) ){
                            var route_fun = route_obj;
                            route_matched = route_fun.apply(node,[context,matchvalue]);
                            if( route_matched ){
                                next_route = route_name;
                                break;
                            }
                        }else if( $.isStr(route_obj) ){
                            route_matched = __eval__(route_obj,context);
                            if( route_matched ){
                                next_route = route_name;
                            }
                            break;
                        }else{
                            next_route = route_name;
                            break;
                        }
                    }
                }else if( typeof node.route == 'string' ){
                    next_route = node.route;
                }else{
                    error('route-{1}处理{0}无匹配路由',matchvalue,node.name);
                }
                if( next_route != null && node_network[next_route] ){
                    route_ret = route_node(next_route,context);
                }
                var c = next_route != null && route_ret != null ? MATCH : null;
                return c;
            }
            function node_matchvalue_parse(context){
                var ret = {},mv=node.matchvalue;
                if( mv ){
                    if( $.isFunction(mv) ){
                        ret.mv = __eval__(mv,context) ;
                    }else if( $.isStr(mv) ){
                        var mv_arr = mv.split(';')
                        for(var i=0;i<mv_arr.length;i++){
                            var mv_str = mv_arr[i];

                            var ms = mv_str.match(/(.+?)(\((.+?)\))?$/);
                            var mvFnName = ms[1],args=ms[3]||'';
                            var mvFn = mv_Fn_map[mvFnName];
                            ret.mv = __eval__(mvFn||mv_str,context,args);
                            if(mvFn){
                                ret[mvFnName] = ret.mv;
                            }
                        }
                    }
                }
                return ret;
            }
            function node_exe_parse(context,exec){
                var execFn = exec_Fn_map[exec||node.exec],ret=null;
                if( execFn ){
                    ret=__eval__(execFn,context);
                }else{
                   var execFns = node.exec.split(';');
                   for(var i=0;i<execFns.length;i++){
                        var execFnStr = execFns[i];
                        var ms = execFnStr.match(/(.+?)(\((.+?)\))?$/);
                        var execFnName = ms[1],args=ms[2]||'';
                        execFn = exec_Fn_map[execFnName];
                        if(execFn){
                            ret = __eval__(execFn,context,args);
                        }
                   }
                }
                return ret;
            }
            //执行
            function node_exec(context){
                var ret = NEXT;
                if($.isFunction(node.exec)){
                    ret = node.exec(context);
                }else if( $.isStr(node.exec) ){
                    ret = node_exe_parse(context);
                }else if( $.isPlainObject(node.exec) ){
                    var exec_obj = node.exec;
                    var mo=node_matchvalue_parse(context);
                    for(var con in exec_obj){
                        var exec = exec_obj[con];
                        if(__eval__(con,$.extend(mo,context)) ){
                            ret = node_exe_parse(context,exec);
                            break;
                        }
                    }
                }
                return ret;
            }
            $.extend(node,{
                name : node_name,
                __match__ : node_match,
                __exec__ : node_exec,
                __route__ : node_route
            });
        }
        
        function initialize(){
            for(var node_name in node_network){
                var node = node_network[node_name];
                Node(node,node_name);
            }
        }
        function start(context){
            for(var node_name in node_network){
                var node = node_network[node_name];
                if( node.entry === true ){
                    var c = route_node(node_name,context);
                    //no matched
                    if( !cmd.is_match(c) ) continue;
                    //matched
                    if( cmd.is_continue(c) ){
                        continue;
                    }else if( cmd.is_break(c) ){
                        break;
                    }else{
                        break;
                    }
                }
            }
        }

        $.extend(mv_Fn_map,{
            'p' : 'po.pre.p',
            'cpoints' : 'po.current.points',
            'rpoints' : 'ro.records.points',
            'dlevel' : 'po.dlevel',
            'p_cnt' : function(n){
                return _.chain(po.current.records).first(n).countBy(function(r){return r.p>=3?'got':'miss'}).value();
            },
            'op_cnt' : function(n){
                return _.chain(ro.records.op).first(n).countBy().value();
            },
            'dlevel_cnt' : function(n,l){
                return _.chain(po.current.records).first(n).countBy(function(r){return r.dlevel<l?'got':'miss'}).value();
            },
            'dinput_str' : function(n){
                return _.chain(po.current.records).first(n).pluck('dinput').value().join('');
            },
            'rlevel_str' : function(n){
                return _.chain(po.current.records).first(n).pluck('rname').value().join('');
            }
        });
        $.extend(exec_Fn_map,{
            NEXT : NEXT,
            STOP : STOP,
            UP : function(){po.$up();},
            DOWN : function(){po.$down();},
            GO2 : function(l){po.go2(l);},
            CLEAR : function(){ro.clear();},
            SLOW : function(){ro.slow();},
            QUICK : function(){ro.quick();},
            END : function(){ro.end();},
            SLEEP : function(t){ro.sleep(t)}
        });
        $.extend(node_network,{
            '输入峰值极端调整' : {
                entry : true,
                matchvalue : 'p;dlevel',
                match : ['p>=3&&dlevel>=1','p<=1&&dlevel>=1'],
                exec : 'GO2(0);NEXT'
            },
            '执行间隔放慢' : {
                entry : true,
                matchvalue : 'p_cnt(6);op_cnt(5)',
                match : 'p_cnt.miss>4&&(op_cnt.s==0 || op_cnt.s==null)',
                exec : 'SLOW'
            },
            '最近3次有中且输入没调整则调整输入并加速执行' : {
                entry : true,
                matchvalue : 'p_cnt(3);dlevel_cnt(3,1)',
                match : 'p_cnt.got>0&&dlevel_cnt.got>2',
                exec : 'UP;QUIK'
            },
            '一个周期结算小于指定数额则停止' : {
                entry : true,
                params : {miss_points:-50,got_points:100},
                matchvalue : 'rpoints',
                match : ['rpoints<params.miss_points','rpoints>params.got_points'],
                exec : 'SLEEP;CLEAR'
            },
            '本次结算小于/大于指定数额则停止' : {
                entry : true,
                params : {miss_points:-100,got_points:200},
                matchvalue : 'cpoints',
                match : ['cpoints<params.miss_points','cpoints>params.got_points'],
                exec : 'END'
            }
        });
        

        initialize();
        methods.extend({
            start : start
        });
    }));

    define('suning.yun.diamond.game.rookie',clazz(function(self,methods,env){
        self.extend({
            ttl : 2,
            ttn :60000,
            po : suning.yun.diamond.player,
            runing : false,
            round : 0,
            playindex : 0,
            records : {
                op : [],
                points : 0
            }
        });
        function run(){
            self.runing = true;
            self.round ++;
            self.playindex = 0;
            function tick(){
                if(self.runing){
                    console.info('============>第',self.round,'轮',self.ttl,'秒后执行第',++self.playindex,'次');
                    self.timeid = setTimeout(function(){
                        tick$play();
                    },self.ttl*1000);   
                }
            }
            function tick$play(){
                $(window).trigger('help.play.before');
                suning.yun.diamond.player.play(function(r){
                    $(window).trigger('help.play.after',[r]);
                    tick();
                });
            }
            tick();
        }
        function stop(){
            self.runing = false;
            console.info('============>停止定时器',self.timeid);
            clearTimeout(self.timeid);
        }
        function end(){
            stop();
        }
        function sleep(ttn){
            stop();
            self.ttn = ttn||self.ttn;
            self.sleepid && clearTimeout(self.sleepid);
            self.sleepid = setTimeout(function(){
                run();
            },self.ttn);
            console.info('============>',self.ttn,'秒后重新开始');
        }
        function slow(){
            self.ttl++;
            self.records.op.unshift('s');
        }
        function quick(){
            self.ttl = Math.min(self.ttl--,1);
            self.records.op.unshift('q');
        }
        function remember(r){
            self.records.points += r.dresult;
            $(window).trigger('ro.play.after',[self]);
        }
        function clear(){
            self.records.points = 0;
        }
        function paly_before(){
            suning.yun.diamond.game.helper.start({po:self.po,ro:self,pre:self.po.pre});
        }
        function paly_after(r){
            if( r.rstate == '0' ){
                console.info('<<=======啊呀,中枪拉!!!');
            }
            remember(r);
        }
        function initialize(){
            $(window).on('help.play.before',function(e){
                paly_before();
            });
            $(window).on('help.play.after',function(e,r){
                paly_after(r);
            });
            var lasttime = -1,ktimeid = 0;
            $(document).on('keydown',function(e){
                if( e.keyCode == 110 ){
                    var nowtime = new Date().getTime();
                    if(lasttime<0){
                        lasttime = nowtime;
                    }
                    var dur = nowtime - lasttime;
                    if( dur < 500 && dur > 10 ){
                        run();
                        clearTimeout(ktimeid);
                    }else{
                        ktimeid = setTimeout(function(){
                            stop();
                        },500);
                    }
                    lasttime = nowtime;
                    e.preventDefault();
                }
            });
            $(window).trigger('ro.loaded',[self]);
        }
        env.l(initialize);
        methods.extend({
            run : run,
            slow : slow,
            quick : quick,
            end : end,
            clear : clear,
            sleep : sleep,
            stop : stop
        });
    }));
})();
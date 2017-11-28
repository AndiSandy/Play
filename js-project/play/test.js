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
                wap_play : '//vip.suning.com/m/pointGame/execute.do?dt={encodeURIComponent(token)}&X-CSRF-TOKEN={csrftoken}',
                query_points : '//vip.suning.com/ajax/list/memberPoints.do',
                records : '//localhost:8443/demo1-web/simple/add-play-records.jsonp',
                analzye : '//localhost:8443/demo1-web/simple/analzye-play-records.jsonp'
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
            wap_play : wap_play,
            query_points:query_points,
            analyze_recoreds : analyze_recoreds,
            records : records
        });
    }));
	
    define('suning.yun.diamond.game.view',clazz(function(self,methods){
        var view_html = heredoc(function(){/*
            <style>
                .game-viewport{position:fixed;bottom:0px;width:100%;height:150px;background:white;z-index:9999;}
                #all{
                    width: 100%;
                    margin: 0 auto;
                    background: #ffffff;
                }
                #all .t_num i {
                    width: 33px;
                    height: 47px;
                    display: inline-block;
                    background: url('http://www.17sucai.com/preview/1/2017-09-22/scroll/img/number1.png') no-repeat;
                    background-position: 0 0;
                }
            </style>
            <div class='game-viewport'>
                <div id="all">
                    当前账户<span class="t_num t_num1" points></span>当前输入<span class="t_num t_num1" dinput></span>
                    输出<span class="t_num t_num1" doutput><i style="background-position: 0px 0px;"></i></span>
                </div>
            </div>
        */});
        self.extend({
            viewport : view_html,
            el : {
                points : '[points]',
                dinput : '[dinput]',
                doutput : '[doutput]'
            }
        });
        
        function show_num(n,el) {
            el = el || '.t_num1';
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
            $('body').append(self.viewport);
            $(window).on('game.played',function(e,r){
                show_num(r.points,self.el.points);
                show_num(r.doutput,self.el.doutput);
            });
            $(window).on('dinput.change',function(e,player){
                show_num(player.dinput,self.el.dinput);
                show_num(player.points,self.el.points);
            });
            $(window).on('points.loaded',function(e,points,dinput){
                show_num(points,self.el.points);
                show_num(dinput,self.el.dinput);
            });
        }
        methods.extend({
            initialize : initialize,
            show_num : show_num
        });
        $(function(){
            initialize();    
        });
    }));
    define('suning.yun.diamond.player',clazz(function(self,methods){
        self.extend({
            dlevels : [10,20,30,40,50],
            rlevels : [0.5,0,1,3,5],
            level_max : 5,
            level : 0,
            dinput : 10,
            points : 0,
            el :{
                sys_input : '.diam-num,.bet-num',
                sys_points : '#points,.residue-number .number'
            },
            history:{
                rates : []
            },
            current : {
                records : [],
                rates : [],
                ratemap : {}
            },
            style : {
                r : "text-shadow: 0 1px 0 #fff,0 2px 0 #c9c9c9,0 3px 0 #bbb,0 4px 0 #b9b9b9,0 5px 0 #aaa,0 6px 1px rgba(0,0,0,.1),0 0 5px rgba(0,0,0,.1),0 1px 3px rgba(0,0,0,.3),0 3px 5px rgba(0,0,0,.2),0 5px 10px rgba(0,0,0,.25),0 10px 10px rgba(0,0,0,.2),0 20px 20px rgba(0,0,0,.15);font-size:5em;color:red;",
                n : 'color:black;font-size:14px;'   
            }
        });
        function logStyle(content,styles){
            styles.unshift(content);
            console.info.apply(console,styles);
        }
        function up(){
            self.level ++;
            self.dinput = self.dlevels[Math.abs(self.level%self.level_max)];
            $(self.el.sys_input).val(self.dinput);
            console.info('当前账户：[{points}],当前输入额度[{dinput}]'.format(self));
            $(window).trigger('dinput.change',[self]);
        }
        function down(){
            self.level --;
            self.dinput = self.dlevels[Math.abs(self.level%self.level_max)];
            $(self.el.sys_input).val(self.dinput);
            console.info('当前账户：[{points}],当前输入额度[{dinput}]'.format(self));
            $(window).trigger('dinput.change',[self]);
        }
        //分析
        function analyze(r){
            self.current.records.push(r);
            r.points = self.points = self.points + r.dresult;

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
                rate.prate = parseFloat((rate.pcount/psum).toFixed(3));
            }
        }
        function rmap2rates(rmap){
            var rates = [];
            for(var p in rmap ){
                var pcount = rmap[p];
                rates.push({p:p,pcount:pcount});
            }
            return rates;
        }
        function play(){
            $(window).trigger('game.play.before',[self]);
            function play$callback(params,result){
                var r = $.extend({},params,result);
                analyze(r);
                if( r.p > 1 ){
                    var content = "%c恭喜您,云钻[{dinput}]%cx{p}%c倍,获得了%c{doutput}({dresult})%c个云钻!,账户余额[{points}]".format(r);
                    with(self.style){
                        var styles = [n,r,n,r,n];
                        logStyle(content,styles);
                    }
                }
                console.info('shit,投入{dinput},获得{doutput}({dresult})个云钻!账户余额[{points}]'.format(r));
                $(window).trigger('game.played',[r]);
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
                $(window).trigger('points.loaded',[points,self.dinput]);
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
            suning.yun.diamond.analyze_recoreds(function(json){
                if( json.success && json.rates ){
                    self.history.rates = json.rates;
                    calc_rates(json.rates);
                    console.info('历史统计：');
                    console.table(self.history.rates);
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


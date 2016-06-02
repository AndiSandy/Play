(function(){
	//状态
	var ydstatus = {
		name_map : { 'down' : 0 , 'fair':'1', 'up':'2' },
		status_map : {'0':'down',1:'fair',2:'up',
			getstatus : function( num ){
				return num == 0 ? 1 : num < 0 ? 0 : 2;
			}
		},
		ishit : function( status ){
			return status == this.name_map['up'];
		},
		ismiss : function( status ){
			return status == this.name_map['down'] || status == this.name_map['fair'];
		},
		//获取状态名称
		getname : function( status ){
			return this.status_map[status] || 'down';
		},
		//获取状态
		getstatus : function( num ){
			return this.status_map.getstatus( num );
		}
	};

	//云钻
	var YunDiamond = {
		level : [10,20,30,40,50],
		curr : 0,
		count : 0,
		records : new Queue(50),
		up : function(){
			this.curr ++;
			return this.go(this.curr);
		},
		down : function(){
			this.curr --;
			return this.go(this.curr);
		},
		go : function(level){
			this.count ++;
			this.curr = level == null ? this.curr : level;
			this.curr = Math.min( this.curr,this.level.length-1);
			this.curr = Math.max( this.curr,0);
			var num = this.level[this.curr];
			this.records.qin(this.curr);
			this.target && (this.target.cost = num);
			return num;
		},
		now : function(){
			return this.go();
		},
		header : function(){
			this.curr = this.level.length -1;
			return this.go();
		},
		footer : function(){
			this.curr = 0;
			return this.go();
		},
		init : function(target){
			this.curr = this.level.indexOf(target.cost);
			this.target = target;
		}
	};

	//学习
	var autoLearning = {
		count : 0,
		yund : {},
		records : new Queue(50),
		history: new Queue(50),
		brain : {
			rule : [
				'continueMiss(hit_mem:/^[01]{5}/ && yund_mem:/^[01]{5}/){ yund ++ }[break]', 
				'continueMiss2(hit_mem:/^[01]{3}/ && yund_mem:/^[1234]{3}/){ yund -- }[break]',
				'upAndDown5(hit_mem:/^[2]/ && yund_mem:/^[01234]/){ yund = 1 }[break]',
				'upAndDown1(hit_mem:/^[012]{1}[2]/ && yund_mem:/^[01]{3}/){ yund = 4 }[break]',
				'upAndDown2(hit_mem:/^[012]{1,2}[2]/ && yund_mem:/^[4]{1}/){ yund = 0 }[break]',
				'upAndDown3(hit_mem:/^[012]{2,5}[2]/ && yund_mem:/^[01]{3}/){ yund ++ }[break]',
				'upAndDown4(hit_mem:/^[012]{3}[2]/ && yund_mem:/^[234]{5}/){ yund = 1 }[break]'
			],
			filters : [
				{
					name : 'calcP',
					filter : function( context ){
						var history = context.hit_history,max_hit=null,min_hit=null;
						for(var i = 0; i < history.length; i ++ ){
							var record = history[i].join('');
							var matches = record.match(/2([01]+)2/);
							if( matches ){
								for(var j = 1; j < matches.length; j ++ ){
									if( max_hit == null ){
										max_hit = matches[j].length;
										min_hit = matches[j].length;
									}else{
										max_hit = Math.max(max_hit,matches[j].length);
										min_hit = Math.min(min_hit,matches[j].length);
									}
								}
							}
						}
						if( max_hit != null ){
							context.max_hit = max_hit;
							context.min_hit = min_hit;
						}
					}
				}
			],
			resolveRule4string : function(rule){
				var o = {name:'example',condition:'',action:'',next:''};
				var reg = /([^\()]+)\s*\(([^\)]+)\)\s*({[^}]+})\s*\[([^]+)\]/,m=null;
				if( m = reg.exec(rule) ){
					o.name = m[1];
					o.condition = m[2];
					o.action = m[3];
					o.next = m[4];
				}else{
					console.error('ileagel rule:%s',rule);
					o = null;
				}
				return o;
			},
			resolveRule4object : function( rule ){
				return rule;
			},
			init : function(){
				this.ruleMap = {};
				this.ruleArr = [];
				for(var i = 0; i < this.rule.length; i ++){
					var rule = this.rule[i];
					if( typeof rule == 'string' && ( rule = this.resolveRule4string(rule) ) ){
						//resolve
						this.ruleArr[i] = rule;
						this.ruleMap[rule.name] = rule;
					}else if( typeof rule == 'object' && !rule.name){
						rule = this.resolveRule4object(rule);
						this.ruleArr[i] = rule;
						this.ruleMap[rule.name] = rule;
					}else{
						console.error('unkown rule:%s',rule);
					}
				}
			},
			//条件解析
			condtionResovler : {
				operateExpr : {
					//reg operate
					":" : function(expr1,expr2reg,context){
						var expr1Value = context[expr1];
						var matches = expr1Value.match( expr2reg._eval_() );
						return matches != null;
					}
				},
				exec : function( expro, context ){
					var bop = false;
					//do something
					var matches = expro.expr.match(/([^:=><]+)([:=><]+)([^:=><]+)/);
					if( matches ){
						expro.expr1 = matches[1];
						expro.operateExpr = matches[2];
						expro.expr2 = matches[3];
						expro.operateFunc = this.operateExpr[expro.operateExpr];
						if( expro.operateFunc ){
							expro.result = bop = expro.operateFunc( expro.expr1, expro.expr2, context );
						}else{
							console.error("unkown conditon operateExpr:%s",expro.operateExpr);
						}
					}else{
						console.error("unkown conditon:%o",expro);
					}
					expro.bop = bop;
					return expro;
				},
				resolve4string : function(condition, context ){
					var exprs = [];
					condition.replace(/(&&|\|\|)*\s*([^&\|\s]+)/g,function(exprall,cond,expr){
						if( expr ){
							//expression
							var expro = {
								expr : expr,
								operate : function( expro ){
									var bop = false;
									if( this.suffix == '&&' ){
										bop = this.result && expro.bop;
									}else if( this.suffix == '||' ){
										bop = this.result || expro.bop;
									}
									this.bop = bop;
									return bop;
								}
							};
							//operation flag eg:&& ||
							if( cond ) {
								expro.suffix = cond;
							}
							exprs.push( expro );
						}
					})
					var bcheck = false;
					if( exprs.length > 1 ){
						for( var i = 1; i < exprs.length; i ++ ){
							var expro1 = this.exec( exprs[i-1], context );
							var expro2 = this.exec( exprs[i], context );
							bcheck = expro2.operate( expro1 );
						}
					}else{
						var expro = this.exec( exprs[0] );
						bcheck = expro.result;
					}
					
					return bcheck;
				},
				resolve : function( condition, context ){
					//check
					var bcheck = false;
					if( typeof condition == 'function' ){
						bcheck = condition.apply( context );
					}else if( typeof condition == 'string' ){
						// resolve in some rules
						bcheck = this.resolve4string( condition, context );
					}else if( typeof condition == 'boolean'){
						bcheck = condition;
					}
					return bcheck;
				}
			},
			//action解析
			actionResovler : {
				resolve : function( action, context ){
					// do some thing
					if( typeof action == 'function' ){
						action.apply( context );
					}else if( typeof action == 'string' ){
						action.format(context);
					}
				}
			},
			execCondition : function( condition , context ){
				// check condition
				//console.info('condition:%s',condition);
				var bcheck = this.condtionResovler.resolve(condition, context );
				return bcheck;
			},
			execAction : function( action, context ){
				// do some thing
				console.info('action:%s',action);
				this.actionResovler.resolve( action, context );
			},
			execRule : function( rule, context ){
				// get condition
				var bexec = this.execCondition(rule.condition,context),next = rule.next ;
				if( bexec ){
					// do something
					this.execAction(rule.action,context);
					if( next != 'break' && next != 'next'){
						var nextRule = this.ruleMap[next];
						next = this.execRule(rule, context );
					}
				}else {
					next = null;
				}
				return next;
			},
			think : function( context ){
				//fitlers
				for( var i = 0; i < this.filters.length; i ++ ){
					var filter = this.filters[i];
					filter.filter( context );
				}
				// rosolve rule
				if( context.skip == 0 ){
					for(var i =0; i < this.ruleArr.length; i ++){
						var rule = this.ruleArr[i];
						// exec rule
						var next = this.execRule(rule,context);
						// do next
						if( next == 'break'){
							break;
						}else if( next == 'next'){
							continue;
						}
					}
				}else{
					context.skip --;
				}
				
			}
		},
		before : function( status ){
			//记录变化数据
			this.records.qin(status);
			//记录命中数据
			if( ydstatus.ishit( status ) ){
				this.history.qin(this.records.copy());
			}
		},
		context : {
			skip : 0,
			dumpout : function(){
				that.yund.go(this.yund);
			}
		},
		doing : function(){
			var that = this;
			var hit_mem = this.records.join('');
			var yund_mem = this.yund.records.join('');
			// TODO
			var context = {
				hit_mem : hit_mem,
				yund_mem : yund_mem,
				yund : that.yund.curr,
				hit_history : this.history.queue,
				dumpout : function(){
					that.yund.go(this.yund);
				}
			};
			//resolve rule
			this.brain.think($.extend(this.context,context));
			this.context.dumpout();
		},
		after : function(){},
		learn : function(status){
			this.count ++;
			this.before(status);
			this.doing(status);
			this.after(status);
			console.info(this.count,'status',status,"当前即将消费的云钻数",this.yund.now());
		},
		init : function(target){
			this.brain.init();
			this.target = target;
			this.yund = target.yund;
			//init
			var cacheObj = _.cache('cacheData');
			if( cacheObj ){
				this.records.queue = cacheObj.records;
				this.history.queue = cacheObj.history;
				this.yund.records.queue = cacheObj.yun_records;
			}
		},
		destory : function(){
			if( this.yund && this.yund.records){
				var cacheObj = {
					records : this.records.queue,
					history : this.history.queue,
					yun_records : this.yund.records.queue
				};
				_.cache('cacheData',cacheObj);
			}
		}
	};

	var Play = {
		delay:5000,//每次投递的延迟时间
		count : 0,//投递次数
		account : 0,//账户数量
		cost : 10,//每次投递数
		yund : YunDiamond,//云钻
		min : 10,//每轮投递次数
		totalaccount : 0,//总数
		keepacount : 1800,//保持最低数，小于是停止投递
		wait : 30000,//每轮投递结束后的等待时间
		status : 0,//0下降1持平2上升
		stat : {
			count : 0,
			one : 0,
			half:0,
			three:0,
			five:0,
			miss : 0,
			p : function(n){
				return (Math.round(n/(this.count||1) * 10000)/100) + '%';
			},
			stat : function(){
				var out=[],miss = "0x丢失率:" + this.p(this.miss);
				var half = "0.5x半率:" + this.p(this.half);
				var one = "1x倍率:" + this.p(this.one);
				var three = "3x倍率:" + this.p(this.three);
				var five = "5x倍率:" + this.p(this.five);
				out.push(miss);
				out.push(half);
				out.push(one);
				out.push(three);
				out.push(five);
				return out.join(",");
			}
		},
		p:function (){
			var inputNumValue= this.cost;
			var activitId=$("#gameActivitiesConfigureId").val();
			return 'http://vip.suning.com/pointGame/execute.do?dt=' + encodeURIComponent(bd.rst())+ '&inputNum=' +inputNumValue + '&gameActivitiesConfigureId=' + activitId;
		},
		alearn : autoLearning,
		control : function(){
			//学习调整
			this.alearn.learn(this.status);
			//跑十次
			if( this.count < this.min ){
				//noop
			}else{
				this.stop();
			}
		},
		run:function(){
			this.init();
			var that = this;
			this.timer=setInterval(function(){
					function process(data){
							that.account -= that.cost ;
							//console.info(that.count++,data.content||'no result');
							data && data.content && that.calc(data);
							data && data.content && that.control();
							if( !data || !data.content ){
								console.info(that.count,'----已掉线啦！');
							}
						}
					//
					//$.get(that.p(),process,'json');
					//simulate
					game.play(that.cost,process);
					game.totalaccount = that.totalaccount + that.account;
					game.$scope.$apply();
				}
			,this.delay);
		},
		init : function(){
			this.yund.init(this);
			this.alearn.init(this);
			if( window.localStorage.stat ){
				try{
					this.totalaccount = Math.round($("#myPointDrill").html()) || Math.round(window.localStorage.totalaccount) || 0 ;
					var stat = JSON.parse(window.localStorage.stat);
					if(stat.count != null){
						$.extend(this.stat,stat);
					}
				}catch(e){
					console.info(e);
				}
			}
		},
		queryTotal : function(callback){
			var that = this;
			var url = "http://vip.suning.com/ajax/user/getPoint.do?callback=callbackFun";
			$.jsonp(url,{'targetURL' : targetURL},function(data){
				callback.apply(that,[data.totalPoint]);
			},'callbackFun');
		},
		calc : function(data){
			var get = 0;
			var reg1 = /恭喜您获得(\d+)个云钻!/,m;
			var reg2 = /恭喜您,云钻x(\d+)倍,获得了(\d+)个云钻!/;
			var _3dstyle = "text-shadow: 0 1px 0 #fff,0 2px 0 #c9c9c9,0 3px 0 #bbb,0 4px 0 #b9b9b9,0 5px 0 #aaa,0 6px 1px rgba(0,0,0,.1),0 0 5px rgba(0,0,0,.1),0 1px 3px rgba(0,0,0,.3),0 3px 5px rgba(0,0,0,.2),0 5px 10px rgba(0,0,0,.25),0 10px 10px rgba(0,0,0,.2),0 20px 20px rgba(0,0,0,.15);font-size:5em;color:red;";
			if( m = reg1.exec(data.content)){
				get = Math.round(m[1]||0);
				if( get == this.cost ){
					this.stat.one ++;
				}else{
					this.stat.half ++;
				}
			}else if( m = reg2.exec(data.content)){
				get = Math.round(m[2]||0);
				var d = Math.round(m[1]||0);
				if( d == 3 ){
					this.stat.three ++;
				}else if( d == 5 ){
					this.stat.five ++;
				}
				console.info("%c恭喜您,云钻x%s倍,获得了%s个云钻!",_3dstyle,m[1],m[2]);
			}else{
				this.stat.miss ++;
			}
			this.stat.count ++;
			this.account += get;
			//本次投递的命中回归量或降或持平或升
			var getCount = this.getCount = get - this.cost;
			//本次投递状态,小于0为0，等于0为1，大于0为2
			this.status = ydstatus.getstatus(getCount);
			console.info(this.count++,data.content,"本次消费",this.cost,"个云钻,获得",get,"个云钻,本次总共获得",this.account,"历史总共",this.totalaccount + this.account,"云钻",this.stat.stat());
		},
		stop:function(){
			var that = this;
			this.totalaccount += this.account;
			this.account = 0;
			this.count = 0;
			clearInterval(this.timer);
			window.localStorage.totalaccount = this.totalaccount;
			window.localStorage.stat = JSON.stringify(this.stat);
			$("#myPointYun").html(this.totalaccount);
			if( this.totalaccount > this.keepacount ){
				var delay = this.wait;//this.min * 5000 + 10000;
				console.info("即将休息",delay/1000,"秒");
				this.timer1 = setTimeout(function(){
					that.run();
				},delay );
			}
		},
		destory:function(){
			//this.stop();
			this.alearn.destory(this);
			clearTimeout(this.timer1);
			clearInterval(this.timer);
		},
		render : function(){
			console.info("render now...");
			var btnstyle = 'margin-left:10px;color:#fff;background-color:#5bc0de;border-color:#46b8da;display:inline-block;padding:3px 12px;margin-bottom:0;font-size:14px;font-weight:400;line-height:1.42857143;text-align:center;white-space:nowrap;vertical-align:middle;-ms-touch-action:manipulation;touch-action:manipulation;cursor:pointer;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;background-image:none;border:1px solid transparent;border-radius:4px';
			var style = "text-align: center;margin-bottom: 20px;background-color: #fff;border: 1px solid transparent;border-radius: 4px;-webkit-box-shadow: 0 1px 1px rgba(0,0,0,.05);box-shadow: 0 1px 1px rgba(0,0,0,.05)";
			var intputstyle = "color:#555;background-color:#fff;background-image:none;border:1px solid #ccc;border-radius:4px;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,.075);box-shadow:inset 0 1px 1px rgba(0,0,0,.075);-webkit-transition:border-color ease-in-out .15s,-webkit-box-shadow ease-in-out .15s;-o-transition:border-color ease-in-out .15s,box-shadow ease-in-out .15s;transition:border-color ease-in-out .15s,box-shadow ease-in-out .15s"
			var that=this,html = "<div name='play' style='position:fixed;width:400px;height:50px;bottom:0px;z-index:2147483649;"+style+"'><input style='"+intputstyle+"'type='text' name='cost' /><input type='button' style='"+btnstyle+"' value='stop' name='stop'><input type='button' style='"+btnstyle+"' value='run' name='run'></div>";
			$(document.body).append(html);
			var playEl = $("[name=play]");
			$('[name=cost]').val(that.cost);
			$('[name=play]').css('top',(100)+'px')
			$('[name=play]').css('left',(window.innerWidth/2-playEl.width())+'px')
			$('[name=stop]').click(function(){
				that.destory()
			});
			$('[name=run]').click(function(){
				that.cost = Math.round($('[name=cost]').val() || 10);
				that.destory();
				that.run()
			});
		},
		dispose:function(){
			$("[name=play]").remove();
		},
		test : function(){
			this.init();
			for(var i = 0; i < 50; i ++){
				var r = new Date().getTime() * i % 3 - 1;
				//console.info(r);
				this.alearn.learn(r);
			}
		}
	}

	window.play = Play;

}());

$(function(){
	play.dispose();
	play.render();	
});

//Play.cost = 10;
//Play.run();
//Play.stop();
//console.log("%c3D Text"," text-shadow: 0 1px 0 #ccc,0 2px 0 #c9c9c9,0 3px 0 #bbb,0 4px 0 #b9b9b9,0 5px 0 #aaa,0 6px 1px rgba(0,0,0,.1),0 0 5px rgba(0,0,0,.1),0 1px 3px rgba(0,0,0,.3),0 3px 5px rgba(0,0,0,.2),0 5px 10px rgba(0,0,0,.25),0 10px 10px rgba(0,0,0,.2),0 20px 20px rgba(0,0,0,.15);font-size:5em")
//console.log('%cRainbow Text ', 'background-image:-webkit-gradient( linear, left top, right top, color-stop(0, #f22), color-stop(0.15, #f2f), color-stop(0.3, #22f), color-stop(0.45, #2ff), color-stop(0.6, #2f2),color-stop(0.75, #2f2), color-stop(0.9, #ff2), color-stop(1, #f22) );color:transparent;-webkit-background-clip: text;font-size:5em;');
(function(){
	
	console.info('voucher-reaper is working');
	//模块定义
    function define(packages,def){
        var pckgs = window,pko=null;
        var pnames = packages.match(/[^\.]+/g);
        for(var i = 0; i < pnames.length; i++){
            if(!pckgs[pnames[i]])
                pckgs[pnames[i]] = {};
            if( i == pnames.length - 1 ){
                pckgs[pnames[i]] = def || {};
            }
            pckgs = pckgs[pnames[i]];
        }
        return def;
    };
    function clazz(proto){
        var self = {};
        var methods = {};
        proto && proto.apply(self,[self,methods]);
        var clazz = $.extend(self,methods);
        return clazz;
    }
    //字符串格式化
    String.prototype.format = function(){
        var args = Array.prototype.slice.apply(arguments,[0]);
        var contents = this;
        $(args).each(function(i,map){
            contents = contents.replace(/\{([^}]+)\}/g,function(index,vel){
                var value = map[vel];
                return value == null ? '{'+vel+'}' : value ;
            });
        });
        return contents;
    };
    //数组延迟执行
    Number.prototype.each_delay = function(func,delay,over){
        var start = 0,end = self = this;
        var delay_is_func = typeof delay == 'function';
        self.i = start,self.tid = 0;
        self.next = function next(){
            this.exec();
        };
        self.exec = function exec(){
            var self = this;
            if( self.i < end ){
                var delay_i = delay_is_func ? delay(self.i) : delay;
                delay_i = delay_i == null ? 1000 : delay_i;
                self.tid = setTimeout(function(){
                    func(self.i++,self);
                }, delay_i );
            }else{
                clearTimeout(self.tid);
                over && over(self);
            }
        };
        self.exec();
    };
    function heredoc(func){
        return func.toString().split(/\n/).slice(1, -1).join('\n');
    }
    $.jsonp = function(url,data,success,error,callname,method,option){
        var params = {
            type: method||"GET",
            url: url,
            cache : false,
            async : false,
            data : data||{},
            dataType : "jsonp",
            jsonp : "callback",
            //jsonpCallback : callname,
            success: success || $.noop,
            error: error || $.noop
        };
        callname && (params.jsonpCallback = callname);
        $.ajax($.extend({},params,option||{}));
    };

    define('simple.task',clazz(function(self,methods){
        //setInterval
        //clearInterval
        function neww(task,delay){
            return {
                task : task,
                delay : delay,
                i : 0,
                run : function(){
                    var self = this;
                    this.stop();
                    console.info('simple.task is run');
                    this.tid = setInterval(function(){
                        self.task();
                    },this.delay||1000);
                },
                stop : function(){
                    if(this.tid){
                        var self = this;
                        clearInterval(this.tid);
                        console.info(self.i++,this.tid,'simple.task is stoped');
                    }
                }
            }
        }
        $.extend(methods,{
            neww : neww
        });
    }));

    define('voucher.reaper',clazz(function(self,methods){
        $.extend(self,{
            'service.state.url' : '//yzdh.suning.com/yzdh-web/voucher/ajax/getVoucherState.do?voucherIds={voucherIds}',
            'service.exchange.url' : '//yzdh.suning.com/yzdh-web/voucher/sendVoucher.do',
            voucherId : getVoucherStateByAuth.toString().match(/voucherId = '(\d+)';/)[1]||1000,
            html : heredoc(function(){/*
                <style>
                    [voucher-reaper]{position:fixed;bottom:10px;right:100px;}
                    [voucher-reaper] [btn]{    background: #f65252;
                        margin-left: 10px;cursor: pointer;
                        display: inline-block;width: 60px;
                        text-align: center;line-height: 25px;
                    }
                </style>
                <div voucher-reaper>
                    <span btn run>run</span><span btn stop>stop</span><span btn test>test</span>
                </div>
            */})
        });
        function refresh(){
            self.task.run();
        }
        
        function get_state(callback){
            var descs = {
                VOUCHER_1006 : '暂不能兑换',
                VOUCHER_1008 : '活动未开始',
                VOUCHER_1009 : '活动已结束',
                VOUCHER_1005 : '已兑换',
                VOUCHER_1003 : '今日已兑完',
                VOUCHER_1020 : '已兑完',
                VOUCHER_1014 : '等级不符'
            };
            $.get(self['service.state.url'].format({voucherIds:JSON.stringify([self.voucherId])}),function(data){
                var resultCode = data[0].voucherResultDto.resultCode;
                var exchangedTotal = data[0].exchangedTotal;
                var voucherDesc = descs[resultCode];
                console.info('[',new Date().toLocaleString(),']',self.voucherId,'status',voucherDesc);
                var vo = {
                    voucherName:'本场限量1000张',
                    voucherId:self.voucherId,voucherType:'1',storeName:'超市',
                    cloudValue:'5',costOffValue:'199',costOffValue:'199',
                    voucherValue:'120',storeLink:'https://chaoshi.suning.com/',actBegin:'true',startTime:'2017.06.14 00:00',
                    voucherDesc:voucherDesc,totalExchangedAmount:exchangedTotal,resultCode:resultCode,status:'1'
                };
                vo.totalExchangedAmount = data.exchangedTotal;
                var voucherStateTpl = template('voucherStateTemplate',vo);
                callback && callback(vo,data[0].voucherResultDto);

                $('.coupon-r').html(voucherStateTpl);
                // 已结束增加 is-end， 已获得增加 is-got,  未开始增加 is-wait
                if(resultCode=='VOUCHER_1009'){
                    $('.coupon-r').addClass('is-end');
                }else if(resultCode=='VOUCHER_1008'){
                    $('.coupon-r').addClass('is-wait');
                }else if(resultCode!='0'){
                    $('.coupon-r').addClass('is-got');
                }
            });
        }

        function exchange(vo,callback){
            var url = self['service.exchange.url'];
            var params = {
                voucherId: vo.voucherId,
                voucherType: vo.voucherType,
                couponGetSource: getTerminalType(),
                sliderToken: vo.sliderToken,
                smsCode: vo.smsCode,
                "X-CSRF-TOKEN": csrftoken,
                detect: encodeURIComponent(bd.rst())
            };
            $.jsonp(url,params,function(o){
                var m = "hehe";
                switch (o.resultCode) {
                    case "0":
                        m = "小狮子恭喜你，获得一张优惠券哦～";break;
                    case "VOUCHER_1001":
                        m = "兑换失败，V1及以上会员才能参与活动<br/>有一笔10元以上的实物交易就能升级为V1会员";break;
                    case "VOUCHER_1002":
                    case "VOUCHER_1007":
                        m = "云钻余额不足啦，先去赚云钻吧～";break;
                    case "VOUCHER_1003":
                    case "VOUCHER_1011":
                    case "VOUCHER_1020":
                        m = "唉，手太慢，券已兑完了，看看其它好券吧～";break;
                    case "VOUCHER_1016":
                    case "VOUCHER_1004":
                        m = "券还不能兑换哦，先看看其它好券吧～";break;
                    case "VOUCHER_1005":
                        m = "已经兑换过啦，快去使用吧～";break;
                    case "VOUCHER_1015":
                        m = "别贪心哦，已经兑换过同类型的券啦～";break;
                    case "VOUCHER_1006":
                    case "VOUCHER_1010":
                        m = "券还不能兑换哦，先看看其它好券吧～";break;
                    case "VOUCHER_1008":
                        m = "别心急，活动还未开始，先看看其它好券吧～";break;
                    case "VOUCHER_1009":
                        m = "来迟啦，活动已结束，看看其它好券吧～";break;
                    case "VOUCHER_1014":
                        m = "兑换失败，因为等级不符合要求，想哭～";break;
                    case "VOUCHER_1012":
                        m = "要滑动验证";break;
                    case "VOUCHER_1013":
                    case "VOUCHER_1019":
                        m = "兑换失败，因为账户不符合要求，想哭～";break;
                    case "VOUCHER_1017":
                    case "VOUCHER_1023":
                        m = "为了你的账户安全，小狮子建议绑定手机呢～";break;
                    case "VOUCHER_1021":
                        m = "要验证码";break;
                    case "VOUCHER_1024":
                        m = "验证码错误";break;
                    case "VOUCHER_1025":
                        m = "错误次数过多，请重新获取！";break;
                    case "VOUCHER_9997":
                    case "VOUCHER_9998":
                    case "VOUCHER_9999":
                        m = "小狮子正在奔跑中，稍后再试吧～";break;
                    default:
                        break
                }
                console.info('[',new Date().toLocaleString(),']',self.voucherId,vo.voucherType,m);
                o.m = m;
                callback && callback(o);

            },function(){
                console.info(self.voucherId,vo.voucherType,"error");
            },'callbackSendVoucherFun');
        }

        function initialize(){
            function task(){
                get_state(function(vo,data){
                    if( data.resultCode == '0' ){
                        console.info('[',new Date().toLocaleString(),']',self.voucherId,'task','可以开搞拉');
                        !self.success && exchange(vo,function(json){
                            console.info('exchange',json);
                            if( json.resultCode == "0" ){
                                console.info('[',new Date().toLocaleString(),']',self.voucherId,'exchange','------------搞到拉');
                                self.success = true;
                            }
                        });
                    }
                });
            }
            self.task = simple.task.neww(task,1000),
            console.info('voucherId:',self.voucherId);
            $('body').append(self.html);
            $(document).on('click','[run]',function(){
                self.task.run();
            })
            $(document).on('click','[stop]',function(){
                self.task.stop();
            })
            $(document).on('click','[test]',function(){
                task()
            })
        }

        $.extend(methods,{
            refresh : refresh,
            initialize : initialize
        });
    }));

    $(function(){
        voucher.reaper.initialize();

    });
}());
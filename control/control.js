var msg,log;
var control={
	'socket': null,
	'tested': -1,
	'usePos': null,
	'goUsePos': null,
	'reverse': 0,
	'listenFunc': null,
	'connect': function(code){
		var _=this;
		var socket=new WebSocket('ws://192.168.1.9:5555/'+code,'control');
		socket.addEventListener('open',function(){
			_.initControl();
		});
		socket.addEventListener('close',function(ev){
			msg.textContent='與伺服器連線已關閉，狀態碼：'+ev.code;
			window.removeEventListener('deviceorientation', _.listenFunc);
		});
		socket.addEventListener('message',function(data){
			msg.textContent=data.data;
		});
		socket.addEventListener('error',function(error){
			msg.textContent=error;
		});
		this.socket=socket;
	},
	'initControl': function(){
		var _=this;
		this.listenFunc=function(ev){
			if(_.tested){
				_.test(ev.gamma,ev.beta);
			}else{
				//_.update(ev[_.usePos]*_.reverse,Math.max(0,ev[_.usePos]*_.reverse));
				_.update(ev[_.usePos]*_.reverse,ev[_.goUsePos]*_.reverse);
			}
		}
		window.addEventListener('deviceorientation', this.listenFunc, false);
		this.test();
	},
	'test': function(lr,fb){
		switch(this.tested){
			case -1:
				msg.textContent='請將手機保持平行';
				this.tested=3;
			break;
			case 3:
				var abs_lr=Math.abs(lr);
				var abs_fb=Math.abs(fb);
				if(abs_lr<3 && abs_fb<3){
					msg.textContent='請將手機向左頃斜';
					this.tested--;
				}
			break;
			case 2:
				var abs_lr=Math.abs(lr);
				var abs_fb=Math.abs(fb);
				if(abs_lr<10 && abs_fb<10) return;
				if(abs_lr>abs_fb){
					this.usePos='gamma';
					this.goUsePos='beta';
					this.reverse=(lr>0)? -1:1;
				}else{
					this.usePos='beta';
					this.goUsePos='gamma';
					this.reverse=(fb>0)? -1:1;
				}
				this.tested--;
				msg.textContent='請將手機向右頃斜';
			break;
			case 1:
				var abs_lr=Math.abs(lr);
				var abs_fb=Math.abs(fb);
				if(abs_lr<10 && abs_fb<10) return;
				if(abs_lr>abs_fb && this.usePos=='gamma'){
					if(!(this.reverse===1 ^ lr<0)) return;
				}else if(this.usePos=='beta'){
					if(!(this.reverse===1 ^ fb<0)) return;
				}else{
					return;
				}
				this.tested--;
				//msg.textContent='等待遊戲開始';
				//$('.notice').toggle();
			break;
		}
	},
	'update': function(lr,go){
		lr=Math.floor(lr*10);
		go=Math.floor(go*10);
		msg.textContent=lr+','+go
		this.socket.send(JSON.stringify({'action': 'move','lrAmount': lr,'goAmount':go}));
	},
	'fire': function(){
		this.socket.send(JSON.stringify({'action': 'fire'}));
	}
};
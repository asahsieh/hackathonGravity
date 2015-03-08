var viewer={
	'socket': null,
	'players': new Map(),
	'init': function(){
		var _=this;
		var socket=this.socket=new WebSocket('ws://192.168.1.9:5555','view');
		socket.addEventListener('open',function(){
			console.log('connected');
		});
		socket.addEventListener('close',function(ev){
			console.log('close code: %d',ev.code);
		});
		socket.addEventListener('message',function(data){
			_.parseCmd(data);
		});
		socket.addEventListener('error',function(error){
			console.log(error);
		});
	},
	'parseCmd': function(data){
		try{
			var data=JSON.parse(data.data);
		}catch(e){
			console.error(e);
		}
		switch(data.action){
			case 'code':
				console.log(data.code);
			break;
			case 'join':
				var color=Math.floor(Math.random()*Math.pow(256,3)).toString(16);
				while(color.length<6){
					color='0'+color;
				}
				this.players.set(
					data.player,
					new Q.Ship(
						{ x: Math.random()*Q.width, y: Math.random()*Q.height},
						'#'+color
					)
				);
			break;
			case 'move':
				var player=this.players.get(data.player);
				player.trigger('up',data.goAmount);
				var lrAmount=data.lrAmount;
				if(lrAmount!==0)
					player.trigger('lr',lrAmount);
			break;
			case 'fire':
				this.players.get(data.player).trigger('fire');
			break;
			case 'close':
				this.players.get(data.player).destroy();
				this.players.delete(data.player)
			break;
		}
	},
	'start': function(){
		//this.parseCmd({data:JSON.stringify({'action':'join','player':'xd'})});
		Q.stageScene("game");
	}
};
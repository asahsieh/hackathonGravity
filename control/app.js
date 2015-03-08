$().ready(function(){
  msg=document.getElementById('noticeText');
	log=document.getElementById('log');
	document.getElementById('verCodeForm').addEventListener('submit',function(e){
		e.preventDefault();
	    $('#verCodeForm').toggle();
	    $('.controllView').toggle();
		control.connect(document.getElementById('verCode').value);
	});
	document.getElementById('imgLogo').addEventListener('click',function(e){
		if(control.tested) return;
		control.fire();
	});
});
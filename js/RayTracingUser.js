var canv,ctx,file;
$(document).ready(function(){
	// canv=$('#canv')[0];
	// ctx=canv.getContext('2d');
	// file=$('#file')[0];
	let l=window.innerWidth>window.innerHeight?window.innerHeight:window.innerWidth;
	$('#objlayer').width(l);
	$('#objlayer').height(l);
	startRendering();
})
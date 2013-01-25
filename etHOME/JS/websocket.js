var sock = io.connect('http://192.168.0.12:8000/')

sock.on('echo',function(data){
	console.log(data)
	console.log("hello")
	lightcontrolpanel.setlightdata(lightcontrolpanel.getindexwithid("k0"), data)
});

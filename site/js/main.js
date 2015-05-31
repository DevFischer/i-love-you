//this is to figure out later on if the source of a realtime message came from this browser instance. the timestamp / random number combo is to minimize  UID conflicts.
var current_timestamp = Math.floor(Date.now() / 1000).toString();
var random_number = Math.floor(Math.random() * 1000000000).toString();
var identifier = current_timestamp + "" + random_number;

var audio = {
	submarine: new Audio('/sounds/submarine.mp3'),
	hero: new Audio('/sounds/hero.mp3')
};

//TODO - this can all be done with canvas and we would probably see much better performance.

//simple function. cut off the first 1/10th of a second from the audio file to make rapid playing sound good.
//also, if the ripple is "mine" i.e. this user triggered the ripple, format it differently.
var ripple = function(mine){
	audio.hero.currentTime = 0.1;
	audio.hero.play();

	var el = document.createElement("div");
	el.classList.add("ripple");

	if(mine){
		el.classList.add("mine");
	}

	document.querySelector("#ripples").appendChild(el);
}

//simple FAYE code
// var client = new Faye.Client("http://localhost:8123");
var client = new Faye.Client("http://cosmic-nfrmn.rhcloud.com:8000");
client.subscribe("/room1", function(message){
	//we are already providing instant response to the user when they click a heart, so we want to disregard the message from the server if it is that same user.
	if(message.sender !== identifier){
		ripple(false);
	}
});

var heart = document.querySelector("#heart");
heart.addEventListener("click", function(e){
	client.publish('/room1', {sender: identifier});

	ripple(true);
});
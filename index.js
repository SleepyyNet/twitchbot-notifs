let jsf = require("jsonfile");
let req = require("request");
let discord = require("discord.js");
let bot = new discord.Client();
let config = require("./config");
let path = require("path");
let fE = require("lodash.foreach");
var to;
/**
 * @type {Array<string>}
 */
let p = config.notifPath;
let not = path.join(__dirname,p.join(path.sep));
console.log(not);
let notifs = {
	stre: {},
	r: ()=>this.stre = jsf.readFileSync(not),
	w: ()=>jsf.writeFileSync(not,this.stre)
};
function splitObjectIntoChunks(obj){
	var keylist = []
	var ks = Object.keys(obj);
    var chunkCount = Math.ceil(ks.length/100)
    for(var i = 0; i < chunkCount; i++){
        keylist.push(ks.splice(0, 100))
	}
    return keylist;
}
/**
 * @param {string} msg 
 */
function somethingWentWrong(msg){
	var r = req("https://canary.discordapp.com/api/webhooks/439168005981732876/"
	+"LiVgbdAxojV1z-A1zFjteyH9UsAX3clZcIfcZ6AlXvI26E9ebSNYlfc2jJTCdrXqmbPX",
	{method:"POST",body:{content:msg},json:true});
	if (r.response.statusCode > 299) console.error("trigger returned a bad time my dude");
}
//better than poll or poll2
//because it's made by me
//jk lmao
function poll3(){
	notifs.r();
	let change = {};
	let o = Object.keys(change).length;
	let i=0;
	var {ks,cl} = splitObjectIntoChunks(notifs.stre);
	fE(ks,async (chunk)=>{
		if (chunk.length<1) return;
		var strdata = req("https://api.twitch.tv/helix/streams?",{headers:config.headers,json:true});
		if (strdata.body.data.length<1){
			somethingWentWrong(`Notif request from Sanaespacito returned non 2xx status code: ${strdata.response.statusCode}\n\`\`\`json\n${strdata.body}\n\`\`\``);
			return;
		}
	});
	while(o != i){}
	Object.assign(notifs.stre,change)
	notifs.w();
}
process.on("SIGINT",()=>{
	clearInterval(to);
	bot.destroy().catch(()=>{});
})
bot.login(config.token);
bot.on("ready",()=>{
	console.log("S o  w e  d i d  i t  g u y s");
	(async ()=>{
		/**
		 * @type {discord.TextChannel}
		 */
		let channel = bot.guilds.get("294215057129340938").channels.get("395602291874594816");
		channel.send("<@201745963394531328> i hit that mf yeet");
	})()
	to = setInterval(poll3,30000);
});

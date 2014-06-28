!function(a,b){if(void 0===b[a]){b["_"+a]={},b[a]=function(c){b["_"+a].clients=b["_"+a].clients||{},b["_"+a].clients[c.projectId]=this,this._config=c},b[a].ready=function(c){b["_"+a].ready=b["_"+a].ready||[],b["_"+a].ready.push(c)};for(var c=["addEvent","setGlobalProperties","trackExternalLink","on"],d=0;d<c.length;d++){var e=c[d],f=function(a){return function(){return this["_"+a]=this["_"+a]||[],this["_"+a].push(arguments),this}};b[a].prototype[e]=f(e)}var g=document.createElement("script");g.type="text/javascript",g.async=!0,g.src="https://d26b395fwzu5fz.cloudfront.net/3.0.0/keen.min.js";var h=document.getElementsByTagName("script")[0];h.parentNode.insertBefore(g,h)}}("Keen",this);

var client = new Keen({
    projectId: "53ada955d97b856731000004",
    writeKey: "89244b7a7d67e1ce42871b5ef199cb02343ab58a58fe6f8d527d09698bd488412619e306f0b57fc819e271fb6301f1fc92115ca084ea55f32f678401bbcdde535b91fb550ed967cb201e29e5f3cada57ce10fd344f1225ca43461dd0afc117fb156645a6233dd88a366876bc611db6fd",
    readKey: "2af45cd13e1dab55e5403c8fa1d2d2a1263ad93683f3bcd93e7fe8db768f70657d74c0ca1ba6f9a8ab686d511a79b2256caacde681a731a18941eff2924232fc8d12dfdf972db3e5245e08a56f99664fe05ad28ba47a5dd4ce3ad818bcaa9afe680c3876e61656914906e71b1259bf61"
}); 

var visit = {
    referrer: document.referrer,
    page: window.location.href,
    agent: window.navigator.userAgent,
    platform: window.navigator.platform,
    keen: {
        timestamp: new Date().toISOString()
    }
};

client.addEvent("visits", visit);

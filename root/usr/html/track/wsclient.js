var ws,cnv, ctx;
var xcor,ycor;
var pensize=2;
var color='white';
var datastr = '';
var sock;

function setup(){
  cnv = document.getElementById('cnv');
  cnv.width = 800;
  cnv.height = 600;
  ctx = cnv.getContext('2d');
  ctx.fillStyle = 'black';
  ctx.fillRect(0,0,800,600);
  ctx.strokeStyle = color;
  ctx.font = '20px sans-serif'
  sock = "ws:"+location.host+"/wstrack";
  ws = new WebSocket(sock);
  //ws = new WebSocket('ws:www.micrologo.net/wstrack');
  ws.onmessage = function(e){handleData(e.data);}
  erase();
}

function handleData(str){
  datastr+=str;
  if(datastr[datastr.length-1]!='\n') return;
  handleCommands(datastr);
  datastr = '';
}

function handleCommands(str){
  var cmds = str.split('\n');
  cmds.pop();
  for(var i in cmds) handleCommand(cmds[i]);
}

function handleCommand(str){
//  console.log(str.length, str);
  var l = str.split(' ');
  var cmd = l[0];
  if(cmd=='m') moveto(l[1],l[2]);
  else if(cmd=='l') lineto(l[1],l[2]);
  else if(cmd=='r') rect(l[1],l[2],l[3],l[4],l[5]);
  else if(cmd=='s') pensize=l[1];
  else if(cmd=='t') drawstring(l[1],l[2],l[3]);
  else if(cmd=='c') color=l[1];
  else if(cmd=='e') erase();
  else if(cmd=='pp') placepic(l[1], l[2], l[3]);
} 

function moveto(x,y){
  xcor = x;
  ycor = y;
}

function lineto(x,y){
  ctx.lineWidth = pensize;
  ctx.strokeStyle = color;
  ctx.beginPath();  
  ctx.moveTo(xcor, ycor);
  ctx.lineTo(x, y);
  ctx.stroke();
  xcor = x;
  ycor = y;
}

function rect(c,x,y,w,h){
  ctx.fillStyle = c; 
  ctx.fillRect(x,y,w,h);
}

function drawstring(x,y, str){
  ctx.fillStyle = color;
  ctx.fillText(str, x, y)
}

function erase(){
  ctx.fillStyle = 'black';
  ctx.fillRect(0,0,800,600);
  var img = new Image();
  img.src = "earth_800.png";
  if(!img.complete)img.onload =function(){ctx.drawImage(img, 0, 100);};
  else ctx.drawImage(img, 0, 100);
}


function placepic(x, y, png){
  console.log(x,y,png.length);
  var img = new Image();
  img.src = "data:image/png;base64,"+png;
  if(!img.complete)img.onload =function(){ctx.drawImage(img, x, y);};
  else ctx.drawImage(img, x, y);
}

function resett(){t0 = Date.now();}
function timer(){return Date.now()-t0;}


// =====================================
// GLOBAL VARIABLES
// =====================================


let running = false;

let telemetry = [];

let packetNumber = 0;

let stream;





// =====================================
// CHART DATA
// =====================================


let timeData = [];

let altitudeData = [];

let temperatureData = [];

let pressureData = [];

let descentData = [];

let voltageData = [];


// ===============================
// COMMON GRAPH SETTINGS
// ===============================
// ===============================
// COMMON GRAPH SETTINGS
// ===============================

const graphOptions = {


responsive:true,


maintainAspectRatio:false,


animation:false,


plugins:{


legend:{


display:true,


position:"top"


}



},



scales:{


x:{


display:true,


title:{


display:true,


text:"Time (seconds)"

},


ticks:{


display:true


}



},



y:{


display:true,


title:{


display:true,


text:"Value"


},


ticks:{


display:true


}



}



}


};

// =====================================
// CHART CREATION
// =====================================


let altitudeChart =
new Chart(
document.getElementById("altitudeChart"),
{

type:"line",

data:{

labels:timeData,

datasets:[{

label:"Altitude (m)",

data:altitudeData,

borderColor:"cyan",

tension:0.3

}]

},


options:graphOptions

});






let temperatureChart =
new Chart(
document.getElementById("temperatureChart"),
{

type:"line",

data:{

labels:timeData,

datasets:[{

label:"Temperature °C",

data:temperatureData,

borderColor:"orange",

tension:0.3

}]

},

options:graphOptions

});







let pressureChart =
new Chart(
document.getElementById("pressureChart"),
{

type:"line",

data:{

labels:timeData,

datasets:[{

label:"Pressure hPa",

data:pressureData,

borderColor:"yellow",

tension:0.3

}]

},

options:graphOptions

});







let descentChart =
new Chart(
document.getElementById("descentChart"),
{

type:"line",

data:{

labels:timeData,

datasets:[{

label:"Descent Rate m/s",

data:descentData,

borderColor:"red",

tension:0.3

}]

},

options:graphOptions

});







let voltageChart =
new Chart(
document.getElementById("voltageChart"),
{

type:"line",

data:{

labels:timeData,

datasets:[{

label:"Battery Voltage",

data:voltageData,

borderColor:"lime",

tension:0.3

}]

},

options:graphOptions

});








// =====================================
// TELEMETRY CONTROL
// =====================================


function startTelemetry(){


running=true;


document.getElementById(
"missionStatus"
).innerHTML="ACTIVE";


}






function stopTelemetry(){


running=false;


document.getElementById(
"missionStatus"
).innerHTML="STOPPED";


}









// =====================================
// TELEMETRY SIMULATION
// =====================================



setInterval(()=>{


if(!running)

return;



let data={


time:new Date(),


altitude:
Math.random()*500,


temperature:
20+Math.random()*10,


pressure:
900+Math.random()*100,


voltage:
11+Math.random(),



descentRate:
Math.random()*12,



roll:
Math.random()*60-30,


pitch:
Math.random()*60-30,


yaw:
Math.random()*360



};





telemetry.push(data);



updateDashboard(data);


updateGraphs(data);


checkErrors(data);



},1000);











// =====================================
// UPDATE TELEMETRY VALUES
// =====================================


function updateDashboard(d){



document.getElementById(
"altitude"
).innerHTML=
d.altitude.toFixed(2);




document.getElementById(
"temperature"
).innerHTML=
d.temperature.toFixed(2);




document.getElementById(
"pressure"
).innerHTML=
d.pressure.toFixed(2);




document.getElementById(
"voltage"
).innerHTML=
d.voltage.toFixed(2);




document.getElementById(
"descentRate"
).innerHTML=
d.descentRate.toFixed(2);




document.getElementById(
"roll"
).innerHTML=
d.roll.toFixed(1);




document.getElementById(
"pitch"
).innerHTML=
d.pitch.toFixed(1);




document.getElementById(
"yaw"
).innerHTML=
d.yaw.toFixed(1);





// orientation


document.getElementById(
"horizon"
).style.transform=

`
rotate(${d.roll}deg)
translateY(${d.pitch}px)
`;





// packet table


packetNumber++;


let table =
document.getElementById(
"packetTable"
);



let row =
table.insertRow(1);



row.innerHTML=

`

<td>${packetNumber}</td>

<td>${d.altitude.toFixed(1)}</td>

<td>${d.temperature.toFixed(1)}</td>

<td>${d.voltage.toFixed(2)}</td>

<td>${document.getElementById("errorCode").innerHTML}</td>

`;



}









// =====================================
// LIVE GRAPH UPDATE
// =====================================


function updateGraphs(data){



let time =
new Date()
.toLocaleTimeString();



timeData.push(time);



altitudeData.push(
data.altitude
);



temperatureData.push(
data.temperature
);



pressureData.push(
data.pressure
);



descentData.push(
data.descentRate
);



voltageData.push(
data.voltage
);





if(timeData.length>20){


timeData.shift();


altitudeData.shift();


temperatureData.shift();


pressureData.shift();


descentData.shift();


voltageData.shift();



}




altitudeChart.update();

temperatureChart.update();

pressureChart.update();

descentChart.update();

voltageChart.update();



}









// =====================================
// ERROR CODE SYSTEM
// =====================================


function checkErrors(data){


let error="";



// Digit 1
// Descent Rate


if(
data.descentRate>=8 &&
data.descentRate<=10
)

error+="0";

else

error+="1";




// Digit 2 GPS


let gps=true;


if(gps)

error+="0";

else

error+="1";




// Digit 3 Separation


let separation=true;


if(separation)

error+="0";

else

error+="1";




// Digit 4 Parachute


let parachute=false;


if(parachute)

error+="1";

else

error+="0";





let box =
document.getElementById(
"errorCode"
);



box.innerHTML=error;



if(error=="0000")

box.style.color="lime";

else

box.style.color="red";



}









// =====================================
// MISSION COMMANDS
// =====================================


function separatePayload(){


document.getElementById(
"missionCommand"
).innerHTML=

"PAYLOAD SEPARATED SUCCESSFULLY";


}





function deployParachute(){


document.getElementById(
"missionCommand"
).innerHTML=

"EMERGENCY PARACHUTE DEPLOYED";


}





function activateBackup(){


document.getElementById(
"missionCommand"
).innerHTML=

"REDUNDANT SYSTEM ACTIVATED";


}









// =====================================
// CSV EXPORT
// =====================================


function exportCSV(){



let csv=

"Altitude,Temperature,Pressure,Voltage\n";



telemetry.forEach(d=>{


csv+=

`${d.altitude},${d.temperature},${d.pressure},${d.voltage}\n`;



});



let blob =
new Blob([csv]);



let a =
document.createElement("a");



a.href =
URL.createObjectURL(blob);



a.download =
"CanSat_Telemetry.csv";



a.click();



}









// =====================================
// GRAPH EXPORT
// =====================================


function exportGraph(){


let image =
altitudeChart.toBase64Image();



let a =
document.createElement("a");



a.href=image;



a.download=
"Altitude_Graph.png";



a.click();



}









// =====================================
// TIME SYNC RESET
// =====================================


function syncTime(){


alert(
"PC Time Synchronised"
);


}






function resetPacket(){


telemetry=[];

packetNumber=0;


timeData=[];

altitudeData=[];

temperatureData=[];

pressureData=[];

descentData=[];

voltageData=[];



altitudeChart.update();

temperatureChart.update();

pressureChart.update();

descentChart.update();

voltageChart.update();



document.getElementById(
"packetTable"
).innerHTML=

`

<tr>

<th>Packet</th>

<th>Altitude</th>

<th>Temperature</th>

<th>Voltage</th>

<th>Error</th>

</tr>

`;



alert(
"Packet Reset Complete"
);


}









// =====================================
// MAP
// =====================================



let map =
L.map('map')
.setView(
[22.57,88.36],
10
);



L.tileLayer(

'https://tile.openstreetmap.org/{z}/{x}/{y}.png'

).addTo(map);




let marker =
L.marker(
[22.57,88.36]
)
.addTo(map);





setInterval(()=>{


let lat =
22.57+
(Math.random()-0.5)/100;



let lon =
88.36+
(Math.random()-0.5)/100;




marker.setLatLng(
[
lat,
lon
]
);



map.panTo(
[
lat,
lon
]
);



},3000);









// =====================================
// CAMERA
// =====================================


async function startCamera(){


stream =

await navigator.mediaDevices.getUserMedia(
{

video:true

}

);



document.getElementById(
"video"
).srcObject=stream;



}






function stopCamera(){


if(stream)

stream.getTracks()
.forEach(
track=>track.stop()
);



}
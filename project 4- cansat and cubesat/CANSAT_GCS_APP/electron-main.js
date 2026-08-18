const { app, BrowserWindow } = require("electron");


function createWindow(){

    const window = new BrowserWindow({

        width:1400,

        height:900,

        webPreferences:{
            contextIsolation:true
        }

    });


    window.loadFile("index.html");

}


app.whenReady().then(()=>{

    createWindow();

});
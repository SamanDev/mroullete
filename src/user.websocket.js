
import eventBus from "./eventBus";

var ws = null;
var timerId;
function isJson(str) {
    // alert("str00 = "+str)
    try {
        JSON.parse(str);
    } catch (e) {
        // alert('no JSON')
        return false;
    }
    // alert('yes JSON')
    return true;
}
class UserWebsocket {
    connect(WEB_URL, _auth) {
      
        if (ws == null && !isJson(WEB_URL)) {
            ws = new WebSocket(WEB_URL, _auth);

            ws.onopen = function live() {
               
                clearInterval(timerId);
                timerId = setInterval(() => {
                    try {
                        const payLoad = {
                            method: "ping",
                
                        };
                        try {
                            ws.send(JSON.stringify(payLoad));
                        } catch (error) {
                            clearInterval(timerId);
                        }
                    } catch (error) {
                        clearInterval(timerId);
                    }
                }, 15000);
                console.log("WebSocket connected");
                // console.log("Socket is connected.");
            };
            ws.onmessage = (event) => {
                const data = JSON.parse(event.data); // Parse kardan JSON daryafti
                //console.log("Game data received: ", data);
             // console.log(data);
              
                    eventBus.dispatch(data.method, data);
               
                
                
            };
            
            // Event onclose baraye vaghti ke websocket baste mishe
            ws.onclose = () => {
                clearInterval(timerId);
                eventBus.dispatch("close");
            };
          
            ws.onerror = function () {
                clearInterval(timerId);
                eventBus.dispatch("close");
            };
        } else {
            if(isJson(WEB_URL)){
                try {
                    ws.send(WEB_URL);
                } catch (error) {}
            }
           
        }
       
        // Event onmessage baraye daryaft data az server
       
    }
  
    
}

export default new UserWebsocket();

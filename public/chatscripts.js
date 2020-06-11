let name,email,me;
let socket = io.connect('http://localhost:5000/');

function windowonLoad(myemail) {
    me=myemail;
    socket.emit('connectsocket', {
        'email' : me
    });
}
function getMessages(n,e) {
    email=e;
    name=n;
    document.getElementById('selectedUser').innerText = n;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            messages = JSON.parse(this.responseText);
            loopMessages(messages);
        }
    };
    xhttp.open("GET", "/chat/get?first="+e+"&second="+me, true);
    xhttp.send();
}

function loopMessages(messages) {
    document.getElementById('displayArea').innerHTML = "";
    document.getElementById(email+"badge").innerText = "";
    for(var i=0;i<messages.length;i++) {
        message=messages[i];
        addMessage(message.from, message.to, message.message);
    }
}
function addMessage(from,to,message) {
    let displayArea = document.getElementById('displayArea');
    displayArea.scrollTop = displayArea.scrollHeight;
    if(from  == me)
        displayArea.innerHTML += "<p style='float:right;'><span>"+message+"</span></p><br><br>";
    else
    displayArea.innerHTML += "<p style='float:left;'><span>"+message+"</span></p><br><br>";
}


function sendMessage() {
    console.log(email);
    let message = document.getElementById('chatbox').value;
    document.getElementById('chatbox').value = "";
    addMessage(me,email,message);
    socket.emit('chat', {
        'from' : me,
        'to' : email,
        'message' : message
    });
}

socket.on('chat',(data)=>{
    console.log(data);
    if(data.from == email)
        addMessage(data.from,data.to,data.message);
    else{
        let val = document.getElementById(data.from+"badge").innerText;
        if(val == "") val = "0";
        val = parseInt(val);
        val++;
        document.getElementById(data.from+"badge").innerText = val;
    }
});

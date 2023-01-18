import {getAll} from "./backend";
import endpoints from "./system/constants/endpoints.js";
import {getHeaders} from "./system/utilities.js";
import Secure from "./system/secureLs.js";

if(!Secure.getToken()){
    window.location.href = "login.html"
}
document.addEventListener("DOMContentLoaded", () => {
    let blogCount = document.getElementById('blogCount')
    let messageCount = document.getElementById('messageCount')
    let newMessageCount = document.getElementById('newMessageCount')
    let messagesContainer = document.getElementById('messageContainer')
    let messageClone = document.getElementById('messageClone')


    function addMessage(message){

        let messageView = messageClone.cloneNode(true)
        messageView.id = message._id
        messageView.querySelector("#names").textContent = message.names;
        messageView.querySelector("#email").textContent = message.email;
        messageView.querySelector("#message").textContent = message.message;


        messagesContainer.append(messageView)
    }


    getAll(endpoints.BLOGS).then(results => {
        blogCount.textContent = results?.length +"" || "";
    })
    getAll(endpoints.MESSAGES, getHeaders()).then(results => {
        messageCount.textContent = results?.length +"" || "";
        newMessageCount.textContent = results?.length +"" || "";

        results?.forEach(each => {
            addMessage(each);
        });

    })












})
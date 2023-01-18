import {checkValidation, setAttributes, validate, patters} from "./validation.js";
import endpoints from "./../system/constants/endpoints.js";
import Keys from "../system/constants/keys.js";
import Secure from "../system/secureLs.js";
import Constants from "./../system/constants/index.js";

if(Secure.getToken()){
    window.location.href = "dashboard.html"
}
document.addEventListener('DOMContentLoaded', ()=> {
    const form = document.getElementById("login_form");

    let fields = [
        {
            name:'email',
            field: 'email_field',
            error: 'email_error',
            conditions:[
                {
                    name:'required',
                    value: true,
                },
                {
                    name: 'pattern',
                    value: patters.email
                }
            ]
        },
        {
            name:'password',
            field:"password_field",
            error:"password_error",
            conditions:[
                {
                    name:'required',
                    value: true,
                },
                {
                    name: 'pattern',
                    value: patters.password,
                    message:"enter valid password",
                    details:[
                        {name:'pattern', value:patters.uppercase, message:'at least 1 uppercase required'},
                        {name:'pattern', value:patters.lowercase, message:'at least 1 lower required'},
                        {name:'pattern', value:patters.digit, message:'at least 1 digit required'},
                        {name:'pattern', value:patters.specialCharacter, message:'at least 1 special character required'},
                        {name:'minlength', value:8, message:'at least 8 characters required'},
                    ]
                }
            ]
        },
    ]

    fields.forEach(eachField => {
        setAttributes(eachField)
        validate(eachField)

    })
    form.addEventListener("submit", (event) => {
        // if the email field is valid, we let the form submit
        let formData = new FormData(event.target)
        let isFormValid = checkValidation(fields)
        event.preventDefault();
        if(!isFormValid){

        }else {
            let data = {}
            for(let each of formData){
                data[each[0]] = each[1]
            }
            axios
                .post(`${Constants.DEFAULT_API}${endpoints.LOGIN}`, data)
                .then(response => {
                    console.log("response", response);
                    const {
                        data: { token, data },
                    } = response;
                    // setProfile({ ...user });
                    Secure.setToken(token);
                    Secure.set(Keys.USER_INFO, { token, data });
                    window.location.href = "dashboard.html";
                }).catch(error => {
                console.error(error)
                swal("Something went wrong!",`${error.message}`, "error");
            })
        }
    });









})
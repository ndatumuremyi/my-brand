import {checkValidation, setAttributes, validate, patters} from "./validation.js";
import {add} from "../backend";
import endpoints from "./../system/constants/endpoints.js";
document.addEventListener('DOMContentLoaded', ()=> {
    const form = document.getElementById("contact_form");

    let fields = [
        {
            name:'names',
            field:"names_field",
            error:"names_error",
            conditions:[
                {
                    name:'required',
                    value: true
                },
                {
                    name:'minlength',
                    value:3,
                },
                {
                    name:'maxlength',
                    value:25,
                }
            ]
        },
        {
            name:'email',
            field: 'email_field',
            error: 'email_error',
            conditions:[
                {
                    name:'required',
                    value: true
                },
                {
                    name:'pattern',
                    value:patters.email,
                }
            ]
        },
        {
            name:'message',
            field:"description_field",
            error:"description_error",
            conditions:[
                {
                    name:'required',
                    value: true
                },
                {
                    name:'minlength',
                    value:5,
                },
                {
                    name: "maxlength",
                    value: 70
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
        event.preventDefault();

        let isFormValid = checkValidation(fields)
        if(!isFormValid){
            return;
        }
        let formData = new FormData(event.target)
        let message = {}
        for(let each of formData){
            message[each[0]] = each[1]
        }
        add(`${endpoints.MESSAGES}`, message).then(result => {
            console.log(result)
            swal("Message received!",`we will reach to you soon`, "success");

        }).catch(error => {
            swal("Something went wrong!",`${error.message}`, "error");
        })
    });








})
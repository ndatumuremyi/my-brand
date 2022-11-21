import {checkValidation, setAttributes, validate, patters} from "./validation.js";
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
            name:'reason',
            field:"reason_field",
            error:"reason_error",
        },
        {
            name:'description',
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
        let formData = new FormData(event.target)
        let isFormValid = checkValidation(fields)
        if(!isFormValid){
            event.preventDefault();
        }
    });








})
function isFieldPatternValid(field,field_info){

    let check = true
    field_info?.conditions?.forEach(each => {
        if(each.name === 'pattern'){
            check = check ? check = new RegExp(each.value).test(field.value) : false
        }
    })
    return check;
}
function isPatternValid(variable, pattern){
    return new RegExp(pattern).test(variable)
}
function checkOtherValidations(field, field_info){
    return isFieldPatternValid(field, field_info) && isConditionsMet(field_info.conditions, field.value)
}
function isConditionsMet(conditions, value){
    let check = true
    conditions?.forEach(each => {
        if(each.name === 'required' && value.length < 1){
            check = false
        }else if(each.name === 'minlength' && each.value > value.trim().length){
            check = false
        }else if(each.name === 'maxlength' && each.value < value.trim().length){
            check = false
        }else if(each.name === 'pattern' && !isPatternValid(value, each.value)){
            check = false
        }
    })
    return check
}
export function validate(field_info){
    if(field_info?.type === 'quill'){
        let field = field_info.field
        let error = get(field_info.error)
        if(!field["validity"]){
            field["validity"] = {}
        }
        field_info.conditions?.forEach(each => {
            if(each.name === "required"){
                field["required"] = true
                if(field.getText().length > 1){
                    field["validity"]["valueMissing"] = false;
                    field["validity"]['valid'] = true
                }else{
                    field["validity"]["valueMissing"] = true;
                    field["validity"]['valid'] = false
                }

            }})

        field.on('text-change', function() {
            let fieldText = field.getText().substring(0,field.getText().length - 1 )
            let valid = true
            field["value"] = fieldText
            field_info.conditions?.forEach(each => {
                if(each.name === "required"){
                    field["required"] = true
                    if(fieldText.length >= 1){
                        field["validity"]["valueMissing"] = false;
                    }else{
                        field["validity"]["valueMissing"] = true;
                        valid = false
                    }

                }else if (each.name === 'minlength'){
                    field["minLength"] = each.value
                    if(fieldText.length >= each.value){
                        field["validity"]["tooShort"] = false;
                    }else {
                        field["validity"]["tooShort"] = true;
                        valid = false
                    }

                }else if(each.name === 'maxlength'){
                    field["maxLength"] = each.value
                    if(fieldText.length <= each.value){
                        field["validity"]["tooLong"] = false
                    }else {
                        field["validity"]["tooLong"] = true
                        valid = false
                    }
                }else if(each.name === "pattern"){
                    field["pattern"] = each.value
                    const re = new RegExp(each.value);
                    if(re.test(fieldText)){
                        field["validity"]["patternMismatch"] = false
                    }else {
                        field["validity"]["patternMismatch"] = true
                        valid = false
                    }

                }
            })
            field["validity"]['valid'] = valid
            if(valid){
                error.textContent = ""
                error.classList.remove("active")
            }else {
                showError(field_info)
            }
        });
    }else {
        let field =get(field_info.field)
        let error = get(field_info.error)
        field.addEventListener('input', (event) => {

            if(field.validity.valid && checkOtherValidations(field, field_info)){
                error.textContent = ""
                error.classList.remove("active")
                field_info.valid = true
            }else {
                field_info.valid = false
                showError(field_info)
            }
        })
        field.addEventListener('focusout', (event) => {
            error.classList.add("hide_error")
        })
        field.addEventListener('focusin', (event) => {
            error.classList.remove("hide_error")
        })
    }


}
export function showError(field_info) {
    let field = undefined;
    if(field_info?.type === 'quill'){
        field = field_info.field
    }else {
        field =get(field_info.field)
    }
    let error = get(field_info.error)
    field_info.conditions?.forEach(each => {
        let typeDisplayName = "elements"
        if(field.type === "tel"){
            typeDisplayName = "digits"
        }else if(field.type === "text"){
            typeDisplayName = 'characters'
        }
        if(each.name === 'required'){
            if (field.validity.valueMissing) {
                // If the field is empty,
                // display the following error message.
                error.textContent =each.message || `${field_info.name} required.`;
            }else if (field?.validity?.typeMismatch) {
                // If the field doesn't contain an email address,
                // display the following error message.
                error.textContent = each.message || `please enter valid ${field_info.name}`;
            }
        } else if(each.name === 'minlength'){
            if (field.validity.tooShort || field.value.trim().length < each.value) {
                // If the data is too short,
                // display the following error message.
                error.textContent = each.message || `${field_info.name} should be at least ${field.minLength} ${typeDisplayName}; you entered ${field.value.trim().length}.`;
            }
        } else if(each.name === "pattern"){
            if(field.validity.patternMismatch || isPatternValid(field.value, each.value)){
                if(each.details){
                    try{
                        let validFail = false
                        each.details?.forEach(detailPattern => {
                            if(validFail){
                                return
                            }
                            if(detailPattern.name === 'pattern'){
                                if (!isPatternValid(field.value,detailPattern.value)){
                                    validFail = true
                                    error.textContent = detailPattern.message || `Enter valid ${field_info.name} `
                                }
                            }else if (detailPattern.name === 'minlength'){
                                if(field.value.trim()?.length < detailPattern.value){
                                    validFail = true
                                    error.textContent = detailPattern.message || `${field_info.name} require ${detailPattern.value} min items`
                                }
                            }else if(detailPattern.name === 'maxlength'){
                                if(field.value.trim()?.length > detailPattern.value){
                                    validFail = true
                                    error.textContent = detailPattern.message || `${field_info.name} require ${detailPattern.value} max items`
                                }

                            }else {
                                error.textContent = each.message || `Enter valid ${field_info.name} `
                            }
                        })
                    }catch (e) {
                        error.textContent = each.message || `Enter valid ${field_info.name} `
                        console.error(e)
                    }
                }else {
                    error.textContent = each.message || `Enter valid ${field_info.name} `
                }


            }
        }else if(each.name === 'maxlength' || field.value.trim().length > each.value){
            if (field.validity.tooLong) {
                // If the data is too short,
                // display the following error message.
                error.textContent = each.message || `${field_info.name} should be at most ${field.minLength} ${typeDisplayName}; you entered ${field.value.length}.`;
            }
        }
    })

    // Set the styling appropriately
    error.classList.add("active");
}
export function setAttributes(field_info){
    if(field_info?.type ==='quill'){
        return
    }
    let field = get(field_info.field)
    field_info.conditions?.forEach(each => {
        field.setAttribute(each.name, each.value)
    })
}
export function get(id, from=document){
    return from.querySelector('#'+id)
}
export function checkValidation(fields){
    for(let i = 0; i < fields.length; i++){
        let field = undefined
        if(fields[i].type === 'quill'){
            field =fields[i].field
        }else {
            field =get(fields[i].field)
        }

        if(!field.validity?.valid){
            showError(fields[i])
            return false
        }
        if(fields[i].valid !== undefined && !fields[i].valid){
            showError(fields[i])
            return false
        }
    }
    return true
}
export const patters = {
    email:"^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)+\.*$",
    tel:'^(\\+\\d{1,3}[\\s.-]?)?\\(?\\d{3}\\)?[\\s.-]?\\d{3}[\\s.-]?\\d{3,4}$',
    password:'^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$',
    uppercase:'^(?=.*[A-Z])',
    lowercase:'^(?=.*[a-z])',
    digit:'^(?=.*[0-9])',
    specialCharacter:'[`!@#$%^&*()_+\\-=\\[\\]{};\':"\\\\|,.<>\\/?~]'
}
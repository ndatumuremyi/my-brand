import {checkValidation, setAttributes, validate} from "./validation.js";
import {add, tables, getOne, deleteOne} from "../indexDB";

document.addEventListener('DOMContentLoaded', ()=> {
    let quill = new Quill('#blog_editor', {
        theme: 'snow'
    })
    const form = document.getElementById("create_edit_blog")
    const title_blog = document.getElementById("title_blog")
    const image_field = document.getElementById("image_field")
    const image_name = document.getElementById("image_name")
    const title_field = document.getElementById('title_field')
    const category_field = document.getElementById('category_field')
    const url_field = document.getElementById('url_field')
    const delete_blog = document.getElementById('delete_blog')

    image_field.onchange = ()=> {
        console.log(image_field.value)
        let split = image_field.value.split("\\")
        image_name.innerText = split[split.length - 1]
    }

    doFormValidation()


    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)
    let id = urlParams.get("id")

    if(id){
        title_blog.innerText = "Edit"
        getOne(tables.blogs,parseInt(id)).then(result => {
            populateFields(result)
        })
    }else {
        title_blog.innerText = "Create a new "
    }


    function doFormValidation(){
        let fields = [
            {
                name:'title',
                field:"title_field",
                error:"title_error",
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
                        value:100,
                    }
                ]
            },
            {
                name:'image',
                field:"image_field",
                error:"image_error",
                conditions:[
                    {
                        name:'required',
                        value: true
                    },
                ]
            },
            {
                name:'description',
                field:quill,
                type:"quill",
                error:"description_error",
                conditions:[
                    {
                        name:'required',
                        value: true
                    },
                    {
                        name:'minlength',
                        value:10,
                    },
                    {
                        name:'maxlength',
                        value:11500,
                    },
                ],
            },
        ]
        fields.forEach(eachField => {
            setAttributes(eachField)
            validate(eachField)
        })


        form.addEventListener("submit", (event) => {
            // if the email field is valid, we let the form submit
            let isFormValid = checkValidation(fields)
            if(!isFormValid){
                console.log("isFormValid", isFormValid)
                return false
            }
            else {
                let blog = {}
                let formData = new FormData(form)
                for (let each of formData){

                    blog[each[0]] = each[1]
                }
                try{
                    blog["description"] = quill.root.innerHTML;
                    blog['createdAt'] = new Date()
                    if(id){
                       blog['id'] = parseInt(id)
                    }
                    add(tables.blogs, blog).then(result => {
                        console.log(result)
                        window.location.href = "dashboard_blog.html"
                    }, error => console.error(error)).catch(error => console.error(error))
                }catch (e) {
                    console.log(e)
                }
                return false

            }

        });
    }



    function populateFields(blogData) {
        console.log(blogData)
        title_field.value = blogData.title
        quill.root.innerHTML = blogData.description
        category_field.value = blogData.category || 'tech'
        url_field.value = blogData.url || null
        const dataTransfer = new DataTransfer()
        dataTransfer.items.add(blogData.image)
        image_field.files = dataTransfer.files

        let split = image_field.value.split("\\")
        image_name.innerText = split[split.length - 1]

    }


    delete_blog.onclick = (event) => {
        event.preventDefault()
        if(!id){
            return
        }
        deleteOne(tables.blogs, parseInt(id)).then(() => {
            window.location.href = "dashboard_blog.html"
        })
    }

})
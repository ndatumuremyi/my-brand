import {checkValidation, setAttributes, validate} from "./validation.js";
import {add as addBlog, getOneBlog, deleteItem, update} from "../backend";
import endpoints from "../system/constants/endpoints.js";
import {getHeaders} from "../system/utilities.js";
import Secure from "../system/secureLs.js";

if(!Secure.getToken()){
    window.location.href = "login.html"
}
document.addEventListener('DOMContentLoaded', ()=> {
    let quill = new Quill('#blog_editor', {
        theme: 'snow'
    })
    const form = document.getElementById("create_edit_blog")
    const title_blog = document.getElementById("title_blog")
    const image_field = document.getElementById("image_field")
    const image_name = document.getElementById("image_name")
    const image_name_backend = document.getElementById("image_name_backend")

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
        // getOne(tables.blogs,parseInt(id)).then(result => {
        //     populateFields(result)
        // })
        getOneBlog(endpoints.BLOGS, id).then(result =>{
            populateFields(result)
            // console.log(result)
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
            event.preventDefault()
            // if the email field is valid, we let the form submit
            let isFormValid = checkValidation(fields)
            if(!isFormValid && !id){
                console.log("isFormValid", isFormValid)
                return false
            }
            else {
                let formData = new FormData(form)
                let copyForm = new FormData(form)
                for(let each of copyForm){
                    if(each[0] === "image"){
                        if(each[1].name === ''){
                            formData.delete(each[0])
                        }
                    }else {
                        if(each[1]===''){
                            formData.delete(each[0])
                        }
                    }
                }
                try{

                    formData.set("description", quill.root.innerHTML);
                    if(id){
                        update(`${endpoints.BLOGS}/${id}`, formData, getHeaders()).then(result =>{
                            console.log(result)
                            swal("Blog Updated!",`you will be directed to dashboard`, "success").then(() =>{
                                window.location.href = "dashboard_blog.html"
                            })
                        })
                    }else {
                        addBlog(endpoints.BLOGS, formData, getHeaders()).then(result =>{
                            console.log(result)
                            swal("Blog saved!",`go to dashboard to view them`, "success").then(() =>{
                                window.location.href = "dashboard_blog.html"
                            })
                        })
                    }

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
        image_name.innerText = blogData.image

    }


    delete_blog.onclick = (event) => {
        event.preventDefault()
        if(!id){
            return
        }
        try {
            deleteItem(`${endpoints.BLOGS}/${id}`, getHeaders()).then(result => {
                console.log(result)
                swal("Delete successful!",`deleting blog complete`, "success").then(() => {
                    window.location.href = "dashboard_blog.html"
                })
            })
        }catch (error){
            swal("Something went wrong!",`${error.message}`, "error");
        }

    }

})
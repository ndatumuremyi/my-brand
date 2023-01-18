import {getOneBlog, add} from "./backend/index.js";
import {getUniqueId} from "./system/utilities.js";
import {checkValidation, patters, setAttributes, validate} from "./form/validation.js";
import endpoints from "./system/constants/endpoints.js";
import keys from "./system/constants/keys.js";

document.addEventListener('DOMContentLoaded', () => {
    let title = document.getElementById("title")
    let description = document.getElementById('description')
    let image = document.getElementById('image')
    const form = document.getElementById("comment_form");
    const comment_section = document.getElementById('comment_section')
    const comment_container = document.getElementById('comment_container')
    const comment_counts = document.getElementById('comment_counts')
    const clickToLike = document.getElementById('clickToLike')
    const likes_count = document.getElementById('likes_count')
    let didILike = false;

    if(!localStorage.getItem(keys.BROWSER_ID)){
        localStorage.setItem(keys.BROWSER_ID, getUniqueId());
    }


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
                    value:20,
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
    let singleBlog = null

    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)
    let id = urlParams.get("id")
    if(id){
        getOneBlog(endpoints.BLOGS,id).then(result => {
            singleBlog = result
            title.textContent = result.title
            description.innerHTML = result.description
            if(result.image){
                image.src = result.image;
            }
            if(result.comments){
                comment_counts.innerText = result.comments.length +""
                result.comments.forEach(each => addCommentInView(each))
            }
            if (result.likes?.count){
                setLikesToView(result.likes.count)
            }
        })
        try {
            add(`${endpoints.BLOGS}/${id}/didILike`, {browserId:localStorage.getItem(keys.BROWSER_ID)}).then(result => {
                console.log(result)
                didILike = result;
            }).catch(error => {
                console.error(error)
            })
        }catch (error){
            console.error(error)
        }
    }


    fields.forEach(eachField => {
        setAttributes(eachField)
        validate(eachField)

    })

    form.addEventListener("submit", (event) => {
        event.preventDefault()
        // if the email field is valid, we let the form submit
        let isFormValid = checkValidation(fields)
        if(!isFormValid){
            return
        }
        if(!singleBlog){
            return;
        }
        let formData = new FormData(event.target)

        let comment = {}
        for(let each of formData){
            comment[each[0]] = each[1]
        }
        if(singleBlog.comments){
            singleBlog.comments.push(comment)
        }
        else {
            singleBlog.comments = [comment]
        }
        add(`${endpoints.BLOGS}/${id}/comments`, comment).then(result => {
            addCommentInView(result)
            comment_counts.innerText = singleBlog.comments.length +""
        })
    });

    function addCommentInView(comment){
        let newComment = comment_container.cloneNode(true)
        newComment.id = comment.names + comment.comment
        newComment.querySelector('#names').innerText = comment.names
        newComment.querySelector('#comment').innerText = comment.comment

        comment_section.appendChild(newComment)

        clearCommentForm();
    }
    function clearCommentForm(){
        form.reset()
    }


    clickToLike.onclick = () => {
        if(!singleBlog){
            return
        }
        // add(tables.blogs, singleBlog).then(result => {
        //     console.log("result ",result)
        //     setLikesToView(singleBlog.likes.count)
        // })
        if(didILike){
            add(`${endpoints.BLOGS}/${id}/unlike`, {browserId:localStorage.getItem(keys.BROWSER_ID)}).then(result => {
                setLikesToView(result.count)
                didILike = false;
            }).catch(error => {
                console.error(error)
                swal("Something went wrong!",`${error.message}`, "error");
            })
        }else {
            add(`${endpoints.BLOGS}/${id}/like`, {browserId:localStorage.getItem(keys.BROWSER_ID)}).then(result => {
                setLikesToView(result.count)
                didILike = true;
            }).catch(error => {
                console.error(error)
                swal("Something went wrong!",`${error.message}`, "error");
            })
        }

    }

    function setLikesToView(likes){
        likes_count.innerText = likes +""
    }

})
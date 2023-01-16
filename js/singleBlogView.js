import {getOne, tables, add} from "./indexDB";
import {setImage} from "./system/utilities.js";
import {checkValidation, patters, setAttributes, validate} from "./form/validation.js";


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
        id = parseInt(id)
        getOne(tables.blogs,id).then(result => {
            singleBlog = result
            title.textContent = result.title
            description.innerHTML = result.description
            if(result.image){
                setImage(result.image, image)
            }
            if(result.comments){
                comment_counts.innerText = result.comments.length +""
                result.comments.forEach(each => addCommentInView(each))
            }
            if (result.likes?.count){
                setLikesToView(result.likes.count)
            }
        })
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
        add(tables.blogs, singleBlog).then(() => {
            addCommentInView(comment)
            comment_counts.innerText = singleBlog.comments.length +""
        })
    });

    function addCommentInView(comment){
        let newComment = comment_container.cloneNode(true)
        newComment.id = comment.names + comment.comments
        newComment.querySelector('#names').innerText = comment.names
        newComment.querySelector('#comment').innerText = comment.comments

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
        if(singleBlog.likes){
            singleBlog.likes.count = singleBlog.likes.count + 1

        }else {
            singleBlog.likes = {
                count : 1,
                lovers:[]
            }
        }

        add(tables.blogs, singleBlog).then(result => {
            console.log("result ",result)
            setLikesToView(singleBlog.likes.count)
        })
    }

    function setLikesToView(likes){
        likes_count.innerText = likes +""
    }

})
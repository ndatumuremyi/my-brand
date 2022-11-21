import {getAll, tables} from "./indexDB";


document.addEventListener("DOMContentLoaded", () => {
    let blog_container = document.getElementById('blog_container')
    let blog_single_view = document.getElementById('blog_single_view')


    getAll(tables.blogs).then((result) => {
        console.log(result)
        result?.forEach(eachBlog => {
            let blog_single_viewClone = blog_single_view.cloneNode(true)
            blog_single_viewClone.id = eachBlog.id +eachBlog.title +"description"
            blog_single_viewClone.querySelector('#title_view').innerText = eachBlog.title
            let edit_blog = blog_single_viewClone.querySelector('#edit_blog')
            edit_blog.id = "uniqueId"+eachBlog.id
            edit_blog.onclick = () =>{
                window.location.href = 'new_blog_form.html?id='+eachBlog.id
            }

            blog_container.appendChild(blog_single_viewClone)
        })
    }, error => {console.log(error)}).catch(error => console.error(error))
})
import {getAll} from "./backend/index.js";
import endpoints from "./system/constants/endpoints.js";
document.addEventListener("DOMContentLoaded", () => {
    let blog_single_view = document.getElementById('blog_single_view_client')
    let blogsContainer = document.getElementById('blogsContainer')


    getAll(endpoints.BLOGS).then(results => {
        results?.forEach(eachBlog => {
            let blogViewClone = blog_single_view.cloneNode(true)
            blogViewClone.id = "eachBlog," + eachBlog.id
            blogViewClone.querySelector('#blog_title').innerText = eachBlog.title
            let viewSingleBlog = blogViewClone.querySelector('#view_more_blog')
            viewSingleBlog.id = "viewMoreBlog,"+eachBlog.id
            let blog_category = blogViewClone.querySelector('#blog_category')
            blog_category.textContent = eachBlog?.category || ''
            let blog_createdAt = blogViewClone.querySelector('#blog_createdAt')
            blog_createdAt.textContent = eachBlog?.createdAt?.toDateString() || ''
            let blog_image = blogViewClone.querySelector('#blog_image')
            if(eachBlog.image){
                try{
                    blog_image.src = eachBlog.image;
                }catch (e) {
                    console.error(e)
                }
            }
            let blog_likes = blogViewClone.querySelector('#blog_likes')
            if(eachBlog?.likes?.count){
                blog_likes.innerText = eachBlog.likes.count
            }
            let blog_comments = blogViewClone.querySelector('#blog_comments')
            if(eachBlog.comments){
                blog_comments.innerText = eachBlog.comments.length
            }

            viewSingleBlog.onclick = () =>{
                window.location.href = "blog_view.html?id="+eachBlog._id;
            }
            blogsContainer.appendChild(blogViewClone)
        })
    })











})
import Constants from "./../system/constants/index.js";
import endpoints from "./../system/constants/endpoints.js";
import {getHeaders} from "../system/utilities.js";

export async function getAll(endpoint, headers) {
    try {
        if(headers){
            const {data:{data}} = await axios.get(`${Constants.DEFAULT_API}${endpoint}`, headers)
            return data;
        }
        const {data:{data}} = await axios.get(`${Constants.DEFAULT_API}${endpoint}`)
        return data;
    }catch (error){
        console.error(error)
        return []
    }

}
export async function getOneBlog(endpoint, id){
    try {
        const {data:{data, comments, likes}} = await axios.get(`${Constants.DEFAULT_API}${endpoint}/${id}`)
        return {...data, comments, likes};
    }catch (error){
        console.error(error)
        return {}
    }
}
export async function add(endpoints, dataToAdd, headers){
    if(headers){
        const {data:{data}} = await axios.post(`${Constants.DEFAULT_API}${endpoints}`, dataToAdd, headers);
        return data
    }
    const {data:{data}} = await axios.post(`${Constants.DEFAULT_API}${endpoints}`, dataToAdd);
    return data
}
export async function update(endpoints, dataToAdd, headers){
    const {data:{data}} = await axios.patch(`${Constants.DEFAULT_API}${endpoints}`, dataToAdd, headers);
    return data
}
export async function deleteItem(endpoints, headers){
    const {data:{data}} = await axios.delete(`${Constants.DEFAULT_API}${endpoints}`, headers);
    return data
}
export async function logout(){
    const {data} = await axios.post(`${Constants.DEFAULT_API}${endpoints.LOGOUT}`,{}, getHeaders());
    return data
}
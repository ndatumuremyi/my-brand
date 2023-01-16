import Constants from "../system/constants/index.js";

export async function getAll(endpoint) {
    try {
        const {data:{data}} = await axios.get(`${Constants.DEFAULT_API}${endpoint}`)
        return data;
    }catch (error){
        console.error(error)
        return []
    }

}
export async function getOne(endpoint, id){
    try {
        const {data:{data}} = await axios.get(`${Constants.DEFAULT_API}${endpoint}/${id}`)
        return data;
    }catch (error){
        console.error(error)
        return {}
    }
}
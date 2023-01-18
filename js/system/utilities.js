import Secure from "./secureLs.js";

export const setImage = (file, imgElement) => {
    const reader = new FileReader();
    reader.onload = () => imgElement.src = reader.result;
    reader.readAsDataURL(file);
};

export function getUniqueId(){
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
export function getHeaders(){
    return {
        headers: { Authorization: `Bearer ${Secure.getToken()}` }
    }
}
export const setImage = (file, imgElement) => {
    const reader = new FileReader();
    reader.onload = () => imgElement.src = reader.result;
    reader.readAsDataURL(file);
};
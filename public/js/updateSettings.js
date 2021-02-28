export const updateData=()=>{
    console.log("form submitted");
    const name=document.getElementById('form-user-data').value.name;
    const email=document.getElementById('form-user-data').value.email;
    console.log(name,email);
}
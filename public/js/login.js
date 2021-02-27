const login =async  (email, password) => {
    // console.log(email,password);
 try {
     //this function will enable user/login request
    const res=await axios({
        method: "POST",
        url: "http://127.0.0.1:5000/users/login",
        data: {
          email,
          password
        }
      });
      windows.setTimeout(()=>{
        Location.assign('/')
      },2000)
 } catch (err){
     console.log(err.response.json);
    //  console.log("galat hai pagale!!");
 }
};

document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  login( email, password );
});

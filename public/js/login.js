import axios from 'axios'
import {showAlert} from './alert'
export const login =async  (email, password) => {
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
      console.log(res.data.status);
      if(res.data.status==='Success!')
      {
        // console.log('Logged in Successfully');
        showAlert('Success','Logged in Successfully');
      //   windows.setTimeout(()=>{
      //     // console.log("hello form location");
          location.assign("http://127.0.0.1:5000/");
      //   },0)
      }

 } catch (err){
  //  console.log('error');
   showAlert('error',err.response.data.message )
    //  console.log("galat hai pagale!!");
 }
};


export const logout=async ()=>{
  try {
    const res=await axios({
      method: "GET",
      url: "http://127.0.0.1:5000/users/logout",
    });
    console.log(res.data.status,'logout Request');
    if(res.data.status==='success')
    {
      console.log('Logged out Successfully');
      location.reload(true)
    }
  } catch (err) {
    showAlert('error',err.response.data.message )
  }
}


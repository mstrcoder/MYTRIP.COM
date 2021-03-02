import axios from 'axios'
import {showAlert} from './alert'
export const signup =async  (name,email, password,passwordConfirm) => {
    // console.log(email,password);
 try {
     //this function will enable user/login request
    const res=await axios({
        method: "POST",
        url: "http://127.0.0.1:5000/users/signup",
        data: {
            name,
          email,
          password,
          passwordConfirm
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
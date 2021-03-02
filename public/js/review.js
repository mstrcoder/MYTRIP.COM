import axios from 'axios'
import {showAlert} from './alert'
export const reviewAdd =async  (name,review, rating) => {
    // console.log(email,password);
 try {
     //this function will enable user/login request
    const res=await axios({
        method: "POST",
        url: `/review/${name}`,
        data: {
          review,
          rating
        }
      });
      // console.log(res.data.status);
      if(res.data.status==='Success!'||res.data.status==='success')
      {
        // console.log('Logged in Successfully');
        showAlert('Success','Review Saved Succesfully');
      //   windows.setTimeout(()=>{
      //     // console.log("hello form location");
          location.assign("/");
      //   },0)
      }

 } catch (err){
  //  console.log('error');
   showAlert('error',err.response.data.message )
    //  console.log("galat hai pagale!!");
 }
};
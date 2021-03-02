import axios from 'axios';
import { showAlert } from './alert';

// type is either 'password' or 'data'
export const updateData = async ( data,type) => {
  try {
    const url =
      type === 'password'
        ? '/users/updateMyPassword'
        : '/users/updateMe';

    const res = await axios({
      method: 'PATCH',
      url,
      data
    });
    // console.log(res.data.status);

    if (res.data.status === 'Success!') {
      console.log("Alert showed Up!");
      showAlert('Success', `${type.toUpperCase()} updated successfully!`);
      // showAlert('success', `Data updated successfully!`);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
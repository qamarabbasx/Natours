/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';
// type is either 'password' or 'data'
export const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? '/api/v1/users/updateMyPassword'
        : '/api/v1/users/updateMe';
    const res = await axios({
      method: 'PATCH',
      url,
      data,
    });
    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} Updated Successfully !`);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
export const updatePassword = async (currPass, newPass, ConfirmPass) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: 'http://127.0.0.1:3000/api/v1/users/updateMyPassword',
      data: { name, email },
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Data Updated Successfully !');
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

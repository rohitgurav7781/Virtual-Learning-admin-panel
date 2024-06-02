import axios from "axios";
import { BaseUrl } from "../../BaseUrl";

//todo==>POST USER LIST
export const postUserList = async (udata, headers) => {
  try {
    await axios({
      method: "POST",
      url: `${BaseUrl}/userprofile/v1/createUserProfile`,
      headers: headers,
      data: JSON.stringify(udata),
    }).then(function (res) {
      console.log(res);
      if (res.data.responseCode === 201) {
        alert("User List Successfully Created");
      } else if (res.data.responseCode === 400) {
        alert(res.data.errorMessage);
      }
    });
  } catch (err) {
    console.log(err);
  }
};

//todo ==> GET ROLES (DROPDOWN)
export const getUserRoles = async (headers) => {
  return await axios({
    method: "GET",
    url: "https://virtullearning.cloudjiffy.net/BitStreamIOLMSWeb/role/v1/getAllRoles",
    headers,
    body: JSON.stringify(),
  });
};

//todo ==> GET USER-LIST DATA
export const fetchUserList = async (headers, usedata) => {
  return await axios({
    method: "GET",
    url: `${BaseUrl}/userprofile/v1/getAllUserProfileByPagination/{pageNumber}/{pageSize}?pageNumber=0&pageSize=10`,
    headers: headers,
    data: JSON.stringify(usedata),
  });
};

//todo ==> GET USER-LIST DATA BY ID
export const getUserListId = async (id, headers) => {
  return await axios({
    method: "GET",
    url: `https://virtullearning.cloudjiffy.net/BitStreamIOLMSWeb/userprofile/v1/getUserProfileByUserId/{userId}?userId=${id}`,
    headers: headers,
  });
};

//todo==>UPDATE USER-LIST
export const updateUserList = async (headers, updateddata) => {
  await axios({
    method: "PUT",
    url: `${BaseUrl}/userprofile/v1/updateUserProfile`,
    headers: headers,
    data: updateddata,
  })
    .then(function (res) {
      console.log(res);
      if (res.data.responseCode === 201) {
        alert(res.data.message);
      } else if (res.data.responseCode === 400) {
        alert(res.data.errorMessage);
      }
    })
    .catch(function (error) {
      console.log(error);
    });
};

//todo fetch the count for the userList
export const fetchUserCount = async (accessToken) => {
  const userlistUrl = `${BaseUrl}/userprofile/v1/getAllUserProfileByPagination/{pageNumber}/{pageSize}?pageNumber=0&pageSize=10`;
  try {
    const response = await axios.get(userlistUrl, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data.content;
  } catch (error) {
    console.error("Error fetching userList:", error);
    throw error;
  }
};

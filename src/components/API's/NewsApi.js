import axios from "axios";
import { BaseUrl } from "../../BaseUrl";

//todo ==> POST ADVERTISEMENT DATA
export const addNews = async (data, headers) => {
  try {
    return await axios({
      method: "POST",
      url: `${BaseUrl}/news/v1/createNews`,
      headers,
      data: data,
    }).then(function (res) {
      console.log(res);
      if (res.data.responseCode === 201) {
        alert("Advertisement  added successfully");
      } else if (res.data.responseCode === 400) {
        alert(res.data.errorMessage);
      }
    });
  } catch (error) {
    alert(error);
  }
};

export const fetchNews = async (headers) => {
  return await axios({
    method: "get",
    url: `${BaseUrl}/news/v1/getAllNewsByPagination/{pageNumber}/{pageSize}?pageNumber=0&pageSize=10`,
    headers: headers,
  });
};

//todo ==> GET DATA BY ADVERTISE ID
export const getNewsById = async (id, headers) => {
  return await axios({
    method: "GET",
    url: `${BaseUrl}/news/v1/getNewsById/{newsId}?newsId=${id}`,
    headers: headers,
  });
};

//todo ==> UPDATE ADVERTISE DATA
export const updatedNews = async (updatedData, headers) => {
  console.log(updatedData);
  return await axios({
    method: "PUT",
    url: `${BaseUrl}/news/v1/updateNews`,
    headers: headers,
    data: updatedData,
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

//todo ==> DELETE  ADVERTISE DATA
export const deleteNews = async (id, headers) => {
  return await axios({
    method: "delete",
    url: `${BaseUrl}/news/v1/deleteNewsById/${id}`,
    headers,
  })
    .then((res) => {
      if (res.data.responseCode === 200) {
        alert(res.data.message);
      } else if (res.data.responseCode === 400) {
        alert(res.data.errorMessage);
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

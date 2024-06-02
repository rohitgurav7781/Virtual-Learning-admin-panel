import axios from "axios";
import { BaseUrl } from "../../BaseUrl";

//todo ==> POST ADVERTISEMENT DATA
export const addAdvertise = async (data, headers) => {
  try {
    return await axios({
      method: "POST",
      url: `${BaseUrl}/advertisement/v1/createAdvertisement`,
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

//todo ==> GET  ADVERTISEMENT DATA
export const fetchAdvertise = async (headers) => {
  return await axios({
    method: "get",
    url: `${BaseUrl}/advertisement/v1/getAllAdvertisementByPagination/{pageNumber}/{pageSize}?pageNumber=0&pageSize=10`,
    headers: headers,
  });
};

//todo ==> GET DATA BY ADVERTISE ID
export const getAdvertiseById = async (id, headers) => {
  return await axios({
    method: "GET",
    url: `${BaseUrl}/advertisement/v1/getAdvertisementByAdvertisementId/{advertisementId}?advertisementId=${id}`,
    headers: headers,
  });
};

//todo ==> UPDATE ADVERTISE DATA
export const updatedAdvertise = async (updatedData, headers) => {
  console.log(updatedData);
  return await axios({
    method: "PUT",
    url: `${BaseUrl}/advertisement/v1/updateAdvertisement`,
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
export const deleteAdvertise = async (id, headers) => {
  return await axios({
    method: "delete",
    url: `${BaseUrl}/advertisement/v1/deleteAdvertisementById/${id}`,
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

//todo fetch the count for banner card
export const fetchBannerCount = async (accessToken) => {
  const bannerUrl = `${BaseUrl}/advertisement/v1/getAllAdvertisementByPagination/{pageNumber}/{pageSize}?pageNumber=0&pageSize=10`;
  try {
    const response = await axios.get(bannerUrl, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data.content;
  } catch (error) {
    console.error("Error fetching banner:", error);
    throw error;
  }
};

import axios from "axios";
import { BaseUrl } from "../../BaseUrl";

//todo batch Course post method
export const PostDiscount = async (cdata, headers) => {
  try {
    await axios({
      method: "POST",
      url: `${BaseUrl}/discount/v1/createDiscount`,
      headers: headers,
      data: JSON.stringify(cdata),
    }).then(function (res) {
      console.log(res);
      if (res.data.responseCode === 201) {
        alert("Discount Added Succesfully");
      } else {
        alert(res);
      }
    });
  } catch (error) {
    //console.error("Error in PostBatchCourse:", error);
    alert(error);
  }
};

//todo ==> GET  BatchCourse DATA
export const fetchDiscount = async (headers) => {
  return await axios({
    method: "GET",
    url: `${BaseUrl}/discount/v1/getAllDiscountByPagination/{pageNumber}/{pageSize}?pageNumber=0&pageSize=10`,
    headers: headers,
  });
};

//todo ==> GET DATA BY course ID
export const getDiscountById = async (id, headers) => {
  return await axios({
    method: "GET",
    url: `${BaseUrl}/discount/v1/getDiscountByDiscountId/{discountId}?discountId=${id}`,
    headers: headers,
  });
};

//todo ==> UPDATE COURSE DATA
export const updatedDiscount = async (updatedData, headers) => {
  console.log(updatedData);
  return await axios({
    method: "PUT",
    url: `${BaseUrl}/discount/v1/updateDiscount`,
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

//todo ==> DELETE  Module DATA
export const deleteDiscount = async (id, headers) => {
  await axios({
    method: "DELETE",
    url: `${BaseUrl}/discount/v1/deleteDiscountById/${id}`,
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

//todo fetch the count for the Master category
export const fetchDiscountCount = async (accessToken) => {
  const discountUrl = `${BaseUrl}/discount/v1/getAllDiscountByPagination/{pageNumber}/{pageSize}?pageNumber=0&pageSize=10`;
  try {
    const response = await axios.get(discountUrl, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data.content;
  } catch (error) {
    console.error("Error fetching Category:", error);
    throw error;
  }
};

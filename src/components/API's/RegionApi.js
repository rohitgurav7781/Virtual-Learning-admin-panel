import axios from "axios";
import { BaseUrl } from "../../BaseUrl";

//todo Region post method
export const PostRegion = async (cdata, headers) => {
  try {
    await axios({
      method: "POST",
      url: `${BaseUrl}/region/v1/createRegion`,
      headers: headers,
      data: JSON.stringify(cdata),
    }).then(function (res) {
      console.log(res);
      if (res.data.responseCode === 201) {
        alert("Region Added Succesfully");
      } else {
        alert(res);
      }
    });
  } catch (error) {
    //console.error("Error in PostBatchCourse:", error);
    alert(error);
  }
};

//todo ==> GET Region DATA
export const fetchRegion = async (headers) => {
  return await axios({
    method: "GET",
    url: `${BaseUrl}/region/v1/getAllRegionByPagination/{pageNumber}/{pageSize}?pageNumber=0&pageSize=10`,
    headers: headers,
  });
};

//todo ==> GET DATA BY Region ID
export const getRegionById = async (id, headers) => {
  return await axios({
    method: "GET",
    url: `${BaseUrl}/region/v1/getRegionByRegionId/{regionId}?regionId=${id}`,
    headers: headers,
  });
};

//todo ==> UPDATE Region DATA
export const updatedRegion = async (updatedData, headers) => {
  console.log(updatedData);
  return await axios({
    method: "PUT",
    url: `${BaseUrl}/region/v1/updateRegion`,
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

//todo ==> DELETE  Region DATA
export const deleteRegion = async (id, headers) => {
  await axios({
    method: "DELETE",
    url: `${BaseUrl}/region/v1/deleteRegionById/${id}`,
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
export const fetchRegionCount = async (accessToken) => {
  const regionUrl = `${BaseUrl}/region/v1/getAllRegionByPagination/{pageNumber}/{pageSize}?pageNumber=0&pageSize=10`;
  try {
    const response = await axios.get(regionUrl, {
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

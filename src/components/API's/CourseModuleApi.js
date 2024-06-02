import axios from "axios";
import { BaseUrl } from "../../BaseUrl";

//todo batch Course post method
export const PostCourseModule = async (cdata, headers) => {
  try {
    await axios({
      method: "POST",
      url: `${BaseUrl}/module/v1/createModule`,
      headers: headers,
      data: JSON.stringify(cdata),
    }).then(function (res) {
      console.log(res);
      if (res.data.responseCode === 201) {
        alert("Course Added Succesfully");
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
export const fetchModule = async (headers) => {
  return await axios({
    method: "GET",
    url: `${BaseUrl}/module/v1/getAllModuleByPagination/{pageNumber}/{pageSize}?pageNumber=0&pageSize=10`,
    headers: headers,
  });
};

//todo ==> GET DATA BY course ID
export const getModuleById = async (id, headers) => {
  return await axios({
    method: "GET",
    url: `${BaseUrl}/module/v1/getModuleByModuleId/{moduleId}?moduleId=${id}`,
    headers: headers,
  });
};

//todo ==> UPDATE COURSE DATA
export const updatedModule = async (updatedData, headers) => {
  console.log(updatedData);
  return await axios({
    method: "PUT",
    url: `${BaseUrl}/module/v1/updateModule`,
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
export const deleteModule = async (id, headers) => {
  await axios({
    method: "DELETE",
    url: `${BaseUrl}/module/v1/deleteModuleById/${id}`,
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

//todo fetch the count for the course module
export const fetchModuleCount = async (accessToken) => {
  const moduleUrl = `${BaseUrl}/module/v1/getAllModuleByPagination/{pageNumber}/{pageSize}?pageNumber=0&pageSize=10`;
  try {
    const response = await axios.get(moduleUrl, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data.content;
  } catch (error) {
    console.error("Error fetching Module:", error);
    throw error;
  }
};

import axios from "axios";
import { BaseUrl } from "../../BaseUrl";

//todo batch Course post method
export const PostCourse = async (cdata, headers) => {
  try {
    await axios({
      method: "POST",
      url: `${BaseUrl}/course/v1/createCourse`,
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
    alert(error);
  }
};

//todo ==> GET  BatchCourse DATA
export const batchCourse = async (headers) => {
  return await axios({
    method: "GET",
    url: `${BaseUrl}/course/v1/getAllCourseByPagination/{pageNumber}/{pageSize}?pageNumber=0&pageSize=10`,
    headers: headers,
  });
};

//todo ==> GET DATA BY course ID
export const getCourseById = async (id, headers) => {
  return await axios({
    method: "GET",
    url: `${BaseUrl}/course/v1/getCourseByCourseId/{courseId}?courseId=${id}`,
    headers: headers,
  });
};

//todo ==> UPDATE COURSE DATA
export const updatedCourse = async (updatedData, headers) => {
  console.log(updatedData);
  return await axios({
    method: "PUT",
    url: `${BaseUrl}/course/v1/updateCourse`,
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
export const deleteCourse = async (id, headers) => {
  return await axios({
    method: "delete",
    url: `${BaseUrl}/course/v1/deleteCourseById/${id}`,
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

//todo fetch the count for course card
export const fetchCourses = async (accessToken) => {
  const courseUrl = `${BaseUrl}/course/v1/getAllCourseByPagination/{pageNumber}/{pageSize}?pageNumber=0&pageSize=20`;
  try {
    const response = await axios.get(courseUrl, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data.content;
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw error;
  }
};

import axios from "axios";
import { BaseUrl } from "../../BaseUrl";

//todo batch Course post method
export const PostCourseTopic = async (cdata, headers) => {
  try {
    await axios({
      method: "POST",
      url: `${BaseUrl}/topic/v1/createTopic`,
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
export const fetchTopic = async (headers) => {
  return await axios({
    method: "GET",
    url: `${BaseUrl}/topic/v1/getAllTopicByPagination/{pageNumber}/{pageSize}?pageNumber=0&pageSize=10`,
    headers: headers,
  });
};

//todo ==> GET DATA BY course ID
export const getTopicById = async (id, headers) => {
  return await axios({
    method: "GET",
    url: `${BaseUrl}/topic/v1/getTopicById/{topicId}?topicId=${id}`,
    headers: headers,
  });
};

//todo ==> UPDATE COURSE DATA
export const updatedTopic = async (updatedData, headers) => {
  console.log(updatedData);
  return await axios({
    method: "PUT",
    url: `${BaseUrl}/topic/v1/updateTopic`,
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
export const deleteTopic = async (id, headers) => {
  await axios({
    method: "DELETE",
    url: `${BaseUrl}/topic/v1/deleteTopicById/${id}`,
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

//todo fetch the count for the course topic
export const fetchTopicCount = async (accessToken) => {
  const topicUrl = `${BaseUrl}/topic/v1/getAllTopicByPagination/{pageNumber}/{pageSize}?pageNumber=0&pageSize=10`;
  try {
    const response = await axios.get(topicUrl, {
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

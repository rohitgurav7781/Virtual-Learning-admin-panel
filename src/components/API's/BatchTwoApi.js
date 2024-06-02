import axios from "axios";
import { BaseUrl } from "../../BaseUrl";

const baseURL = "https://virtullearning.cloudjiffy.net/BitStreamIOLMSWeb";

//todo batch Course post method
export const PostBatchCourse = async (pdataa, headers) => {
  try {
    await axios({
      method: "POST",
      url: `${BaseUrl}/batchcourse/v1/createBatchCourse`,
      headers: headers,
      data: JSON.stringify(pdataa),
    }).then(function (res) {
      console.log(res);
      if (res.data.responseCode === 201) {
        alert("Batch Course Created Succesfully");
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
    url: `${BaseUrl}/batchcourse/v1/getAllBatchCourseByPagination/{pageNumber}/{pageSize}?pageNumber=0&pageSize=10`,
    headers: headers,
  });
};

//todo ==> GET DATA BY BATCH ID
export const getBatchCourseById = async (headers, id) => {
  return await axios({
    method: "GET",
    url: `${BaseUrl}/batchcourse/v1/getBatchCourseByBatchCourseId/{batchCourseId}?batchCourseId=${id}`,
    headers: headers,
  });
};

//todo update batch-Course data
export const updateBatchCourseData = async (headers, updateddata) => {
  await axios({
    method: "PUT",
    url: `${BaseUrl}/batchcourse/v1/updateBatchCourse`,
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

//TODO Delete the BatchCourse Data
export const deleteBatchCourseData = async (headers, id) => {
  await axios({
    method: "DELETE",
    url: `${BaseUrl}/batchcourse/v1/deleteBatchCourseById/{batchCourseId}?batchCourseId/${id}`,
    headers: headers,
  })
    .then((res) => {
      console.log(res);
      if (res.data.responseCode === 200) {
        alert("Batch-Course Deleted");
      } else if (res.data.responseCode === 400) {
        alert(res.data.Message);
        //alert("something wrong");
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getBatches = async (headers) => {
  return await axios({
    method: "GET",
    url: `${BaseUrl}/batch/v1/getAllBatchs`,
    headers,
    body: JSON.stringify(),
  });
};

export const getCategories = async (headers) => {
  return await axios({
    method: "GET",
    url: `${BaseUrl}/category/v1/queryAllCategory`,
    headers,
    body: JSON.stringify(),
  });
};

export const getLanguages = async (headers) => {
  return await axios({
    method: "GET",
    url: `${BaseUrl}/language/v1/getAllLanguage`,
    headers,
    body: JSON.stringify(),
  });
};

//todo fetch the count for batchcourse card
export const fetchBatchCourses = async (accessToken) => {
  const batchCourseUrl = `${baseURL}/batchcourse/v1/getAllBatchCourseByPagination/{pageNumber}/{pageSize}?pageNumber=0&pageSize=20`;
  try {
    const response = await axios.get(batchCourseUrl, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data.content;
  } catch (error) {
    console.error("Error fetching batches:", error);
    throw error;
  }
};

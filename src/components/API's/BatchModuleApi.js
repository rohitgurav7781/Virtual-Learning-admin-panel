import axios from "axios";
import { BaseUrl } from "../../BaseUrl";

const baseURL = "https://virtullearning.cloudjiffy.net/BitStreamIOLMSWeb";

//todo ==> POST Module DATA
export const PostBatchModule = async (pdata, headers) => {
  try {
    await axios({
      method: "POST",
      url: `${BaseUrl}/batchmodule/v1/createBatchModule`,
      headers: headers,
      data: JSON.stringify(pdata),
    }).then(function (res) {
      console.log(res);
      if (res.data.responseCode === 201) {
        alert("Batch-Module added successfully");
      } else {
        alert(res);
      }
    });
  } catch (error) {
    alert(error);
  }
};

export const getCourses = async (headers) => {
  return await axios({
    method: "GET",
    url: `${BaseUrl}/batchcourse/v1/getAllBatchCourseByPagination/{pageNumber}/{pageSize}?pageNumber=0&pageSize=10`,
    headers,
    body: JSON.stringify(),
  });
};

//todo ==> GET DATA BY MODULE ID
export const getModuleById = async (headers, id) => {
  return await axios({
    method: "GET",
    url: `${BaseUrl}/batchmodule/v1/getBatchModuleModuleByBatchModuleId/{batchModuleId}?batchModuleId=${id}`,
    headers: headers,
  });
};

//todo ==> GET MODULE DATA
export const fetchBatchModule = async (headers) => {
  return await axios({
    method: "GET",
    url: `${BaseUrl}/batchmodule/v1/getAllBatchModuleByPagination/{pageNumber}/{pageSize}?pageNumber=0&pageSize=10`,
    headers: headers,
  });
};

//todo update batch-Module data
export const updateModuleData = async (headers, updateddata) => {
  await axios({
    method: "PUT",
    url: `${BaseUrl}/batchmodule/v1/updateBatchModule`,
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

export const deleteBatchModule = async (headers, id) => {
  await axios({
    method: "DELETE",
    url: `${BaseUrl}/batchmodule/v1/deleteBatchModuleById/{batchModuleId}?batchModuleId=${id}`,
    headers: headers,
  })
    .then((res) => {
      console.log(res);
      if (res.data.responseCode === 200) {
        alert("Batch-Module Deleted");
      } else if (res.data.responseCode === 400) {
        alert(res.data.errorMessage);
        alert("something wrong");
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

//todo fetch the count for batchModule card
export const fetchBatchModuleCount = async (accessToken) => {
  const batchModuleUrl = `${baseURL}/batchmodule/v1/getAllBatchModuleByPagination/{pageNumber}/{pageSize}?pageNumber=0&pageSize=20`;
  try {
    const response = await axios.get(batchModuleUrl, {
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

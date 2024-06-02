import axios from "axios";
import { BaseUrl } from "../../BaseUrl";

const baseURL = "https://virtullearning.cloudjiffy.net/BitStreamIOLMSWeb";

//todo ==> POST Batch DATA
export const PostBatchTopic = async (pdata, headers) => {
  try {
    await axios({
      method: "POST",
      url: `${BaseUrl}/batchtopic/v1/createBatchTopic`,
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

//todo ==> Get Module Dropdown
export const getModule = async (headers) => {
  return await axios({
    method: "GET",
    url: `${BaseUrl}/batchmodule/v1/getAllBatchModuleByPagination/{pageNumber}/{pageSize}?pageNumber=0&pageSize=10`,
    headers,
    body: JSON.stringify(),
  });
};

//todo ==> GET DATA BY MODULE ID
export const getTopicById = async (headers, id) => {
  return await axios({
    method: "GET",
    url: `${BaseUrl}/batchtopic/v1/getBatchTopicById/{batchTopicId}?batchTopicId=${id}`,
    headers: headers,
  });
};

//todo ==> GET MODULE DATA
export const fetchBatchTopic = async (headers) => {
  return await axios({
    method: "GET",
    url: `${BaseUrl}/batchtopic/v1/getAllBatchTopicByPagination/{pageNumber}/{pageSize}?pageNumber=0&pageSize=20`,
    headers: headers,
  });
};

//todo ==> update batch-Module data
export const updateTopicData = async (headers, updateddata) => {
  await axios({
    method: "PUT",
    url: `${BaseUrl}/batchtopic/v1/updateBatchTopic`,
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

//todo ==> delete Batch-Module data
export const deleteBatchTopic = async (headers, id) => {
  await axios({
    method: "DELETE",
    url: `${BaseUrl}/batchtopic/v1/deleteBatchTopicById/{batchTopicId}?batchTopicId=${id}`,
    headers: headers,
  })
    .then((res) => {
      console.log(res);
      if (res.data.responseCode === 200) {
        alert(res.data.message);
      } else if (res.data.responseCode === 400) {
        alert(res.data.errorMessage);
        alert("something wrong");
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

//todo fetch the count for batchTopic card
export const fetchBatchtopicCount = async (accessToken) => {
  const batchModuleUrl = `${baseURL}/batchtopic/v1/getAllBatchTopicByPagination/{pageNumber}/{pageSize}?pageNumber=0&pageSize=20`;
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

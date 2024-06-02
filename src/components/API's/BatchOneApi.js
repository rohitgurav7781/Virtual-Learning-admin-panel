import axios from "axios";
import { BaseUrl } from "../../BaseUrl";

const baseURL = "https://virtullearning.cloudjiffy.net/BitStreamIOLMSWeb";

//todo ==> POST Batch DATA
export const PostBatchData = async (pdata, headers) => {
  try {
    await axios({
      method: "POST",
      url: `${BaseUrl}/batch/v1/createBatch`,
      headers: headers,
      data: JSON.stringify(pdata),
    }).then(function (res) {
      console.log(res);
      if (res.data.responseCode === 201) {
        alert("Batch added successfully");
      } else {
        alert(res);
      }
    });
  } catch (error) {
    alert(error);
  }
};

//todo ==> GET DATA BY BATCH ID
export const getBatchById = async (headers, id) => {
  return await axios({
    method: "GET",
    url: `${BaseUrl}/batch/v1/getBatchByBatchId/{batchId}?batchId=${id}`,
    headers: headers,
  });
};

//todo ==> GET  CATEGORY DATA
export const fetchBatchData = async (headers) => {
  return await axios({
    method: "GET",
    url: `${BaseUrl}/batch/v1/getAllBatchByPagination/{pageNumber}/{pageSize}?pageNumber=0&pageSize=10`,
    headers: headers,
  });
};

//todo update batch data
export const updateBatchData = async (headers, updateddata) => {
  await axios({
    method: "PUT",
    url: `${BaseUrl}/batch/v1/updateBatch`,
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

export const deleteBatchData = async (headers, id) => {
  await axios({
    method: "DELETE",
    url: `${BaseUrl}/batch/v1/deleteBatchById/${id}`,
    headers: headers,
  })
    .then((res) => {
      console.log(res);
      if (res.data.responseCode === 200) {
        alert("Batch Deleted");
      } else if (res.data.responseCode === 400) {
        alert(res.data.errorMessage);
        alert("something wrong");
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

//todo fetch the count for the Batch card
export const fetchBatches = async (accessToken) => {
  const batchUrl = `${baseURL}/batch/v1/getAllBatchByPagination/{pageNumber}/{pageSize}?pageNumber=0&pageSize=20`;
  try {
    const response = await axios.get(batchUrl, {
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

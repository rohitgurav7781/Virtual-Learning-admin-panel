import axios from "axios";
import { BaseUrl } from "../../BaseUrl";

//todo ==> POST Candidate DATA
export const PostCandidate = async (cdata, headers) => {
  try {
    await axios({
      method: "POST",
      url: `${BaseUrl}/candidate/v1/createCandidate`,
      headers,
      data: cdata,
    }).then(function (res) {
      console.log(res);
      if (res.data.responseCode === 201) {
        alert("Candidate added successfully");
      } else if (res.data.responseCode === 400) {
        alert(res.data.errorMessage);
      }
    });
  } catch (error) {
    alert(error);
  }
};

//todo ==> GET Candidate DATA
export const fetchCandidate = async (headers, usedata) => {
  return await axios({
    method: "GET",
    url: `${BaseUrl}/candidate/v1/getAllCandidatesByPagination/{pageNumber}/{pageSize}?pageNumber=0&pageSize=10`,
    headers: headers,
    data: JSON.stringify(usedata),
  });
};
//todo ==> GET DATA BY Candidate ID
export const getCandidateById = async (id, headers) => {
  return await axios({
    method: "GET",
    url: `${BaseUrl}/candidate/v1/getCandidateByMobileUserId/{mobileUserId}?mobileUserId=${id}`,
    headers: headers,
  });
};

//todo ==> UPDATE Candidate DATA
export const updateCandidate = async (updatedData, headers) => {
  console.log(updatedData);
  return await axios({
    method: "PUT",
    url: `${BaseUrl}/candidate/v1/updateCandidate`,
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

//todo ==> DELETE  Candidate DATA
export const deleteCandidate = async (id, headers) => {
  return await axios({
    method: "delete",
    url: `${BaseUrl}/candidate/v1/deleteCandidateById/{mobileUserId}?mobileUserId=${id}`,
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

//todo fetch the count for the candidates
export const fetchCandiadteCount = async (accessToken) => {
  const candidateUrl = `${BaseUrl}/candidate/v1/getAllCandidatesByPagination/{pageNumber}/{pageSize}?pageNumber=0&pageSize=10`;
  try {
    const response = await axios.get(candidateUrl, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data.content;
  } catch (error) {
    console.error("Error fetching candidate:", error);
    throw error;
  }
};

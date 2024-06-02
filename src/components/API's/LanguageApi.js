import axios from "axios";
import { BaseUrl } from "../../BaseUrl";

//todo Langauage post method
export const PostLangauge = async (cdata, headers) => {
  try {
    await axios({
      method: "POST",
      url: `${BaseUrl}/language/v1/createLanguage`,
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

//todo ==> GET Langauage DATA
export const fetchLanguage = async (headers) => {
  return await axios({
    method: "GET",
    url: `${BaseUrl}/language/v1/getAllLanguageByPagination/{pageNumber}/{pageSize}?pageNumber=0&pageSize=10`,
    headers: headers,
  });
};

//todo ==> GET DATA BY Langauage ID
export const getLanguageById = async (id, headers) => {
  return await axios({
    method: "GET",
    url: `${BaseUrl}/language/v1/getLanguageByLanguageId/{languageId}?languageId=${id}`,
    headers: headers,
  });
};

//todo ==> UPDATE Langauage DATA
export const updatedLang = async (updatedData, headers) => {
  console.log(updatedData);
  return await axios({
    method: "PUT",
    url: `${BaseUrl}/language/v1/updateLanguage`,
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

//todo ==> DELETE Langauage DATA
export const deleteLang = async (id, headers) => {
  await axios({
    method: "DELETE",
    url: `${BaseUrl}/language/v1/deleteLanguageById/${id}`,
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

//todo fetch the count for the Master language
export const fetchLangaugeCount = async (accessToken) => {
  const langaugeUrl = `${BaseUrl}/language/v1/getAllLanguageByPagination/{pageNumber}/{pageSize}?pageNumber=0&pageSize=10`;
  try {
    const response = await axios.get(langaugeUrl, {
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

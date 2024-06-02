import axios from "axios";
import { BaseUrl } from "../../BaseUrl";

//todo==>POST CATEGORY DATA
export const postCategoryData = async (cdata, headers) => {
  try {
    await axios({
      method: "POST",
      url: `${BaseUrl}/category/v1/createCategory`,
      headers: headers,
      data: JSON.stringify(cdata),
    }).then(function (res) {
      console.log(res);
      if (res.data.responseCode === 201) {
        alert("Category added successfully");
      } else {
        alert(res);
      }
    });
  } catch (err) {
    alert(err);
  }
};

//todo ==> GET  CATEGORY DATA
export const fetchCatergoryData = async (headers) => {
  return await axios({
    method: "GET",
    url: `${BaseUrl}/category/v1/getAllCategoryByPagination/{pageNumber}/{pageSize}?pageNumber=0&pageSize=10`,
    headers: headers,
  });
};

//todo ==> GET DATA BY  CATEGORY ID
export const getcategoryById = async (headers, id) => {
  return await axios({
    method: "GET",
    url: `https://virtullearning.cloudjiffy.net/BitStreamIOLMSWeb/category/v1/getCategoryByCategoryId/{categoryId}?categoryId=${id}`,
    headers: headers,
  });
};

// todo==> UPDATE  CATEGORY
export const updatedCategory = async (headers, updateddata) => {
  await axios({
    method: "PUT",
    url: "https://virtullearning.cloudjiffy.net/BitStreamIOLMSWeb/category/v1/updateCategory",
    headers: headers,
    data: JSON.stringify(updateddata),
  }).then(function (res) {
    if (res.data.responseCode === 201) {
      alert("Category Successfully updated");
    } else if (res.data.responseCode === 400) {
      alert(res.data.errorMessage);
    }
  });
};

//todo==>DELETE CAREGORY
export const deleteCategory = async (headers, id) => {
  await axios({
    method: "DELETE",
    url: `https://virtullearning.cloudjiffy.net/BitStreamIOLMSWeb/category/v1/deleteCategoryById/${id}`,
    headers: headers,
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
export const fetchCategoryCount = async (accessToken) => {
  const categoryUrl = `${BaseUrl}/category/v1/getAllCategoryByPagination/{pageNumber}/{pageSize}?pageNumber=0&pageSize=10`;
  try {
    const response = await axios.get(categoryUrl, {
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

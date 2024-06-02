import axios from "axios";
import { BaseUrl } from "../../BaseUrl";

export const PostStoreComp = async (sdata, headers) => {
  try {
    await axios({
      method: "POST",
      url: `${BaseUrl}/storebook/v1/createStoreBook`,
      headers: headers,
      data: JSON.stringify(sdata),
    }).then(function (res) {
      if (res.data.responseCode === 201) {
        alert("Store Created Succesfully");
      } else {
        alert(res);
      }
    });
  } catch (error) {
    alert(error);
  }
};

export const fetchStore = async (headers) => {
  return await axios({
    method: "get",
    url: `${BaseUrl}/storebook/v1/getAllStoreCourseByPagination/{pageNumber}/{pageSize}?pageNumber=0&pageSize=10`,
    headers: headers,
  });
};

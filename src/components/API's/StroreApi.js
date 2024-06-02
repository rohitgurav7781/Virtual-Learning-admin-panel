import axios from "axios";
import { BaseUrl } from "../../BaseUrl";

export const PostStore = async (sdata, headers) => {
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

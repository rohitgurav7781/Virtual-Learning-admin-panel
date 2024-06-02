import axios from "axios";

const baseURL = "https://virtullearning.cloudjiffy.net/BitStreamIOLMSWeb";

const fetchAdvertisements = async (accessToken) => {
  const advertisementsUrl = `${baseURL}/advertisement/v1/getAllAdvertisementByPagination/{pageNumber}/{pageSize}?pageNumber=0&pageSize=10`;

  try {
    const response = await axios.get(advertisementsUrl, {
      headers: {
        "Content-Type": "application/json",
        Authorization: ` Bearer ${accessToken}`,
      },
    });

    return response.data.content;
  } catch (error) {
    console.error("Error fetching advertisements:", error);
    throw error;
  }
};

const fetchCategories = async (accessToken) => {
  const categoriesUrl = `${baseURL}/category/v1/queryAllCategory`;

  try {
    const response = await axios.get(categoriesUrl, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

const fetchPromotions = async (accessToken) => {
  const promotionsUrl = `${baseURL}/promo/v1/getAllPromoByPagination/{pageNumber}/{pageSize}?pageNumber=0&pageSize=10`;

  try {
    const response = await axios.get(promotionsUrl, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data.content;
  } catch (error) {
    console.error("Error fetching promotions:", error);
    throw error;
  }
};

const fetchSuccessStories = async (accessToken) => {
  const successStoriesUrl = `${baseURL}/success/v1/getAllSuccessStoryByPagination/{pageNumber}/{pageSize}?pageNumber=0&pageSize=10`;

  try {
    const response = await axios.get(successStoriesUrl, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data.content;
  } catch (error) {
    console.error("Error fetching success stories:", error);
    throw error;
  }
};

const fetchNavNews = async (accessToken) => {
  const newsUrl = `${baseURL}/news/v1/getAllNewsByPagination/{pageNumber}/{pageSize}?pageNumber=0&pageSize=10`;

  try {
    const response = await axios.get(newsUrl, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data.content;
  } catch (error) {
    console.error("Error fetching success stories:", error);
    throw error;
  }
};

const fetchNotifications = async (accessToken) => {
  const notificationUrl = `${baseURL}/bulknotification/v1/getAllBulkNotificationByPagination/{pageNumber}/{pageSize}?pageNumber=0&pageSize=10`;

  try {
    const response = await axios.get(notificationUrl, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    // console.log(response.data);
    return response.data.content;
  } catch (error) {
    console.error("Error fetching notification :", error);
    throw error;
  }
};

const fetchUserAccount = async (accessToken, id) => {
  const notificationUrl = `${baseURL}/userprofile/v1/getUserProfileByUserId/{userId}?userId=${id}`;

  try {
    const response = await axios.get(notificationUrl, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    // console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching userName:", error);
    throw error;
  }
};

export {
  fetchAdvertisements,
  fetchCategories,
  fetchPromotions,
  fetchSuccessStories,
  fetchNotifications,
  fetchNavNews,
  fetchUserAccount,
};

import axios from "axios";

let apibaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/web/";

let productTabs = async () => {
  try {
    let staticPath = `${apibaseUrl.replace(/\/web\/?$/, "")}/uploads/product/`;
    let productsList = [];

    // Fetch full products list with productType ("Featured", "New", "On Sale")
    try {
      const searchRes = await axios.get(`${apibaseUrl}products/search?search=`, {
        timeout: 5000,
      });
      if (searchRes.data?.products && Array.isArray(searchRes.data.products)) {
        productsList = searchRes.data.products;
      }
    } catch (e) {
      console.log("products search API fallback:", e.message);
    }

    // Fetch home/product-tabs for staticPath and any extra data
    try {
      const tabRes = await axios.get(`${apibaseUrl}home/product-tabs`, {
        timeout: 5000,
      });
      if (tabRes.data?.staticPath) {
        staticPath = tabRes.data.staticPath;
      }
      if ((!productsList || productsList.length === 0) && tabRes.data?.data) {
        productsList = tabRes.data.data;
      }
    } catch (e) {
      console.log("home/product-tabs API fallback:", e.message);
    }

    return {
      status: 1,
      staticPath,
      data: productsList,
    };
  } catch (err) {
    console.log("productTabs API error:", err.message);
    return null;
  }
};

let Sliderr = async () => {
  try {
    const res = await axios.get(`${apibaseUrl}home/slider`, {
      timeout: 5000,
    });
    return res.data;
  } catch (err) {
    console.log("Sliderr API error:", err.message);
    return null;
  }
};

let review = async () => {
  try {
    const res = await axios.get(`${apibaseUrl}home/whychooseus`, {
      timeout: 5000,
    });
    return res.data;
  } catch (err) {
    console.log("review API error:", err.message);
    return null;
  }
};

export { productTabs, Sliderr, review };

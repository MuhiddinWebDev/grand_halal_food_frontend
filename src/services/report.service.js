import axios from "axios";
const END_POINT = "/report";

class Service {
  homeReport() {
    return axios.get(END_POINT + "/home").then((res) => {
      return res;
    });
  }
  productReportByCategory() {
    return axios.get(END_POINT + "/category-product").then((res) => {
      return res;
    });
  }
}
export default new Service();

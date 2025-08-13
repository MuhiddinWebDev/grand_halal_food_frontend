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
  orderByStatusChart(filter) {
    return axios.post(END_POINT + "/order-chart", filter).then((res) => {
      return res;
    });
  }
  saleTopProductReport(filter) {
    return axios.post(END_POINT + "/sale-top-product", filter).then((res) => {
      return res;
    });
  }

  omborReport(filter) {
    return axios.post(END_POINT + "/ombor-report", filter).then((res) => {
      return res;
    });
  }
  omborSverka(filter) {
    return axios.post(END_POINT + "/ombor-sverka", filter).then((res) => {
      return res;
    });
  }

  orderReport(filter) {
    return axios.post(END_POINT + "/order-report", filter).then((res) => {
      return res;
    });
  }
  orderSverka(filter) {
    return axios.post(END_POINT + "/order-sverka", filter).then((res) => {
      return res;
    });
  }
}
export default new Service();

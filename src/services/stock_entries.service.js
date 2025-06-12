import axios from "axios";
const END_POINT = "/stock-entries";

class Service {
  all(data) {
    return axios.post(END_POINT + "/all", data).then((res) => {
      return res;
    });
  }

   productResidual(data) {
    return axios.post(END_POINT + "/product-residual", data).then((res) => {
      return res;
    });
  }

  create(data) {
    return axios.post(END_POINT + "/create", data).then((res) => {
      return res;
    });
  }

  update(id, data) {
    return axios.patch(END_POINT + `/update/${id}`, data).then((res) => {
      return res;
    });
  }

  getOne(id) {
    return axios.get(END_POINT + `/getById/${id}`).then((res) => {
      return res;
    });
  }

  getBrandsByCategory(cat_id) {
    return axios.get(END_POINT + `/getBrandsByCat/${cat_id}`).then((res) => {
      return res;
    });
  }

  delete(id) {
    return axios.delete(END_POINT + `/delete/${id}`).then((res) => {
      return res;
    });
  }
}
export default new Service();

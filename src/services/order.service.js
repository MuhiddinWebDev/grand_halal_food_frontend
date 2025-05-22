import axios from "axios";
const END_POINT = "/order";

class Service {
  all(filter) {
    return axios.get(END_POINT + "/all").then((res) => {
      return res;
    });
  }

  create(data) {
    return axios.post(END_POINT + "/", data).then((res) => {
      return res;
    });
  }

  update(id, data) {
    return axios.patch(END_POINT + `/${id}`, data).then((res) => {
      return res;
    });
  }

  getOne(id) {
    return axios.get(END_POINT + `/${id}`).then((res) => {
      return res;
    });
  }

  delete(id) {
    return axios.delete(END_POINT + `/${id}`).then((res) => {
      return res;
    });
  }
}
export default new Service();

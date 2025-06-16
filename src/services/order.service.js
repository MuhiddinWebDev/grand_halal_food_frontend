import axios from "axios";
const END_POINT = "/order";

class Service {
  all(filter) {
    return axios.post(END_POINT + "/all", filter).then((res) => {
      return res;
    });
  }

  statusOption() {
    return axios.get(END_POINT + "/status").then((res) => {
      return res;
    });
  }

  create(data) {
    return axios.post(END_POINT + "/", data).then((res) => {
      return res;
    });
  }

  update(id, data) {
    return axios.patch(END_POINT + `/update${id}`, data).then((res) => {
      return res;
    });
  }

  updateStatus(id, data) {
    return axios.patch(END_POINT + `/updateStatus/${id}`, data).then((res) => {
      return res;
    });
  }

  updatePaid(id) {
    return axios.patch(END_POINT + `/paid/${id}`).then((res) => {
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

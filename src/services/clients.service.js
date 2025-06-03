import axios from "axios";
const END_POINT = "/client";

class Service {
  all(filter) {
    let url = filter?.text ? '?text=' + filter.text : '';
    return axios.get(END_POINT + "/all" + url).then((res) => {
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

  sendNotification(id) {
    return axios.get(END_POINT + `/send-notification/${id}`).then((res) => {
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

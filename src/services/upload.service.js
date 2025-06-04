import axios from "axios";
const END_POINT = "/upload-files";

class Service {

  delFile(file) {
    return axios.delete(END_POINT + `/del-file/${file}`).then((res) => {
      return res;
    });
  }

  downloadDatabase() {
    return axios.get(END_POINT + `/download-database`, {
      responseType: "blob"
    }).then((res) => {
      return res;
    });
  }

  uploadFile(data) {
    return axios
      .post(END_POINT + '/file', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res) => {
        return res
      })
  }
  uploadExcel(data) {
    return axios
      .post(END_POINT + '/excel', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res) => {
        return res
      })
  }

  uploadExcelStoreByPhone(data) {
    return axios
      .post(END_POINT + '/excel-store-phone', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res) => {
        return res
      })
  }

  uploadExcelBrand(data) {
    return axios
      .post(END_POINT + '/excel-brand', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res) => {
        return res
      })
  }

  uploadExcelCarType(data) {
    return axios
      .post(END_POINT + '/excel-car-type', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res) => {
        return res
      })
  }

  uploadExcelStore(data) {
    return axios
      .post(END_POINT + '/excel-store', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res) => {
        return res
      })
  }
}
export default new Service();

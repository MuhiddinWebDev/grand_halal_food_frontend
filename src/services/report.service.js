import axios from "axios";
const END_POINT = "/report";

class Service {

  homeReport() {
    return axios.get(END_POINT + "/home").then((res) => {
      return res;
    });
  }


  homePrixodReport(data) {
    return axios.post(END_POINT + "/home-rasxod", data).then((res) => {
      return res;
    });
  }

  rasxodReport(data) {
    return axios.post(END_POINT + "/rasxod-report", data).then((res) => {
      return res;
    });
  }

  rasxodSverka(data) {
    return axios.post(END_POINT + "/rasxod-sverka", data).then((res) => {
      return res;
    });
  }

  prixodReport(data) {
    return axios.post(END_POINT + "/prixod-report", data).then((res) => {
      return res;
    });
  }

  prixodSverka(data) {
    return axios.post(END_POINT + "/prixod-sverka", data).then((res) => {
      return res;
    });
  }

  orderReport(data) {
    return axios.post(END_POINT + "/order-report", data).then((res) => {
      return res;
    });
  }

  orderSverka(data) {
    return axios.post(END_POINT + "/order-sverka", data).then((res) => {
      return res;
    });
  }

  serviceReport(data) {
    return axios.post(END_POINT + "/service-report", data).then((res) => {
      return res;
    });
  }

  serviceSverka(data) {
    return axios.post(END_POINT + "/service-sverka", data).then((res) => {
      return res;
    });
  }

  refundReport(data) {
    return axios.post(END_POINT + "/refund-report", data).then((res) => {
      return res;
    });
  }

  refundSverka(data) {
    return axios.post(END_POINT + "/refund-sverka", data).then((res) => {
      return res;
    });
  }

  serialNumberReport(data) {
    return axios.post(END_POINT + "/serial-number-report", data).then((res) => {
      return res;
    });
  }

  smsServiceReport(data) {
    return axios.post(END_POINT + "/sms-report", data).then((res) => {
      return res;
    });
  }

  smsServiceSverka(data) {
    return axios.post(END_POINT + "/sms-sverka", data).then((res) => {
      return res;
    });
  }

  clientBatteryReport(data) {
    return axios.post(END_POINT + "/client-battery-report", data).then((res) => {
      return res;
    });
  }

  clientBatterySverka(data) {
    return axios.post(END_POINT + "/client-battery-sverka", data).then((res) => {
      return res;
    });
  }

  clientLoginReport(data) {
    return axios.post(END_POINT + "/client-login-report", data).then((res) => {
      return res;
    });
  }

  clientLoginSverka(data) {
    return axios.post(END_POINT + "/client-login-sverka", data).then((res) => {
      return res;
    });
  }


}
export default new Service();

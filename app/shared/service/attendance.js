import { API } from 'aws-amplify';

class service {
  unmarkedAttendance(body) {
    const init = {
      body,
    };
    return API.post('unmarked_attendance', '', init).then(res => res);
  }

  summaryAttendance(body) {
    const init = {
      body,
    };
    return API.post('summary_attendance', '', init).then(res => res);
  }

  summaryByClass(body) {
    const init = {
      body,
    };
    return API.post('summarybyclass', '', init).then(res => res);
  }

  childAttendance(body) {
    const init = {
      body,
    };
    return API.post('child_attendance', '', init).then(res => res);
  }

  markAttendance(body) {
    const init = {
      body,
    };
    return API.post('mark_attendance', '', init).then(res => res);
  }
}

export default new service();

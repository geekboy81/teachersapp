import { Auth } from 'aws-amplify';

// AWS Mobile Hub Project Constants
const setHeader = async () => {
  const token = (await Auth.currentSession()).idToken.jwtToken;
  return {
    Authorization: token,
    'content-type': 'application/json',
  };
};

const API = {
  endpoints: [
    {
      name: 'reset_password',
      endpoint:
        'https://36jllv9kxa.execute-api.us-east-1.amazonaws.com/dev/admin/users/resetpasswordflow',
      service: 'lambda',
      region: 'us-east-1',
      custom_header: setHeader,
    },
    {
      name: 'get_user_info',
      endpoint:
        'https://36jllv9kxa.execute-api.us-east-1.amazonaws.com/dev/admin/me',
      service: 'lambda',
      region: 'us-east-1',
      custom_header: setHeader,
    },
    {
      name: 'get_students',
      endpoint:
        'https://36jllv9kxa.execute-api.us-east-1.amazonaws.com/dev/admin/child',
      service: 'lambda',
      region: 'us-east-1',
      custom_header: setHeader,
    },
    {
      name: 'add_students',
      endpoint:
        'https://36jllv9kxa.execute-api.us-east-1.amazonaws.com/dev/admin/child/add',
      service: 'lambda',
      region: 'us-east-1',
      custom_header: setHeader,
    },
    {
      name: 'edit_students',
      endpoint:
        'https://36jllv9kxa.execute-api.us-east-1.amazonaws.com/dev/admin/child/update',
      service: 'lambda',
      region: 'us-east-1',
      custom_header: setHeader,
    },
    {
      name: 'delete_student',
      endpoint:
        'https://36jllv9kxa.execute-api.us-east-1.amazonaws.com/dev/admin/child/delete',
      service: 'lambda',
      region: 'us-east-1',
      custom_header: setHeader,
    },
    {
      name: 'search_user',
      endpoint:
        'https://36jllv9kxa.execute-api.us-east-1.amazonaws.com/dev/admin/users/search',
      service: 'lambda',
      region: 'us-east-1',
      custom_header: setHeader,
    },
    {
      name: 'bulupload',
      endpoint:
        'https://36jllv9kxa.execute-api.us-east-1.amazonaws.com/dev/admin/bulkupload',
      service: 'lambda',
      region: 'us-east-1',
      custom_header: setHeader,
    },
    {
      name: 'bulupload_status',
      endpoint:
        'https://36jllv9kxa.execute-api.us-east-1.amazonaws.com/dev/admin/bulkupload/status',
      service: 'lambda',
      region: 'us-east-1',
      custom_header: setHeader,
    },
    {
      name: 'get_users',
      endpoint:
        'https://36jllv9kxa.execute-api.us-east-1.amazonaws.com/dev/admin/users',
      service: 'lambda',
      region: 'us-east-1',
      custom_header: setHeader,
    },
    {
      name: 'add_users',
      endpoint:
        'https://36jllv9kxa.execute-api.us-east-1.amazonaws.com/dev/admin/users/add',
      service: 'lambda',
      region: 'us-east-1',
      custom_header: setHeader,
    },
    {
      name: 'add_users_db',
      endpoint:
        'https://36jllv9kxa.execute-api.us-east-1.amazonaws.com/dev/admin/users/adddb',
      service: 'lambda',
      region: 'us-east-1',
      custom_header: setHeader,
    },
    {
      name: 'edit_users',
      endpoint:
        'https://36jllv9kxa.execute-api.us-east-1.amazonaws.com/dev/admin/users/update',
      service: 'lambda',
      region: 'us-east-1',
      custom_header: setHeader,
    },
    {
      name: 'delete_users',
      endpoint:
        'https://36jllv9kxa.execute-api.us-east-1.amazonaws.com/dev/admin/users/delete',
      service: 'lambda',
      region: 'us-east-1',
      custom_header: setHeader,
    },
    {
      name: 'delete_users_db',
      endpoint:
        'https://36jllv9kxa.execute-api.us-east-1.amazonaws.com/dev/admin/users/deletedb',
      service: 'lambda',
      region: 'us-east-1',
      custom_header: setHeader,
    },
    {
      name: 'get_groups',
      endpoint:
        'https://36jllv9kxa.execute-api.us-east-1.amazonaws.com/dev/admin/groups',
      service: 'lambda',
      region: 'us-east-1',
      custom_header: setHeader,
    },
    {
      name: 'add_group',
      endpoint:
        'https://36jllv9kxa.execute-api.us-east-1.amazonaws.com/dev/admin/groups/add',
      service: 'lambda',
      region: 'us-east-1',
      custom_header: setHeader,
    },
    {
      name: 'delete_group',
      endpoint:
        'https://36jllv9kxa.execute-api.us-east-1.amazonaws.com/dev/admin/groups/delete',
      service: 'lambda',
      region: 'us-east-1',
      custom_header: setHeader,
    },
    {
      name: 'update_group',
      endpoint:
        'https://36jllv9kxa.execute-api.us-east-1.amazonaws.com/dev/admin/groups/update',
      service: 'lambda',
      region: 'us-east-1',
      custom_header: setHeader,
    },
    {
      name: 'get_users_count',
      endpoint:
        'https://36jllv9kxa.execute-api.us-east-1.amazonaws.com/dev/admin/dashboard/usercount',
      service: 'lambda',
      region: 'us-east-1',
      custom_header: setHeader,
    },
    {
      name: 'get_students_count',
      endpoint:
        'https://36jllv9kxa.execute-api.us-east-1.amazonaws.com/dev/admin/dashboard/studentcount',
      service: 'lambda',
      region: 'us-east-1',
      custom_header: setHeader,
    },
    {
      name: 'get_lastlogin',
      endpoint:
        'https://36jllv9kxa.execute-api.us-east-1.amazonaws.com/dev/admin/users/lastlogin',
      service: 'lambda',
      region: 'us-east-1',
      custom_header: setHeader,
    },
    {
      name: 'get_user_detail',
      endpoint:
        'https://36jllv9kxa.execute-api.us-east-1.amazonaws.com/dev/admin/users/details',
      service: 'lambda',
      region: 'us-east-1',
      custom_header: setHeader,
    },
    {
      name: 'get_user_child_spouse',
      endpoint:
        'https://36jllv9kxa.execute-api.us-east-1.amazonaws.com/dev/admin/users/students',
      service: 'lambda',
      region: 'us-east-1',
      custom_header: setHeader,
    },
    {
      name: 'add_groups_students_add',
      endpoint:
        'https://36jllv9kxa.execute-api.us-east-1.amazonaws.com/dev/admin/groups/students/add',
      service: 'lambda',
      region: 'us-east-1',
      custom_header: setHeader,
    },
    {
      name: 'child_group_delete',
      endpoint:
        'https://36jllv9kxa.execute-api.us-east-1.amazonaws.com/dev/admin/child/group-delete',
      service: 'lambda',
      region: 'us-east-1',
      custom_header: setHeader,
    },
    {
      name: 'get_child_by_id',
      endpoint:
        'https://36jllv9kxa.execute-api.us-east-1.amazonaws.com/dev/admin/child/id',
      service: 'lambda',
      region: 'us-east-1',
      custom_header: setHeader,
    },
    {
      name: 'unmarked_attendance',
      endpoint:
        'https://36jllv9kxa.execute-api.us-east-1.amazonaws.com/dev/admin/attendance/today/unmarked',
      service: 'lambda',
      region: 'us-east-1',
      custom_header: setHeader,
    },
    {
      name: 'summary_attendance',
      endpoint:
        'https://36jllv9kxa.execute-api.us-east-1.amazonaws.com/dev/admin/attendance/today/summary',
      service: 'lambda',
      region: 'us-east-1',
      custom_header: setHeader,
    },
    {
      name: 'summarybyclass',
      endpoint:
        'https://36jllv9kxa.execute-api.us-east-1.amazonaws.com/dev/admin/attendance/summarybyclass',
      service: 'lambda',
      region: 'us-east-1',
      custom_header: setHeader,
    },
    {
      name: 'child_attendance',
      endpoint:
        'https://36jllv9kxa.execute-api.us-east-1.amazonaws.com/dev/admin/child/attendance',
      service: 'lambda',
      region: 'us-east-1',
      custom_header: setHeader,
    },
    {
      name: 'mark_attendance',
      endpoint:
        'https://36jllv9kxa.execute-api.us-east-1.amazonaws.com/dev/admin/attendance/markattendance',
      service: 'lambda',
      region: 'us-east-1',
      custom_header: setHeader,
    },
    {
      name: 'get_photos',
      endpoint:
        'https://36jllv9kxa.execute-api.us-east-1.amazonaws.com/dev/admin/photos',
      service: 'lambda',
      region: 'us-east-1',
      custom_header: setHeader,
    },
    {
      name: 'send_invitation',
      endpoint:
        'https://36jllv9kxa.execute-api.us-east-1.amazonaws.com/dev/admin/sendinvitation',
      service: 'lambda',
      region: 'us-east-1',
      custom_header: setHeader,
    },
    {
      name: 'send_invitation_mark',
      endpoint:
        'https://36jllv9kxa.execute-api.us-east-1.amazonaws.com/dev/admin/sendinvitation/mark',
      service: 'lambda',
      region: 'us-east-1',
      custom_header: setHeader,
    },
    {
      name: 'add_scale',
      endpoint:
        'https://36jllv9kxa.execute-api.us-east-1.amazonaws.com/dev/report/add/scale',
      service: 'lambda',
      region: 'us-east-1',
      custom_header: setHeader,
    },
    {
      name: 'send_invitation_mark',
      endpoint:
        'https://36jllv9kxa.execute-api.us-east-1.amazonaws.com/dev/admin/sendinvitation/mark',
      service: 'lambda',
      region: 'us-east-1',
      custom_header: setHeader,
    },
    {
      name: 'get_module_highlights',
      endpoint:
        'https://36jllv9kxa.execute-api.us-east-1.amazonaws.com/dev/report/get/module-highlights',
      service: 'lambda',
      region: 'us-east-1',
      custom_header: setHeader,
    },
    {
      name: 'get_module_details',
      endpoint:
        'https://36jllv9kxa.execute-api.us-east-1.amazonaws.com/dev/report/get/module-details',
      service: 'lambda',
      region: 'us-east-1',
      custom_header: setHeader,
    },
    {
      name: 'add_slice',
      endpoint:
        'https://36jllv9kxa.execute-api.us-east-1.amazonaws.com/dev/report/add/slice',
      service: 'lambda',
      region: 'us-east-1',
      custom_header: setHeader,
    },
    {
      name: 'add_module',
      endpoint:
        'https://36jllv9kxa.execute-api.us-east-1.amazonaws.com/dev/report/add/module',
      service: 'lambda',
      region: 'us-east-1',
      custom_header: setHeader,
    },
    {
      name: 'add_update_marks',
      endpoint:
        'https://36jllv9kxa.execute-api.us-east-1.amazonaws.com/dev/report/add/marks',
      service: 'lambda',
      region: 'us-east-1',
      custom_header: setHeader,
    },
    {
      name: 'get_marks_for_child',
      endpoint:
        'https://36jllv9kxa.execute-api.us-east-1.amazonaws.com/dev/report/get/child-marks',
      service: 'lambda',
      region: 'us-east-1',
      custom_header: setHeader,
    },
    {
      name: 'get_scales',
      endpoint:
        'https://36jllv9kxa.execute-api.us-east-1.amazonaws.com/dev/report/get/scales',
      service: 'lambda',
      region: 'us-east-1',
      custom_header: setHeader,
    },
    {
      name: 'get_groups_report',
      endpoint:
        'https://36jllv9kxa.execute-api.us-east-1.amazonaws.com/dev/report/get/groups',
      service: 'lambda',
      region: 'us-east-1',
      custom_header: setHeader,
    },
    {
      name: 'delete_module',
      endpoint:
        'https://36jllv9kxa.execute-api.us-east-1.amazonaws.com/dev/report/delete/module',
      service: 'lambda',
      region: 'us-east-1',
      custom_header: setHeader,
    },
    {
      name: 'delete_scale',
      endpoint:
        'https://36jllv9kxa.execute-api.us-east-1.amazonaws.com/dev/report/delete/scale',
      service: 'lambda',
      region: 'us-east-1',
      custom_header: setHeader,
    },
    {
      name: 'get_studentsemesterdetails',
      endpoint:
        'https://36jllv9kxa.execute-api.us-east-1.amazonaws.com/dev/report/get/studentsemesterdetails',
      service: 'lambda',
      region: 'us-east-1',
      custom_header: setHeader,
    },
    {
      name: 'update_semester',
      endpoint:
        'https://36jllv9kxa.execute-api.us-east-1.amazonaws.com/dev/report/update/status',
      service: 'lambda',
      region: 'us-east-1',
      custom_header: setHeader,
    },
  ],
};

export default API;

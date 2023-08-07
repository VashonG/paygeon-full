//TODO: move all this code in the drapcode.js
const DATA_SOURCE_END_POINT = 'webhook/reload';
let projectId = localStorage.getItem('projectId');

const commonDataSourceFetch = async function (args) {
  let data = {
    connectorUuid: args.parameters.dataSourceId,
    projectUuid: projectId,
    waitTime: args.parameters.waitTime,
  };
  return await unSecuredPostCall(data, DATA_SOURCE_END_POINT);
};

const dataSourceFirebaseRealtimeDatabase = async function (args) {
  return await commonDataSourceFetch(args);
};

const dataSourceFirebaseFunction = async function (args) {
  return await commonDataSourceFetch(args);
};

const dataSourceFirebaseCloudFirestore = async function (args) {
  return await commonDataSourceFetch(args);
};

const dataSourceRestAPI = async function (args) {
  return await commonDataSourceFetch(args);
};

const dataSourceDatabase = async function (args) {
  return await commonDataSourceFetch(args);
};

const dataSourceGoogleSheet = async function (args) {
  return await commonDataSourceFetch(args);
};

const dataSourceAirtable = async function (args) {
  return await commonDataSourceFetch(args);
};

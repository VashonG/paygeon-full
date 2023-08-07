const allowedFiles = [
  'pdf',
  'doc',
  'docx',
  'xls',
  'xlsx',
  'csv',
  'txt',
  'rtf',
  'html',
  'zip',
  'mp3',
  'wma',
  'mpg',
  'flv',
  'avi',
  'jpg',
  'jpeg',
  'png',
  'gif',
];

const s3BucketURL = 'https://webconnect-upload.s3.ap-south-1.amazonaws.com';

const getClosest = function (elem, selector) {
  for (; elem && elem !== document; elem = elem.parentNode) {
    if (elem.matches(selector)) return elem;
  }
  return null;
};

function findAncestor(el, cls) {
  console.log('el: ', JSON.stringify(el));
  while ((el = el.parentElement) && !el.classList.contains(cls));
  return el;
}

const fileUpload = async (args) => {
  const uploadElement = args.target || args.srcElement;
  let fileDisplay = uploadElement.parentElement.getElementsByClassName('file-list-display')[0];
  const files = uploadElement.files;
  if (files.length > 0) {
    fileDisplay.innerHTML = 'Uploading.....';
    const parentForm = getClosest(uploadElement, '[data-js=collection-form]');
    let collectionId = parentForm ? parentForm.getAttribute('data-form-collection') : 'master';
    if (getClosest(uploadElement, '[data-js=sign-up-form]')) {
      collectionId = 'user';
    }
    let maxFiles = uploadElement ? uploadElement.getAttribute('data-max-file') : 1;
    const fieldId = uploadElement ? uploadElement.getAttribute('name') : 'master';
    let isMultiple = uploadElement.hasAttribute('multiple');
    maxFiles = isMultiple ? maxFiles || 5 : 1;
    const hiddenElement = document.querySelector(
      `input[name='${uploadElement.name}'][type='hidden']`,
    );

    if (files.length > maxFiles) {
      fileDisplay.innerHTML = `Only ${maxFiles} files can be uploaded at a time`;
    } else {
      const { endpoint, formData } = getFormDataAndEndPoint(files, collectionId, fieldId);
      try {
        const response = await multipartFormDataSecuredCall(formData, endpoint);
        if (response.status === 200) {
          const { fileNames, fileIds } = getFilesNameAndIdsFromResponse(response);
          hiddenElement.value = JSON.stringify(response.data); //store array
          fileDisplay.innerHTML = fileNames.toString();
        } else {
          fileDisplay.style.display = 'block';
          fileDisplay.innerHTML = response.data;
        }
      } catch (err) {
        console.log(err.response);
        fileDisplay.style.display = 'block';
        fileDisplay.innerHTML = err.response.data;
      }
    }
  }
};

const getFormDataAndEndPoint = (files, collectionId, fieldId) => {
  const formData = new FormData();
  let endpoint = `file/upload/${collectionId}/${fieldId}`;
  if (files.length > 1) {
    endpoint = `file/multi-upload/${collectionId}/${fieldId}`;
    Object.keys(files).forEach((key) => {
      formData.append('files', files[key]);
    });
  } else {
    formData.append('file', files[0]);
  }
  return { endpoint, formData };
};

const getFilesNameAndIdsFromResponse = (response) => {
  let fileNames = [];
  let fileIds = null;
  if (response.data.length > 1) {
    fileNames = response.data.map((file) => {
      return file.originalName;
    });
    fileIds = response.data.map((file) => {
      return file.uuid;
    });
  } else {
    fileNames = [response.data.originalName];
    fileIds = response.data.uuid;
  }
  return { fileNames, fileIds };
};

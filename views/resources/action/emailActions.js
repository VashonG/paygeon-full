const sendEmail = async function (args) {
  const { element, parameters } = args;
  const { sendTo, emailTemplate } = parameters;
  console.log('sendTo: ', sendTo, 'Email Template: ', emailTemplate);
  let toEmailAddress = element.elements[sendTo].value;
  const previousActionResponse = args.response;
  const emailTemplateData = previousActionResponse ? previousActionResponse.data : {};
  toEmailAddress = previousActionResponse ? previousActionResponse.data[sendTo] : toEmailAddress;
  const formData = { sendTo: toEmailAddress, templateData: emailTemplateData };
  if (toEmailAddress && emailTemplate) {
    const endpoint = 'email/send/' + emailTemplate;
    const response = await publicPostCall(formData, endpoint);
    return response;
  } else {
    console.log('Please provide email address and email template');
  }
  return null;
};

const sendDynamicEmail = async function (args) {
  const { parameters, targetElement } = args;
  let itemId = targetElement ? targetElement.getAttribute('data-item-id') : '';
  const previousResponse = args.response;
  itemId = previousResponse ? previousResponse.data['uuid'] : itemId;

  if (!itemId) {
    let previousActionResponse = sessionStorage.getItem('previousActionResponse');
    if (previousActionResponse) {
      previousActionResponse = JSON.parse(previousActionResponse);
      let collectionKey = `parentCollectionToPropagate`;
      if (previousActionResponse[collectionKey]) {
        let collectionName = previousActionResponse[collectionKey].name;
        let collectionItemId = previousActionResponse[collectionKey].uuid;
        itemId = collectionItemId;
      }
    }
    if (!itemId && previousResponse) {
      const { collectionSaveOrUpdateResponse } = previousResponse;
      const { data: collectionItemData } = collectionSaveOrUpdateResponse;
      itemId = collectionItemData.uuid;
    }
  }

  const formData = { itemId: itemId, templatesRules: parameters.templatesRules };
  let response = {};
  let result = {};
  if (parameters) {
    try {
      const endpoint = 'email/send-dynamic-mail/';
      result = await unSecuredPostCall(formData, endpoint);
      response.data = { ...previousResponse, ...result };
      response.status = 'success';
    } catch (error) {
      console.log('%c==> Error :>> ', 'color:yellow', error);
      if (error.response) {
        response.data = error.response;
        response.status = 'error';
      }
    }
  }
  return response;
};

const sendResetPasswordEmail = async function (args) {
  const { element, parameters } = args;
  const { sendTo, emailTemplate } = parameters;
  console.log('sendTo: ', sendTo, 'Email Template: ', emailTemplate);
  const toEmailAddress = element.elements[sendTo].value;
  let alertMessageDiv = element.getElementsByClassName('alert-message')[0];
  let successMessageDiv = element.getElementsByClassName('success-message')[0];
  let emailResponse = null;
  try {
    const emailApiEndpoint = 'email/send/' + emailTemplate;
    const emailFormData = { sendTo: toEmailAddress };
    emailResponse = await publicPostCall(emailFormData, emailApiEndpoint);
    if (emailResponse.status === 200) {
      element.reset();
      successMessageDiv.innerHTML = 'An email has been sent to this ' + toEmailAddress;
      successMessageDiv.style.display = 'block';
      alertMessageDiv.style.display = 'none';
    }
  } catch (e) {
    console.log(e.response);
    alertMessageDiv.innerHTML = e.response.data['message'];
    alertMessageDiv.style.display = 'block';
    successMessageDiv.style.display = 'none';
  }
  return emailResponse;
};

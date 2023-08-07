const showModal = async (args) => {
  const { targetElement } = args;
  const { modal: modalData, enableMultiSelect } = args.parameters;

  const modalIdList = modalData.split('!@#$#@!');
  const modalId = modalIdList[0]; // Modal Element ID
  const modalUUID = modalIdList[1]; // Snippet Modal UUID

  // Handling Bulk Update Feature
  let selectedCollectionItems = [];

  if (enableMultiSelect) {
    const parentTableDiv = targetElement.closest('[data-js="data-table"]');
    const parentTable = parentTableDiv.querySelector('table');
    const itemCheckboxes = parentTable.querySelectorAll('[data-gjs=' + 'dt-item-check' + ']');

    for (let index = 0; index < itemCheckboxes.length; index++) {
      if (itemCheckboxes[index].type == 'checkbox' && itemCheckboxes[index].checked) {
        if (itemCheckboxes[index]) {
          selectedCollectionItems.push(itemCheckboxes[index].getAttribute('data-item-id'));
        }
      }
    }
  }

  const endpoint = `projects/snippet-templates/${modalUUID}`;

  try {
    const response = await publicGetCall(endpoint);
    if (response && response.status === 200) {
      const modal = response.data;
      const modalHtml = modal.content['nocode-html'];
      const modalCss = modal.content['nocode-css'];
      const modalComponents = modal.content['nocode-components'];
      const defaultFormExist = checkComponents(modalComponents);
      const modalContainer = document.createElement('div');
      modalContainer.id = `modal-container-${modalId}`;
      modalContainer.innerHTML = ``;

      if (defaultFormExist) {
        let customThemesStyle = getCustomFormThemesStyle(defaultFormExist);
        modalContainer.innerHTML += `<style>${customThemesStyle}</style>`;
      }

      modalContainer.innerHTML += `<style>${modalCss}</style>`;
      modalContainer.innerHTML += modalHtml;
      document.body.appendChild(modalContainer); // Append Dynamic Modal Container to Page Body

      addModalExternalScriptUrl(modal, modalContainer);
      addModalCustomScript(modal, modalContainer);

      let element = targetElement;
      let elementCollectionId = element ? element.getAttribute('data-collection-id') : '';
      const elementItemId = element ? element.getAttribute('data-item-id') : '';

      if (defaultFormExist && !elementCollectionId) {
        if (modal.collectionId) {
          elementCollectionId = modal.collectionId;
        } else {
          const modalContainerId = modalContainer.getAttribute('id');
          const modalFormElems = extractModalFormComponent(modalContainerId);
          const modalFormElem = modalFormElems ? modalFormElems[0] : '';
          const dataFormCollection = modalFormElem
            ? modalFormElem.getAttribute('data-form-collection')
            : '';

          elementCollectionId = dataFormCollection;
        }
      }

      if (elementCollectionId) {
        // Load Dynamic Data From Session or DB
        const collectionItemData = { collectionId: elementCollectionId, itemId: elementItemId };
        const { itemData, collectionId, collectionItemId } = await getModalItemData(
          collectionItemData,
        );

        const listComponents = extractModalFormComponents(modalComponents);
        await checkAndCreateValidationJS(listComponents, modalContainer);

        loadDynamicFilterDataIntoElements(true);

        const dataField = `data-${collectionId}`;
        const dataURLField = `data-url-${collectionId}`;
        const dataImageTag = `data-img-src-${collectionId}`;
        const dataVideoTag = `data-video-src-${collectionId}`;
        const dataAudioTag = `data-audio-src-${collectionId}`;

        if (collectionId && collectionItemId && itemData) {
          let hyperLinks = document.querySelectorAll(
            '[id^=modal-container] [data-path-collection-name]',
          );
          let imageElements = document.querySelectorAll(
            '[id^=modal-container] [' + dataImageTag + ']',
          );
          let videoElements = document.querySelectorAll(
            '[id^=modal-container] [' + dataVideoTag + ']',
          );
          let audioElements = document.querySelectorAll(
            '[id^=modal-container] [' + dataAudioTag + ']',
          );
          let textContentElements = document.querySelectorAll(
            '[id^=modal-container] [' + dataField + ']',
          );
          let urlContentElements = document.querySelectorAll(
            '[id^=modal-container] [' + dataURLField + ']',
          );
          let allPageButtonsAndLinks = document.querySelectorAll(
            '[id^=modal-container] a, [id^=modal-container] button',
          );
          if (
            (textContentElements ||
              imageElements ||
              hyperLinks ||
              urlContentElements ||
              videoElements ||
              audioElements) &&
            collectionId &&
            collectionItemId
          ) {
            if (itemData) {
              textContentElements.forEach((textElement) => {
                let fieldName = textElement.getAttribute(dataField);
                let type = textElement.getAttribute('type');
                if (fieldName.includes('"') && 'functionType' in JSON.parse(fieldName)) {
                  textElement.textContent = getDerivedFieldData(fieldName, itemData);
                } else {
                  if (type === 'reference' || type === 'multi_reference' || type === 'belongsTo') {
                    const { nestedFieldName } = JSON.parse(textElement.getAttribute('metaData'));
                    if (!fieldName.includes('.')) {
                      fieldName = fieldName + '.' + nestedFieldName;
                    }
                  }
                  //TODO: testing on bases field type (only for boolean now)
                  const fieldType = textElement.getAttribute('data-field-type');
                  const value = parseValueFromData(itemData, fieldName) || '';
                  if (htmlRegex.test(value)) {
                    textElement.innerHTML = value;
                  } else if (fieldType === 'boolean') {
                    textElement.textContent = value ? 'Yes' : 'No';
                  } else {
                    textElement.textContent = value;
                  }
                }
                textElement.style.display = 'block';
              });
              hyperLinks.forEach((element) => {
                const fieldName = element.getAttribute('data-path-field-name');
                if (fieldName) {
                  if (
                    !(
                      element.hasAttribute('data-gjs') &&
                      element.getAttribute('data-gjs') === 'data-table-link'
                    )
                  ) {
                    const href = element.getAttribute('href');
                    let fieldHref = fieldName ? parseValueFromData(itemData, fieldName) : '';
                    fieldHref = fieldHref.split(', ');
                    fieldHref = fieldHref[0];
                    const replaceHref = href.replace(fieldName, fieldHref);
                    element.setAttribute('href', replaceHref);
                  }
                }
              });
              urlContentElements.forEach((element) => {
                const fieldType = element.getAttribute('data-field-type');
                if (fieldType === 'file') {
                  replaceContentOfFileLinkElements(itemData, element, dataURLField);
                } else {
                  const fieldName = element.getAttribute(dataURLField);
                  const href = element.getAttribute(dataURLField);
                  const replaceHref = href.replace(
                    fieldName,
                    parseValueFromData(itemData, fieldName),
                  );
                  element.setAttribute('href', replaceHref);
                }
              });
              imageElements.forEach((imageElement) => {
                const fieldName = imageElement.getAttribute(dataImageTag);
                let itemImageData = fieldName ? parseValueFromData(itemData, fieldName) : '';
                if (Array.isArray(itemImageData)) {
                  itemImageData = itemImageData[0];
                }
                let imageSrcUrl;
                if (itemImageData) {
                  if (typeof itemImageData === 'object') {
                    const imageKey = itemImageData.key;
                    if (imageKey) imageSrcUrl = IMAGE_SERVER_URL + imageKey;
                  } else if (
                    typeof itemImageData === 'string' &&
                    itemImageData.startsWith('http')
                  ) {
                    imageSrcUrl = itemImageData;
                  }
                  imageElement.src = imageSrcUrl;
                }
              });
              videoElements.forEach((videoElement) => {
                const fieldName = videoElement.getAttribute(dataVideoTag);
                const videoType = videoElement.getAttribute('data-video-type');
                let itemVideoData = fieldName ? parseValueFromData(itemData, fieldName) : '';
                if (itemVideoData && ['youtube-nocookie', 'youtube', 'vimeo'].includes(videoType)) {
                  const iframeVideoSrc = videoElement.getAttribute('src');
                  videoElement.src = iframeVideoSrc
                    ? getIframeVideoUrlForYoutubeOrVimeo(iframeVideoSrc, itemVideoData, videoType)
                    : '';
                } else if (itemVideoData) {
                  videoElement.src = itemVideoData;
                } else {
                  videoElement.src = '';
                }
              });
              audioElements.forEach((audioElement) => {
                const fieldName = audioElement.getAttribute(dataAudioTag);
                const audioType = audioElement.getAttribute('data-audio-type');
                const isAutoplay = audioElement.hasAttribute('autoplay')
                  ? audioElement.getAttribute('autoplay')
                  : false;
                const itemAudioData = fieldName ? parseValueFromData(itemData, fieldName) : '';

                if (itemAudioData) {
                  if (audioType === 'file') {
                    audioElement.src = IMAGE_SERVER_URL + itemAudioData.key;
                  } else {
                    audioElement.src = itemAudioData;
                  }
                  if (isAutoplay) {
                    audioElement.autoplay = true;
                    audioElement.play();
                  }
                } else {
                  audioElement.src = '';
                }
              });
              allPageButtonsAndLinks.forEach((element) => {
                const isParentIsCMS = element.closest(
                  '[data-js="data-table"], [data-js="data-group"], [data-js="child-data-group"], [data-js="data-list"],[data-js="search-form"] ',
                );
                if (!isParentIsCMS) element.setAttribute('data-item-id', itemData['uuid']);
              });
            }
          }

          const formEl = document.querySelector(
            '[id^=modal-container] [data-form-collection=' + collectionId + ']',
          );

          if (formEl) {
            collectionFormDetailForModalUpdate(formEl, itemData, collectionItemData);
          }
        } else {
          const formEl = document.querySelector(
            '[id^=modal-container] [data-form-collection=' + elementCollectionId + ']',
          );

          if (formEl) {
            collectionFormDetailForModal(formEl, collectionItemData);

            if (enableMultiSelect) {
              const selectedItemsInputElem = document.createElement('input');
              selectedItemsInputElem.type = 'hidden';
              selectedItemsInputElem.id = 'selectedItemsIds';
              selectedItemsInputElem.name = 'selectedItemsIds';
              selectedItemsInputElem.value = selectedCollectionItems;
              formEl.appendChild(selectedItemsInputElem);
            }
          }
        }
        await addDynamicDataIntoFormElements(itemData, true);
      } else {
        await addDynamicDataIntoFormElements(null, true);
      }
      loadSessionDataIntoElements(true);
      loadPreviousActionResponseDataIntoElements(true);

      //Check for Field Types and Apply modifying functions
      checkForTextAreaType();
      checkForDateType();
      checkForTelType();
      checkForSelectType();

      const modalDiv = document.getElementById(modalId);
      modalDiv.classList.remove('show');
      modalDiv.classList.add('show');
    }
  } catch (e) {
    console.log('Error: ', e.response);
  }
  return null;
};

const closeModal = (args) => {
  let el = args.element;
  let foundParent = false;

  while (el && el.parentNode && !foundParent) {
    el = el.parentNode;
    if (el.classList && el.classList.contains('modal')) {
      foundParent = true;
    }
  }
  if (typeof el.classList !== 'undefined') {
    let clearModalContainer = false;

    if (el.classList.contains('show')) {
      clearModalContainer = true;
    }

    el.classList.toggle('show');
    const modalId = el.getAttribute('id');

    if (clearModalContainer) {
      const modalContainer = document.querySelector(`#modal-container-${modalId}`);
      modalContainer.innerHTML = ``;
      modalContainer.remove();
    }
  }
  return null;
};

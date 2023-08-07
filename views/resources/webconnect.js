window.addEventListener('DOMContentLoaded', async function () {
  // Register service worker to control making site work offline
  await registerServiceWorker();
  searchQueryFromURL();
  loadDynamicFilterDataIntoElements();

  const { itemData, collectionId, collectionItemId } = await getPageItemData();

  const dataField = `data-${collectionId}`;
  const dataURLField = `data-url-${collectionId}`;
  const dataImageTag = `data-img-src-${collectionId}`;
  const dataVideoTag = `data-video-src-${collectionId}`;
  const dataAudioTag = `data-audio-src-${collectionId}`;
  if (collectionId && collectionItemId && itemData) {
    let hyperLinks = window.document.querySelectorAll('[data-path-collection-name]');
    let imageElements = window.document.querySelectorAll(`[${dataImageTag}]`);
    let videoElements = window.document.querySelectorAll(`[${dataVideoTag}]`);
    let audioElements = window.document.querySelectorAll(`[${dataAudioTag}]`);
    let textContentElements = window.document.querySelectorAll(`[${dataField}], [data-filter-id]`);
    let urlContentElements = window.document.querySelectorAll(`[${dataURLField}]`);
    let allPageButtonsAndLinks = window.document.querySelectorAll('a, button');
    console.log(
      'loadDataTable dataField: ',
      dataField,
      'dataURLField: ',
      dataURLField,
      'urlContentElements: ',
      urlContentElements,
      'itemData::',
      itemData,
      'hyperLinks:::',
      hyperLinks,
      'textContentElements:::',
      textContentElements,
    );
    if (
      (textContentElements || imageElements || hyperLinks || urlContentElements || videoElements) &&
      collectionId &&
      collectionItemId
    ) {
      if (itemData) {
        textContentElements.forEach((textElement) => {
          let fieldName = textElement.getAttribute(dataField);
          let type = textElement.getAttribute('type');
          if (!fieldName) {
            textElement.style.display = 'block';
          } else {
            if (fieldName.includes('"') && 'functionType' in JSON.parse(fieldName)) {
              textElement.textContent = getDerivedFieldData(fieldName, itemData);
            } else {
              if (type === 'reference' || type === 'multi_reference' || type === 'belongsTo') {
                const { nestedFieldName } = JSON.parse(textElement.getAttribute('metaData'));
                if (!fieldName.includes('.')) {
                  fieldName = fieldName + '.' + nestedFieldName;
                }
              }

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
          }
        });
        hyperLinks.forEach((element) => {
          const fieldName = element.getAttribute('data-path-field-name');
          if (fieldName && !element.getAttribute('data-path-collection-item-id-from')) {
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
            const replaceHref = href.replace(fieldName, parseValueFromData(itemData, fieldName));
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
              imageSrcUrl = itemImageData.isExternalUrl
                ? itemImageData.url
                : imageKey
                ? IMAGE_SERVER_URL + imageKey
                : imageSrcUrl;
            } else if (typeof itemImageData === 'string' && itemImageData.startsWith('http')) {
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
          if (
            element?.tagName === 'A' &&
            element.getAttribute('data-path-collection-item-id-from') === 'pageCollection'
          ) {
            const elementWithHrefWithItemValue = renderLinkColumnData(itemData, element);
            $(element).replaceWith(elementWithHrefWithItemValue);
          }
          if (!isParentIsCMS) {
            element.setAttribute('data-item-id', itemData['uuid']);
            element.setAttribute('data-collection-id', collectionId);

            const snipCartElem = window.document.getElementById('snipcart');
            const isSnipCartActive = typeof snipCartElem != 'undefined' && snipCartElem != null;
            if (isSnipCartActive && element.classList.contains('snipcart-add-item')) {
              loadSnipcartItemData(element, itemData);
            }
          }
        });
      }
    }

    const formEl = document.querySelector('[data-form-collection=' + collectionId + ']');
    if (formEl) {
      collectionFormDetailForUpdate(formEl, itemData);
    }
  }
  if (itemData && itemData !== 'undefined') {
    await addDynamicDataIntoFormElements(itemData);
  } else {
    await addDynamicDataIntoFormElements();
  }
  loadSessionDataIntoElements();
  loadPreviousActionResponseDataIntoElements();
});

const loadSessionDataIntoElements = (isModal = false) => {
  let sessionAttributes = document.querySelectorAll('[data-session]');

  if (isModal) {
    sessionAttributes = document.querySelectorAll('[id^=modal-container] [data-session]');
  }

  if (sessionAttributes) {
    const loggedInUserData = localStorage.getItem('user')
      ? localStorage.getItem('user').replaceAll("'", '"')
      : '';
    if (loggedInUserData && loggedInUserData !== 'undefined') {
      const loggedInUser = JSON.parse(loggedInUserData);
      sessionAttributes.forEach((element) => {
        const fieldName = element.getAttribute('data-session');
        const fieldType = element.getAttribute('data-field-type');

        //TODO:need more reliable way to fix this
        if ((fieldType && fieldType === 'file') || element?.tagName === 'IMG') {
          let itemImageData = fieldName ? parseValueFromData(loggedInUser, fieldName) : '';
          if (Array.isArray(itemImageData)) {
            itemImageData = itemImageData[0];
          }
          let imageSrcUrl;
          if (itemImageData) {
            if (typeof itemImageData === 'object') {
              const imageKey = itemImageData.key;
              if (imageKey) imageSrcUrl = IMAGE_SERVER_URL + imageKey;
            } else if (typeof itemImageData === 'string' && itemImageData.startsWith('http')) {
              imageSrcUrl = itemImageData;
            }
            element.src = imageSrcUrl;
          }
        } else if (
          element?.tagName === 'A' &&
          element.getAttribute('data-path-collection-item-id-from') === 'session'
        ) {
          const elementWithHrefWithItemValue = renderLinkColumnData(loggedInUser, element);
          $(element).replaceWith(elementWithHrefWithItemValue);
        } else {
          //TODO: this style is temporary solution to show hidden element which we hide on proejct build->
          //default text does not appear on page load
          element.style.display = 'block';
          if (fieldName.includes('"') && 'functionType' in JSON.parse(fieldName)) {
            element.textContent = getDerivedFieldData(fieldName, loggedInUser);
          } else {
            element.textContent = loggedInUser ? parseValueFromData(loggedInUser, fieldName) : '';
          }
        }
      });
    }
  }
};

const loadPreviousActionResponseDataIntoElements = (isModal = false) => {
  let previosActionResponseAttributes = document.querySelectorAll(
    '[data-previous-action-response]',
  );
  if (isModal) {
    previosActionResponseAttributes = document.querySelectorAll(
      '[id^=modal-container] [data-previous-action-response]',
    );
  }
  if (previosActionResponseAttributes) {
    const previousActionResponse = JSON.parse(sessionStorage.getItem('previousActionResponse'));
    if (previousActionResponse && previousActionResponse !== 'undefined') {
      previosActionResponseAttributes.forEach((element) => {
        const fieldName = element.getAttribute('data-previous-action-response');

        if (element?.tagName === 'IMG' || element?.tagName === 'IFRAME') {
          let imageSrcUrl = fieldName ? parseValueFromData(previousActionResponse, fieldName) : '';
          element.src = imageSrcUrl;
        } else {
          element.textContent = fieldName
            ? parseValueFromData(previousActionResponse, fieldName)
            : '';
        }
      });
    }
  }
};

const loadSnipcartItemData = (element, itemData) => {
  const itemName = elementAttribute(element, 'data-item-name');
  const itemPrice = elementAttribute(element, 'data-item-price');
  const itemDescription = elementAttribute(element, 'data-item-description');
  const itemImageURL = elementAttribute(element, 'data-item-image');
  const collectionName = elementAttribute(element, 'data-collection-id');

  if (itemData[itemName]) {
    element.setAttribute('data-item-name', itemData[itemName]);
  }
  if (itemData[itemPrice]) {
    element.setAttribute('data-item-price', itemData[itemPrice]);
  }
  if (itemData[itemDescription]) {
    element.setAttribute('data-item-description', itemData[itemDescription]);
  }
  if (itemData[itemImageURL]) {
    if (typeof itemData[itemImageURL] === 'object') {
      const imgSrcURL = IMAGE_SERVER_URL + itemData[itemImageURL].key;
      element.setAttribute('data-item-image', imgSrcURL);
    } else {
      element.setAttribute('data-item-image', itemData[itemImageURL]);
    }
  }
  if (itemData['uuid'] && itemData[itemPrice]) {
    element.setAttribute(
      'data-item-url',
      `${collectionName}/${itemData['uuid']}/${itemData[itemPrice]}/validate-product.json`,
    );
  }
};

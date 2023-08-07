const stripeConnectCheckout = async (event) => {
  event.preventDefault();
  const targetData = event.target;

  console.log('==> stripeConnectCheckout :>> ');

  const priceField = targetData.attributes['data-item-price'].value;
  const nameField = targetData.attributes['data-item-name'].value;
  const descriptionField = targetData.attributes['data-item-description'].value;
  const itemUuid = targetData.attributes['data-item-id'].value;
  const collectionName = targetData.attributes['data-collection-id'].value;
  const selectedCollectionData = targetData.attributes['selectedcollectiondata'].value;

  if (!priceField) {
    toastr.error('Price Field is blank', 'Error');
    return;
  }
  if (!nameField) {
    toastr.error('Name Field is blank', 'Error');
    return;
  }
  if (!descriptionField) {
    toastr.error('Description Field is blank', 'Error');
    return;
  }
  if (!itemUuid) {
    toastr.error('Product Field is blank', 'Error');
    return;
  }
  if (!collectionName) {
    toastr.error('Collection Name is blank', 'Error');
    return;
  }

  const response = await securedPostCall(
    {
      itemUuid,
      priceField,
      collectionName,
      nameField,
      descriptionField,
      selectedCollectionData,
    },
    `stripe-connect/process-checkout`,
  );
  const { data: apiData } = response;
  if (apiData) {
    if (apiData.code === 303) {
      toastr.success('Successfull!', 'Success');
      if (apiData.url) window.open(apiData.url, '_blank');
    }
  }
};

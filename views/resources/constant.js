const getBackendServerUrl = () => {
  return "/api/v1/";
};

const IMAGE_SERVER_URL =
  "https://webconnect-upload.s3.ap-south-1.amazonaws.com/";
const formDefaultStyle = `
.dc-form-default.dc-form-bordered {
  border: 1px solid #dddddd;
  padding: 30px;
}

.dc-form-default .form-group .form-control {
  border-radius: 0;
}

.dc-form-default blockquote,
.dc-form-default dd,
.dc-form-default dl,
.dc-form-default fieldset,
.dc-form-default figure,
.dc-form-default h1,
.dc-form-default h2,
.dc-form-default h3,
.dc-form-default h4,
.dc-form-default h5,
.dc-form-default h6,
.dc-form-default hr,
.dc-form-default legend,
.dc-form-default ol,
.dc-form-default p,
.dc-form-default pre,
.dc-form-default ul {
  margin: 0;
  padding: 0
}

.dc-form-default li>ol,
.dc-form-default li>ul {
  margin-bottom: 0
}

.dc-form-default table {
  border-collapse: collapse;
  border-spacing: 0
}

.dc-form-default fieldset {
  min-width: 0;
  border: 0
}

.dc-form-default h1,
.dc-form-default h2,
.dc-form-default h3,
.dc-form-default h4,
.dc-form-default h5,
.dc-form-default h6 {
  font-weight: 400
}


.dc-form-default .no-border-bottom {
  border-bottom: none !important
}


.dc-form-default.no-border-bottom {
  border-bottom: none !important
}

.iti__selected-flag {
  height: 50px;
}

.dc-form-default input,
.dc-form-default select {
  height: 50px;
  padding: 0 15px;
}

.dc-form-default .form-group {
  margin-top: 20px;
  -webkit-box-flex: 0;
  -ms-flex: 0 0 100%;
  flex: 0 0 100%;
}

.dc-form-default .form-group a:hover {
  color: #03a9f4;
}

.dc-form-default .form-group a {
  color: #666;
}

.dc-form-default :not([class~=note-editor]) .dc-button,
.dc-form-default :not([class~=note-editor]) a.dc-button,
.dc-form-default :not([class~=note-editor]) button.dc-button {
  height: 50px;
  line-height: 48px;
  padding: 0 40px;
  display: inline-block;
  overflow: hidden;
  position: relative;
  z-index: 1;
  vertical-align: middle;
  margin-right: 10px;
  margin-bottom: 10px;
  border: 1px solid;
}

.dc-form-default :not([class~=note-editor]) .dc-btn--blue,
.dc-form-default :not([class~=note-editor]) a.dc-btn--blue,
.dc-form-default :not([class~=note-editor]) button.dc-btn--blue {
  background: #03a9f4;
  color: #ffffff;
  border: 1px solid #03a9f4;
}

.dc-form-default .dc-btn--blue,
.dc-form-default a.dc-btn--blue,
.dc-form-default button.dc-btn--blue,
.dc-form-default button:focus,
.dc-form-default button:active,
.dc-form-default select:focus,
.dc-form-default select:active,
.dc-form-default .dc-slider-arrow-prev,
.dc-form-default .dc-slider-arrow-next,
.dc-form-default .dc-pagination ul li.is-active a,
.dc-form-default .dc-pagination ul li a:hover,
.dc-form-default blockquote,
.dc-form-default :not([class~=note-editor]) input[type="checkbox"]:checked~label::before,
.dc-form-default :not([class~=note-editor]) input[type="radio"]:checked~label::before {
  border-color: #03a9f4;
}

.dc-form-default .dc-btn--blue,
.dc-form-default a.dc-btn--blue,
.dc-form-default button.dc-btn--blue,
.dc-form-default button:focus,
.dc-form-default button:active,
.dc-form-default select:focus,
.dc-form-default select:active,
.dc-form-default .dc-slider-arrow-prev,
.dc-form-default .dc-slider-arrow-next,
.dc-form-default .dc-pagination ul li.is-active a,
.dc-form-default .dc-pagination ul li a:hover,
.dc-form-default blockquote,
.dc-form-default :not([class~=note-editor]) input[type="checkbox"]:checked~label::before,
.dc-form-default :not([class~=note-editor]) input[type="radio"]:checked~label::before {
  background: #03a9f4;
}


.dc-form-default :not([class~=note-editor]) input[type="checkbox"]:checked~label,
.dc-form-default :not([class~=note-editor]) input[type="radio"]:checked~label,
.dc-form-default :not([class~=note-editor]) input[type="checkbox"]:checked~label::before,
.dc-form-default :not([class~=note-editor]) input[type="radio"]:checked~label::before {
  color: #03a9f4;
}

.dc-form-default .dc-btn--blue:hover,
.dc-form-default a.dc-btn--blue:hover,
.dc-form-default button.dc-btn--blue:hover {
  background: #019ce1;
}

.dc-form-default :not([class~=note-editor]) input[type="checkbox"].dc-checkbox,
.dc-form-default :not([class~=note-editor]) input[type="radio"].dc-radio {
  opacity: 0;
  display: inline-block;
  vertical-align: middle;
  box-sizing: border-box;
  padding: 0;
  height: 15px;
  width: 15px;
}

.dc-form-default :not([class~=note-editor]) input[type="checkbox"]~label:not([class~=error]),
.dc-form-default :not([class~=note-editor]) input[type="radio"]~label:not([class~=error]) {
  position: relative;
  padding-left: 24px;
  cursor: pointer;
}

.dc-form-default :not([class~=note-editor]) input[type="checkbox"]:checked~label:not([class~=error])::before {
  content: "\\f00c";
  color: #03a9f4;
  border-color: #03a9f4;
  background: transparent;
}

.dc-form-default :not([class~=note-editor]) input[type="radio"]:checked~label:not([class~=error])::before {
  content: "\\f192";
  color: #03a9f4;
  border-color: #03a9f4;
  background: transparent;
}

.dc-form-default :not([class~=note-editor]) input[type="checkbox"]~label:not([class~=error])::before {
  content: "";
  font-family: 'Font Awesome 5 free';
  font-weight: 700;
  position: absolute;
  left: 0;
  top: 5px;
  border: 1px solid #dddddd;
  height: 15px;
  width: 15px;
  line-height: 1;
  font-size: 13px;
}

.dc-form-default :not([class~=note-editor]) input[type="radio"]~label:not([class~=error])::before {
  content: "";
  font-family: 'Font Awesome 5 free';
  font-weight: 700;
  position: absolute;
  left: 0;
  top: 5px;
  border: 1px solid #dddddd;
  height: 15px;
  width: 15px;
  line-height: 1.5;
  font-size: 9px;
  border-radius: 50%;
  text-align: center;
}

.dc-form-default :not([class~=note-editor]) input[type="checkbox"]~label:not([class~=error]),.dc-form-default :not([class~=note-editor]) input[type="radio"]~label:not([class~=error]) {
  order: 1;
  width: 100%;
}

.dc-form-default :not([class~=note-editor]) input[type="checkbox"]~label[class~=error],
.dc-form-default :not([class~=note-editor]) input[type="radio"]~label[class~=error] {
  order: 2;
}

.dc-form-default td.active {
  background-color: #2c6ed5
}

.dc-form-default input[type="date"i] {
  padding: 14px
}

.dc-form-default .table-condensed td,
.table-condensed th {
  font-size: 14px;
  font-family: "Roboto", "Arial", "Helvetica Neue", sans-serif;
  font-weight: 400
}

.dc-form-default .daterangepicker td {
  width: 40px;
  height: 30px
}

.dc-form-default .daterangepicker {
  border: none;
  -webkit-box-shadow: 0 8px 20px 0 rgba(0, 0, 0, 0.15);
  -moz-box-shadow: 0 8px 20px 0 rgba(0, 0, 0, 0.15);
  box-shadow: 0 8px 20px 0 rgba(0, 0, 0, 0.15);
  display: none;
  border: 1px solid #e0e0e0;
  margin-top: 5px
}

.daterangepicker::before,
.dc-form-default .daterangepicker::after {
  display: none
}

.dc-form-default .daterangepicker thead tr th {
  padding: 10px 0
}

.dc-form-default .daterangepicker .table-condensed th select {
  border: 1px solid #ccc;
  -webkit-border-radius: 3px;
  -moz-border-radius: 3px;
  border-radius: 3px;
  font-size: 14px;
  padding: 5px;
  outline: none
}

.dc-form-default .form-group input:not(class*='note*'),
.dc-form-default .form-group textarea:not(class*='note*') {
  outline: none;
  margin: 0;
  -webkit-box-shadow: none;
  -moz-box-shadow: none;
  box-shadow: none;
  width: 100%;
  font-size: 14px;
  font-family: inherit
}

.dc-form-default input[class~=note-editor] input {
  width: auto;
}

.dc-form-default .input-group {
  position: relative;
  margin-bottom: 32px;
  border-bottom: 1px solid #e5e5e5
}

.dc-form-default .form-group label {
  color: #666;
  background: transparent;
}

.dc-form-default .form-check label {
  color: #666;
  background: transparent;
}

.dc-form-default .input-icon {
  position: absolute;
  font-size: 18px;
  color: #ccc;
  right: 8px;
  top: 50%;
  -webkit-transform: translateY(-50%);
  -moz-transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  -o-transform: translateY(-50%);
  transform: translateY(-50%);
  cursor: pointer
}

.dc-form-default .form-group a {
  -webkit-transition: all 0.3s ease-in-out 0s;
  -o-transition: all 0.3s ease-in-out 0s;
  transition: all 0.3s ease-in-out 0s;
}

.dc-form-default a:hover,
.dc-form-default a:focus,
.dc-form-default a:active {
  text-decoration: none;
  outline: none;
}

.dc-form-default .form-group input,
.dc-form-default .form-group textarea {
  color: #666;
  font-size: 14px;
  font-weight: normal
}

.dc-form-default input::placeholder,
.dc-form-default textarea::placeholder,
.dc-form-default select::placeholder {
  color: #808080;
  font-weight: lighter;
}

.dc-form-default::selection {
  background: #03a9f4;
}

.dc-form-default .input--style::-webkit-input-placeholder,
.dc-form-default .input--style:-ms-input-placeholder,
.dc-form-default .input--style:-ms-input-placeholder,
.dc-form-default .input::-webkit-input-placeholder,
.dc-form-default .input:-ms-input-placeholder,
.dc-form-default .input:-ms-input-placeholder {
  color: #808080;
  font-weight: normal
}

.dc-form-default .input--style:-moz-placeholder,
.dc-form-default .input--style::-moz-placeholder,
.dc-form-default .input:-moz-placeholder,
.dc-form-default .input::-moz-placeholder {
  color: #808080;
  opacity: 0.5;
  font-weight: normal
}

.dc-form-default .select--no-search .select2-search {
  display: none !important
}

.dc-form-default:not(.search-form) .select2-container {
  width: 100% !important;
  outline: none;
  display: block;
}

.dc-form-default .select2-container .select2-selection--single {
  background-color: transparent;
  border: 1px solid #ced4da;
  border-radius: 0;
  height: 50px;
  padding: 0 15px;
}

.dc-form-default .select2-container .select2-selection--single .select2-selection__rendered {
  line-height: 50px;
  padding-left: 0;
  color: #808080;
  font-size: 16px;
  font-family: inherit;
  font-weight: 500
}

.dc-form-default .select2-container .select2-selection--single .select2-selection__arrow {
  height: 50px;
  right: 4px;
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -moz-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -webkit-align-items: center;
  -moz-box-align: center;
  -ms-flex-align: center;
  align-items: center
}

.dc-form-default .select2-container .select2-selection--single .select2-selection__arrow b {
  display: none
}

.dc-form-default .select2-container .select2-selection--single .select2-selection__arrow:after {
  font-family: 'Font Awesome 5 free';
  content: "\\f107";
  font-size: 18px;
  font-weight: 700;
  color: #ccc;
  -webkit-transition: all 0.4s ease;
  -o-transition: all 0.4s ease;
  -moz-transition: all 0.4s ease;
  transition: all 0.4s ease
}

.dc-form-default .select2-container.select2-container--open .select2-selection--single .select2-selection__arrow::after {
  -webkit-transform: rotate(-180deg);
  -moz-transform: rotate(-180deg);
  -ms-transform: rotate(-180deg);
  -o-transform: rotate(-180deg);
  transform: rotate(-180deg)
}

.dc-form-default .select2-container--open .select2-dropdown--below {
  border: none;
  -webkit-border-radius: 3px;
  -moz-border-radius: 3px;
  border-radius: 3px;
  -webkit-box-shadow: 0 8px 20px 0 rgba(0, 0, 0, 0.15);
  -moz-box-shadow: 0 8px 20px 0 rgba(0, 0, 0, 0.15);
  box-shadow: 0 8px 20px 0 rgba(0, 0, 0, 0.15);
  border: 1px solid #e0e0e0;
  margin-top: 5px;
  overflow: hidden
}

.dc-form-default .title {
  text-transform: initial;
  font-weight: 500;
}

.dc-form-default .form-container {
  overflow: auto;
  -webkit-border-radius: 3px;
  -moz-border-radius: 3px;
  border-radius: 3px;
  background: #fff
}

.dc-form-default .form-container .form-container-body {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
}

.dc-form-default .select2-container--default .select2-selection--multiple {
  background-color: transparent;
  border: 1px solid #ced4da;
  border-radius: 0;
  padding-bottom: 0;
  height: 50px;
  padding: 0;
}

.dc-form-default .select2-container .select2-search--inline .select2-search__field {
  margin-top: 0;
}

.dc-form-default :not([class~=note-editor]) .form-check input[type="checkbox"] {
  background: transparent;
  cursor: pointer;
  width: 1em;
  height: 1em;
  margin-top: 0.22rem
}

.dc-form-default.no-shadow [class='form-container'] {
  -webkit-box-shadow: none !important;
  -moz-box-shadow: none !important;
  box-shadow: none !important;
}

.note-toolbar .note-btn-group .note-btn {
  line-height: 1.5 !important;
  padding: 7px !important;
}

form[class*="dc-form"] .form-container {
  overflow: auto !important;
}

.no-border-bottom {
  border-bottom: none !important;
}

form.dc-form-default .form-group .iti {
  position: relative;
  display: block !important;
}

.iti--allow-dropdown input,
.iti--allow-dropdown input[type=tel],
.iti--allow-dropdown input[type=text],
.iti--separate-dial-code input,
.iti--separate-dial-code input[type=tel],
.iti--separate-dial-code input[type=text] {
  padding-right: 6px !important;
  padding-left: 52px !important;
  margin-left: 0 !important;
}

form.dc-form-default .custom-file {
  position: relative;
  display: inline-block;
  width: 100%;
  height: 50px;
  margin-bottom: 0;
}

form.dc-form-default .custom-file-label {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  z-index: 1;
  padding: 0 15px;
  font-weight: 400;
  line-height: 50px;
  color: #495057;
  background-color: #fff;
  border: 1px solid #ced4da;
  border-radius: 0;
  height: 50px;
}

form.dc-form-default .custom-file-label::after {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 3;
  display: block;
  padding: 0 15px;
  line-height: 50px;
  color: #495057;
  content: "Browse";
  background-color: #e9ecef;
  border-left: inherit;
  border-radius: 0;
  height: 50px;
}

form.dc-form-default .note-editor {
  border-radius: 0;
}

form.dc-form-default .note-editor.note-frame .note-editing-area .note-editable ol,
form.dc-form-default .note-editor.note-frame .note-editing-area .note-editable ul {
  padding: revert;
}

form.dc-form-default .note-editor .form-check {
  padding-left: 0;
}

form.dc-form-default .note-editor .form-check-input {
  position: relative;
  margin: 0;
}

form.dc-form-default :not([class~=note-editor]) .form-group input[type=button] {
  color: #fff;
}

form.dc-form-default .note-editor input[type=file] {
  padding: 10px 15px;
  font-weight: 400;
  color: #495057;
  background-color: #fff;
  border: 1px solid #ced4da;
  border-radius: 0;
  height: 50px;
}

form.dc-form-default .error {
  color: #dc3545;
  border-color: #dc3545;
}

@media (max-width: 767px) {
  .dc-form-default.dc-form-bordered {
    padding: 20px;
  }
}`;

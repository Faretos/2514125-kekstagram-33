import { isEscKey } from './util.js';
import './fillter-effect.js';
import { createErrorMessage, createSuccessMessage } from './result-message-form.js';
import { sendData } from './api.js';

const body = document.querySelector('body');
const form = document.querySelector('.img-upload__form');
const overlay = document.querySelector('.img-upload__overlay');
const uploadFile = document.querySelector('#upload-file');
const hashtagField = document.querySelector('.text__hashtags');
const descriptionField = document.querySelector('.text__description');
const cancelUploadButton = document.querySelector('.img-upload__cancel');
const submitButton = form.querySelector('.img-upload__submit');

const HASHTAG_UNVALID = /[^\w\u0400-\u04FF]/;

const MIN_HASHTAG_LENGTH = 2;
const MAX_HASHTAG_LENGTH = 20;
const MAX_HASHTAG_COUNT = 5;
const MAX_COMMENT_LENGTH = 140;

const pristine = new Pristine(form, {
  classTo: 'img-upload__field-wrapper',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextClass: 'img-upload__field-wrapper--error',
});

const showOverlay = () => {
  overlay.classList.remove('hidden');
  body.classList.add('modal-open');

  document.addEventListener('keydown', onEscKeydown);
};

const hideOverlay = () => {
  form.reset();
  pristine.reset();
  overlay.classList.add('hidden');
  body.classList.remove('modal-open');

  document.removeEventListener('keydown', onEscKeydown);
};

const textFieldActive = () => document.activeElement === hashtagField || document.activeElement === descriptionField;

function onEscKeydown(evt) {
  if (isEscKey(evt) && !textFieldActive()) {
    evt.preventDefault();
    hideOverlay();
  }
}

const startsWithHashtag = (string) => string[0] === '#';
const hasValidLength = (string) => string.length >= MIN_HASHTAG_LENGTH && string.length <= MAX_HASHTAG_LENGTH;
const hasValidSymbols = (string) => !HASHTAG_UNVALID.test(string.slice(1));
const isValidHashtag = (tag) => startsWithHashtag(tag) && hasValidLength(tag) && hasValidSymbols(tag);

const isValidCount = (tags) => tags.length <= MAX_HASHTAG_COUNT;

const isUniqueHashtags = (tags) => {
  const lowerCaseTags = tags.map((tag) => tag.toLowerCase());
  return lowerCaseTags.length === new Set(lowerCaseTags).size;
};

const validateHashtags = (value) => {
  const hashtags = value.split(' ').filter((tag) => tag.trim());
  return isValidCount(hashtags) && isUniqueHashtags(hashtags) && hashtags.every(isValidHashtag);
};

pristine.addValidator(
  hashtagField,
  validateHashtags,
  'Недопустимый хэштег'
);

const hasValidCommentLength = (string) => string.length <= MAX_COMMENT_LENGTH;

pristine.addValidator(
  descriptionField,
  hasValidCommentLength,
  'Слишком длинный комментарий'
);

const onCancelUploadButtonClick = () => hideOverlay();
const onFileInputChange = () => showOverlay();

const blockSubmitButton = () => {
  submitButton.disabled = true;
  submitButton.textContent = 'Идет отправка';
};

const unblockSubmitButton = () => {
  submitButton.disabled = false;
  submitButton.textContent = 'Опубликовать';
};

const resetForm = () => {
  const scaleValue = document.querySelector('.scale__control--value');
  scaleValue.value = 100;
  hashtagField.value = '';
  descriptionField.value = '';
  uploadFile.value = '';
};

const setUserFormSubmit = (onSuccess) => {
  form.addEventListener('submit', (evt) => {
    evt.preventDefault();

    const isValid = pristine.validate();
    if (isValid) {
      blockSubmitButton();
      sendData(new FormData(evt.target))
        .then(() => {
          createSuccessMessage();
          onSuccess();
          resetForm();
        })
        .catch(() => {
          createErrorMessage();
        })
        .finally(() => {
          unblockSubmitButton();
        });
    }
  });
};

uploadFile.addEventListener('change', onFileInputChange);
cancelUploadButton.addEventListener('click', onCancelUploadButtonClick);

export {setUserFormSubmit, showOverlay, hideOverlay};

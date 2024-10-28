const NAMES = [
  'Антон',
  'Мария',
  'Анна',
  'Василий',
  'Генадий',
  'Александра',
  'Степан',
  'Злата',
  'Екатерина',
  'Павел'
];

const DESCRIPTIONS = [
  'Вот это класс!',
  'Получилось здорово.',
  'Не могу не поделиться)',
  'КЛАСС!!!',
  'А как у вас дела?',
  'Супер',
  'Кайфую',
  'Круто',
  'Зацените это',
  'Вы должны были это увидеть'
];

const MESSAGES = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

// Получение случайного, положительного числа

const getRandomInteger = function (min, max) {
  const lower = Math.ceil(Math.min(Math.abs(min), Math.abs(max)));
  const upper = Math.floor(Math.max(Math.abs(min), Math.abs(max)));
  const result = Math.random() * (upper - lower + 1) + lower;

  return Math.floor(result);
};

// Проверка на повторяющиеся числа

const createRandomIdFromRangeGenerator = function (min, max) {
  const previousValues = [];

  return function () {
    let currentValue = getRandomInteger(min, max);

    if (previousValues.length >= (max - min + 1)) {
      console.error('Перебраны все числа из диапазона от ' + min + ' до ' + max);
      return null;
    }
    while (previousValues.includes(currentValue)) {
      currentValue = getRandomInteger(min, max);
    }
    previousValues.push(currentValue);
    return currentValue;
  };
};

// Получение случайного элемента из массива
const getRandomArrayElement = (elements) => elements[getRandomInteger(0, elements.length - 1)];

// Генерация коментария
const generateMessage = () => Array.from({length: getRandomInteger(1, 2)}, () => getRandomArrayElement(MESSAGES)).join('');

const generateComment = (index) => ({
  id: index,
  avatar: 'img/avatar-' + getRandomInteger(1, 6) + '.svg',
  message: generateMessage(),
  name: getRandomArrayElement(NAMES)
});

//Генерация картинки
const generatePicture = (index) => ({
  id: index,
  url: 'photos/' + getRandomInteger(1, 25) + '.jpg',
  description: getRandomArrayElement(DESCRIPTIONS),
  likes: getRandomInteger(15, 200),
  comments: Array.from({length: getRandomInteger(1, 30)}, (_, commentIndex) => generateComment(commentIndex)),
});

// Создание 25 объектов
const getPictures = () => Array.from({length: 25}, (_, pictureIndex) => generatePicture(pictureIndex + 1));

console.log(getPictures());

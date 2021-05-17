const capitalizeFirstLetter = (string) => {
  return string[0].toUpperCase() + string.slice(1);
};


const cloneObjectValue = (obj, value) => {
  return Object.assign(
    {},
    obj,
    value,
  );
};

const isOnline = () => {
  return window.navigator.onLine;
};

export {
  capitalizeFirstLetter,
  cloneObjectValue,
  isOnline,
};

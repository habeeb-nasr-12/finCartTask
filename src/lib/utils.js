export const removeUndefinedValues = (obj) => {
   let newObj = {};
  for (const key in obj ) {
    if (obj[key]!== null && obj[key]!==undefined && obj[key]!== '') {
      newObj[key] = obj[key];
    }
  }
  return newObj;
}

 export const formatPrice = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

export const getLocalStorageItem = (key, parser) => {
  try {
    const item = localStorage.getItem(key);
    return item ? parser(item) : null;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return null;
  }
};

export const updateLocalStorage = (key, value) => {
  try {
    if (value !== null && value !== undefined) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  } catch (error) {
    console.error(`Error updating localStorage for key ${key}:`, error);
  }
};

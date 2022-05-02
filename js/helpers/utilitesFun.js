/**
 *
 * @param {Object}parmaters Get object as parameter and console log it.
 */
export const toLog = (parma) => {
  const key = Object.keys(parma);
  key.forEach((el) => {
    console.log(el, parma[el]);
  });
};

/**
 *
 * @param {Array} arr
 * @returns Array with unique values
 */
export const makeArrayToSet = (arr) => [...new Set(arr)];

/**
 *
 * @param {String} str
 * @returns HTML element based on the string
 */
export const createEl = (str) => {
  const temp = document.createElement("template");
  temp.innerHTML = str.trim();
  return temp["content"].firstElementChild;
};

/**
 *
 * @param {String} src
 * @param {String} alt
 * @returns Image element  as string
 */
export const createImgHtml = (src, alt = "Image not found") => {
  return `<img src="${src}" alt="${alt}"/> `;
};
/**
 *
 * @param {String} query
 * @param {Document| Element} scope The scope where to excute the query
 * @returns The result Element of the query or null
 */
export const selectElement = (query, scope = document) => {
  return scope.querySelector(query);
};
export const getfirstElementChild = (el) => el.firstElementChild;

/**
 *
 * @param {String} query
 * @param {Document| Element} scope The scope where to excute the query
 * @returns The result Elements of the query or empty HTML collection
 */
export const selectAllElements = (query, scope = document) => {
  return scope.querySelectorAll(query);
};

/**
 *
 * @param {String} nameEvent
 * @param {Function} handler The callback function of the event listener
 * @param {String} query Which element search in the querySelector
 * @returns The result element which the event listener attach to it.
 */
export const addEventListenerByQuery = (nameEvent, handler, query) => {
  const element = selectElement(query);
  element.addEventListener(nameEvent, handler);
  return element;
};

/**
 *
 * @param {String} nameEvent
 * @param {Function} handler The callback function of the event listener
 * @param {String} query Which element search in the querySelector
 * @returns The result element which the event listener attach to it.
 */
export const removeEventListenerByQuery = (nameEvent, handler, query) => {
  const element = selectElement(query);
  element.removeEventListener(nameEvent, handler);
  return element;
};

/**
 *
 * @param {Number} start
 * @param {Number} end
 * @param {Number} change Get the change number in the index of the array TD. The I of the loop
 * @param {Function} handler function to excute on the I before push it to array.
 * If it is not defined so the array push the regular I
 * @param {Function} breakFun  Function to break the loop.
 * If it is not defined the function will excute regulary.
 * @param {Boolean} unique Make the array with uniqe values
 * @returns Array
 */
export const makeArray = (
  start,
  end,
  change = 1,
  handler = undefined,
  breakFun = (i) => false,
  unique = true
) => {
  const arr = [];
  for (let i = start; i < end; i += change) {
    const breakRes = breakFun(i);
    handler ? arr.push(handler(i)) : arr.push(i);
    if (breakRes) break;
  }

  return unique ? makeArrayToSet(arr) : arr;
};

/**
 *
 * @param {Object} obj
 * @returns Object without the undefined values.
 */
export const getObjKeyWithValue = (obj) => {
  let newObj = {};

  for (const key in obj) {
    if (obj[key])
      newObj = {
        ...newObj,
        [key]: obj[key],
      };
  }
  return newObj;
};
/**
 *
 * @param {Object} obj Object with array as values of the keys
 * @returns One uniqe array from all the keys
 */
export const genrateObjKeyValueToArr = (obj) => {
  let arr = [];

  for (const key in obj) {
    if (obj[key] instanceof Array) arr = [...arr, ...obj[key]];
  }
  return makeArrayToSet(arr);
};

/**
 *
 * @param {String} str
 * @param {Number} pos
 * @param {String} newStr
 * @param {String} querySplit
 * @returns The edited string of dataset by pos and the split query of the string
 */

export const editDataSet = (str, pos, newStr, querySplit = "-") => {
  const arrStr = str.split(querySplit)?.slice();
  arrStr[pos] = newStr;
  return arrStr.join(querySplit);
};

/**
 *
 * @param {Array} arr1
 * @param {Array} arr2
 * @returns  New Array with the common values of both array
 */
export const getSameValueBet2Arr = (arr1, arr2) => {
  let bigArr,
    smallArr,
    newArr = [];
  if (arr1.length > arr2.length) {
    bigArr = arr1;
    smallArr = arr2;
  } else {
    bigArr = arr1;
    smallArr = arr2;
  }
  newArr = smallArr
    .map((num1) => {
      if (bigArr.some((num2) => num1 === num2)) return num1;
    })
    .filter((el) => {
      if (el) return el;
    });

  return makeArrayToSet(newArr);
  // return newArr;
};

/**
 *
 * @param {Any} check
 * @param {Array} arr
 * @returns The number of times the chcek parmater is display in the array
 */
export const getHowManyTimeElApperInArr = (check, arr) => {
  return arr.filter((el) => el === check).length;
};

/**
 *
 * @param {Object} obj
 * @returns  The deep clone object
 */
export const objDeepCopy = (obj) => JSON.parse(JSON.stringify(obj));

/**
 *
 * @param {Any} el
 * @param {Array} arr
 * @returns  True if the element is in the array
 */
export const checkTheElIsUniqueInArray = (el, arr) =>
  !arr.some((obj) => obj.toString() === el.toString());

/**
 *
 * @param {Any} value
 * @param {Array} arr
 * @returns Array with the values until the value we query for
 */
export const getValuesUntilValueInArray = (value, arr) => {
  if (!arr.some((el) => el.toString() === value.toString())) return [];
  let i = 0;
  let newArr = [];
  while (arr[i].toString() !== value.toString()) {
    newArr.push(arr[i]);
    i++;
  }
  newArr.push(value);

  return newArr;
};

/**
 *
 * @param {String} str
 * @returns String with first character is captial letter
 */
export const capitalFirstLetter = (str) => str[0].toUpperCase() + str.slice(1);

/**
 *
 * @param {Any} value
 * @param {Array} arr
 * @returns The road values of tree node until the value we query for.
 */
export const findTheRoadArrayInTree = (value, arr) => {
  if (arr.length === 0) return [];

  let index = 0;
  let arrRoad = [];
  const searchRoadTree = (arr, index, length) => {
    if (index > length) return;
    let el = arr[index];

    if (el && el.toString() === value.toString()) {
      arrRoad.push(el);
      return true;
    }
    //Cheak each side of node,
    if (searchRoadTree(arr, index + 1, length)) {
      el && arrRoad.push(el);
      return true;
    }
    if (searchRoadTree(arr, index + 2, length)) {
      el && arrRoad.push(el);
      return true;
    }

    if (searchRoadTree(arr, index + 3, length)) {
      el && arrRoad.push(el);
      return true;
    }
  };

  searchRoadTree(arr, index, arr.length);
  return arrRoad;
};

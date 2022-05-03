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
 * @param {Any} el
 * @param {Array} arr
 * @returns  True if the element is in the array
 */
export const checkTheElIsUniqueInArray = (el, arr) =>
  !arr.some((obj) => obj.toString() === el.toString());

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

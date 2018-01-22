export function findElement(arr, propName, propValue) {

  let obj  = null;
  for (let i=0; i < arr.length; i++)
    if (arr[i][propName] === propValue)
      obj = arr[i];
  return obj
}

export function findIndex(arr, propName, propValue) {
  let inx = -1;
  for (var i=0; i < arr.length; i++)
    if (arr[i][propName] === propValue)
      inx = i;
  return inx
}
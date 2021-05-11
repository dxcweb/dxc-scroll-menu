export const getClientRect = (elem) => {
  if (!elem || !elem.getBoundingClientRect || typeof elem.getBoundingClientRect !== "function") {
    return { width: 0, x: 0, x2: 0 };
  }

  const { left = 0, width = 0, right = 0 } = elem.getBoundingClientRect();
  return { width, x: +left, x2: +right };
};
export const getObjectFirstAttribute = (data) => {
  for (var key in data) {
    return data[key];
  }
};

const sortMapByValues = (mapToSort) => {
  const sortedMap = new Map([...mapToSort.entries()]
    .sort((firstEntry, secondEntry) => {
      return secondEntry[1] - firstEntry[1];
    }));
  return sortedMap;
};

export { sortMapByValues };

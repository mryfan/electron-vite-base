async function getID(key: string) {
  const yuanShi: Array<number> = await window.el_store.get("id_record." + key);
  if (yuanShi == undefined) {
    await window.el_store.set("id_record." + key, [1]);
    return 1;
  }
  //查询数组里面的最后一个元素的值
  const newItem = yuanShi[yuanShi.length - 1] + 1;
  yuanShi.push(newItem);
  await window.el_store.set("id_record." + key, yuanShi);
  return newItem;
}

export { getID };

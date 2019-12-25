const pagination = async ({
  pageSize,
  count,
  query,
  cursor,
  list,
  connection,
}: any) => {
  const parsing = async (res) => {
    const arr = JSON.parse(JSON.stringify(res));
    const newArr = arr.map(el => ({
      ...el,
      abilities: JSON.parse(el.abilities)
    }));
    return newArr;
  }

  let result, maxID;

  if (list === 'towers') {
    result = await connection.query(
      `${query} AND tower.tower_id > ${cursor} GROUP BY tower.tower_id
        ORDER BY tower.tower_id ASC LIMIT ${pageSize};`
    );
    maxID = await connection.query(
      `SELECT MAX(tower_id) AS max FROM (${query}
        AND tower.tower_id > ${cursor} GROUP BY tower.tower_id
        ORDER BY tower.tower_id ASC LIMIT ${pageSize}) as T;`
    );
  } else {
    result = await connection.query(
      `${query} AND item.item_id > ${cursor} GROUP BY item.item_id
        ORDER BY item.item_id ASC LIMIT ${pageSize};`
    );
    maxID = await connection.query(
      `SELECT MAX(item_id) AS max FROM (${query}
        AND item.item_id > ${cursor} GROUP BY item.item_id
        ORDER BY item.item_id ASC LIMIT ${pageSize}) as T;`
    );
  }



  if (pageSize < 1) {
    return {
      [list]: [],
      hasMore: false,
      cursor,
    };
  }

  if (!cursor) {
    return {
      [list]: await parsing(result),
      hasMore: true,
      cursor: JSON.parse(JSON.stringify(maxID))[0].max,
    };
  }

  if (cursor >= count) {
    return {
      hasMore: false,
      [list]: [],
      cursor,
    }
  }

  if (cursor) {
    return {
      [list]: await parsing(result),
      hasMore: true,
      cursor: JSON.parse(JSON.stringify(maxID))[0].max,
    };
  }
}

export default pagination;

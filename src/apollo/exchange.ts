/* eslint-disable no-return-await */
/* eslint-disable import/prefer-default-export */
import { dayDatasQuery } from "./queries";

import { getApollo } from "./index";

export async function getDayData(client = getApollo()) {
  const { data } = await client.query({
    query: dayDatasQuery,
  });

  await client.cache.writeQuery({
    query: dayDatasQuery,
    data,
  });

  return await client.cache.readQuery({
    query: dayDatasQuery,
  });
}

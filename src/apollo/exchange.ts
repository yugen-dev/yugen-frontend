/* eslint-disable no-return-await */
/* eslint-disable import/prefer-default-export */
import { dayDatasQuery, burnQuery, cntStakerQuery } from "./queries";

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

export async function getBurnSupply(client = getApollo()) {
  const { data } = await client.query({
    query: burnQuery,
  });

  await client.cache.writeQuery({
    query: burnQuery,
    data,
  });

  return await client.cache.readQuery({
    query: burnQuery,
  });
}

export async function getBar(client = getApollo()) {
  const { data } = await client.query({
    query: cntStakerQuery,
    context: {
      clientName: "cntstaker",
    },
  });

  await client.cache.writeQuery({
    query: cntStakerQuery,
    data,
  });

  return await client.cache.readQuery({
    query: cntStakerQuery,
  });
}

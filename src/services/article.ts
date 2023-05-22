import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const articleApi = createApi({
  reducerPath: 'articleApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://article-extractor-and-summarizer.p.rapidapi.com/',
    prepareHeaders: (headers) => {
      // headers.set('X-RapidAPI-Key', rapidApiKey as string);
      headers.set(
        'X-RapidAPI-Key',
        '59e40e4f32msh98c880a91dc9eccp1c029bjsn9f898224d381',
      );
      headers.set(
        'X-RapidAPI-Host',
        'article-extractor-and-summarizer.p.rapidapi.com',
      );
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getSummary: builder.query({
      query: (params) =>
        `/summarize?url=${encodeURIComponent(params.articleUrl)}&length=3`,
    }),
  }),
});

export const { useLazyGetSummaryQuery } = articleApi;

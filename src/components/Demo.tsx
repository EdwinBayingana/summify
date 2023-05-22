import { useState, useEffect, SetStateAction } from 'react';
import { copy, linkIcon, loader, tick } from '../assets';

import { useLazyGetSummaryQuery } from '../services/article';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query/react';

const Demo = () => {
  type FetchBaseQueryError =
    | {
        status: number;
        data: unknown;
      }
    | {
        status: 'FETCH_ERROR';
        data?: undefined;
        error: string;
      }
    | {
        status: 'PARSING_ERROR';
        originalStatus: number;
        data: string;
        error: string;
      }
    | {
        status: number;
        data: unknown;
      }
    | {
        status: 'FETCH_ERROR';
        data?: undefined;
        error: string;
      }
    | {
        status: 'PARSING_ERROR';
        originalStatus: number;
        data: string;
        error: string;
      };
  interface Article {
    url: string;
    summary: string;
  }

  const [article, setArticle] = useState({
    url: '',
    summary: '',
  });
  const [allArticles, setAllArticles] = useState<Article[]>([]);

  const [getSummary, { error, isFetching }] = useLazyGetSummaryQuery();
  const [copied, setCopied] = useState('');

  useEffect(() => {
    const articlesFromLocalStorage = JSON.parse(
      localStorage.getItem('articles') || '[]',
    );

    if (articlesFromLocalStorage) {
      setAllArticles(articlesFromLocalStorage);
    }
  }, []); // empty dependency array means we want to execute it as soon as the page loads

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data } = await getSummary({
      articleUrl: article.url,
    });

    if (data?.summary) {
      const newArticle: Article = {
        ...article,
        summary: data.summary,
      };
      const updatedAllArtcles = [newArticle, ...allArticles];

      setArticle(newArticle);
      setAllArticles(updatedAllArtcles);

      localStorage.setItem('article', JSON.stringify(updatedAllArtcles));

      console.log(newArticle);
    }
  };

  const handleCopy = (copyUrl: string) => {
    setCopied(copyUrl);
    navigator.clipboard.writeText(copyUrl);
    setTimeout(() => setCopied(''), 3000);
  };

  return (
    <section className="mt-16 w-full max-w-xl">
      <div className="flex flex-col w-full gap-2">
        <form
          className="relative flex justify-center items-center"
          onSubmit={handleSubmit}
        >
          <img
            src={linkIcon}
            alt="link_icon"
            className="absolute left-0 my-2 ml-3 w-5"
          />
          <input
            type="url"
            placeholder="Enter a url"
            value={article.url}
            onChange={(e) => setArticle({ ...article, url: e.target.value })}
            required
            className="url_input peer"
          />
          <button
            type="submit"
            className="submit_btn peer-focus:border-gray-700 peer-focus:text-gray-700"
          >
            🚀
          </button>
        </form>
        {/* URL History */}
        <div className="flex flex-col gap-1 max-h-60 overflow-y-auto">
          {allArticles.map((item, index) => (
            <div
              key={`link-${index}`}
              onClick={() => setArticle(item)}
              className="link_card"
            >
              <div className="copy_btn" onClick={() => handleCopy(item.url)}>
                <img
                  src={copied === item.url ? tick : copy}
                  alt="copy_icon"
                  className="w-[40%] h-[40%] object-contain"
                />
              </div>
              <p className="flex-1 font-satoshi text-blue-700 font-medium text-small truncate">
                {item.url}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Display Results */}
      <div className="my-10 max-w-full flex justify-center items-center">
        {isFetching ? (
          <img src={loader} alt="loader" className="w-20 h-20 object-contain" />
        ) : error ? (
          <p className="font-inter font-bold text-black text-center">
            Oops, that wasn't supposed to happen...😬
            <br />
            <span className="font-satoshi font-normal text-gray-700">
              {/* @ts-ignore */}
              {(error as FetchBaseQueryError)?.data.error as string}
            </span>
          </p>
        ) : (
          article.summary && (
            <div className="flex flex-col gap-3">
              <h2 className="font-satoshi font-bold text-gray-600 text-xl">
                Article <span className="blue_gradient">Summary</span>
              </h2>
              <div className="summary_box">
                <p className="font-inter font-medium text-sm text-gray-700">
                  {article.summary}
                </p>
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
};

export default Demo;

import { useEffect, useState } from "react";

import Headline from "./Headline";
import SectionHeader from "./SectionHeader";

const News = () => {
  const [data, setData] = useState(null);
  const [newsIndex, setNewsIndex] = useState(0);

  const refreshData = async () => {
    fetch("https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml")
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.text();
      })
      .then((str) => new window.DOMParser().parseFromString(str, "text/html"))
      .then((data) => {
        const items = data.querySelectorAll("item");
        const titles = [];
        items.forEach((item) => {
          titles.push(item.querySelector("title").innerHTML);
        });
        setData(titles);
      })
      .catch(console.error);
  };

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!data || newsIndex >= data.length) {
        setNewsIndex(0);
      } else {
        setNewsIndex(newsIndex + 1);
      }
    }, 10 * 1000);
    return () => clearInterval(interval);
  }, [data, newsIndex, setNewsIndex]);

  if (!data) {
    return null;
  }

  return (
    <>
      <SectionHeader label='New York Times' />
      {data[newsIndex] && <Headline title={data[newsIndex]} />}
    </>
  );
};

export default News;

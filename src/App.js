import axios from "axios";
import { useState, useRef } from "react";
import "./App.css";
import truncate from "./utils/truncate";

function App() {
  const typingTimeoutRef = useRef(null);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState([]);
  const KEY = `3adc9755f9c645c79404d9739bfc6326`;

  async function getNews(q) {
    let cancel;
    axios({
      method: "GET",
      url: `https://newsapi.org/v2/everything?q=${query}&apiKey=${KEY}`,
      page,
      q,
      cancelToken: new axios.CancelToken((c) => (cancel = c)),
    })
      .then((res) => {
        const news = res.data.articles;
        console.log("news", news);
        setPosts(news);
        console.log("posts", posts);
      })
      .catch((e) => {
        if (axios.isCancel(e)) return;
      });
    return () => cancel();
  }

  const handleSearch = (e) => {
    setQuery(e.target.value);
    setPage(1);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      const searchTerm = e.target.value;
      getNews(searchTerm);
      console.log(searchTerm);
    }, 500);
  };

  return (
    <div className="App">
      <div className="input-section">
        <input
          placeholder="Search for a topic"
          type="text"
          value={query}
          onChange={handleSearch}
        />
      </div>
      <div className="posts-section">
        {posts.map((post) => {
          return (
            <div className="post" key={post}>
              <div className="card-content">
                <div className="img-box">
                  <img
                    alt={post.title}
                    src={post.urlToImage}
                    width="auto"
                    height="200px"
                  />
                </div>
                <div className="nowrap-text">
                  <h3 className="ellipsis-text">{truncate(post.title)}</h3>
                  <p>{post.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;

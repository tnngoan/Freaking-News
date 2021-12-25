import axios from "axios";
import { useState, useRef, useEffect } from "react";
import "./App.css";

function App() {
  const typingTimeoutRef = useRef(null);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState([]);
  const KEY = process.env.API_KEY;

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
        setPosts((prevPosts) => [...prevPosts, ...news]);
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

  useEffect(() => {
    getNews(query);
  }, []);

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
              <h3>{post.title}</h3>
              <div className="card-content">
                <img alt={post.title} src={post.urlToImage} />
                <hr className="divider" />
                <p>{post.description}</p>
              </div>
              <div></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;

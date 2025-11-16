import axios from "axios";
import { useState, useEffect } from "react";

const BACKEND_URL = import.meta.env.VITE_MONGO_URL ?? "http://localhost:3000";

export function useContent() {
  const [contents, setContents] = useState([]);

  function refresh() {
    axios
      .get(`${BACKEND_URL}/api/v1/content`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((response) => {
        setContents(response.data.content);
      })
      .catch((error) => {
        console.log("Error fetching content:", error);
      });
  }

  useEffect(() => {
    refresh();

    const interval = setInterval(() => {
      refresh();
    }, 10 * 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return { contents, refresh };
}

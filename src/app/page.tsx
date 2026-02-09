"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import MovieCard from "../components/MovieCard";
import Spinner from "../components/Spinner";

interface Movie {
  id: number;
  title: string;
  release_date: string;
  poster_path: string | null;
}

export default function Home() {
  const [search, setSearch] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);

  const API_KEY = "-"; // replace with your TMDb key
  const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

  // Load favorites from localStorage
  useEffect(() => {
    const favs = localStorage.getItem("favorites");
    if (favs) setFavorites(JSON.parse(favs));
  }, []);

  // Fetch trending movies on load
  useEffect(() => {
    async function fetchTrending() {
      setLoading(true);
      try {
        const res = await axios.get("https://api.themoviedb.org/3/trending/movie/week", {
          params: { api_key: API_KEY },
        });
        setMovies(res.data.results);
      } catch (err) {
        console.log(err);
        setError("Failed to load trending movies");
      }
      setLoading(false);
    }
    fetchTrending();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!search) return;

    setLoading(true);
    setError("");
    setMovies([]);

    try {
      const res = await axios.get("https://api.themoviedb.org/3/search/movie", {
        params: { api_key: API_KEY, query: search },
      });

      if (res.data.results.length > 0) {
        setMovies(res.data.results);
      } else {
        setError("No movies found");
      }
    } catch (err) {
      console.log(err);
      setError("Something went wrong with the API request");
    }

    setLoading(false);
  };

  const toggleFavorite = (id: string) => {
    let updated: string[];
    if (favorites.includes(id)) {
      updated = favorites.filter(f => f !== id);
    } else {
      updated = [...favorites, id];
    }
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-5xl mx-auto p-4">
        {/* Search Form */}
        <form onSubmit={handleSearch} className="flex mb-6">
          <input
            type="text"
            placeholder="Search movies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border border-gray-300 p-2 rounded-l-md focus:outline-none"
          />
          <button className="bg-blue-500 text-white px-4 rounded-r-md hover:bg-blue-600">
            Search
          </button>
        </form>

        {/* Loading / Error */}
        {loading && <Spinner />}
        {!loading && error && <p className="text-center text-red-500">{error}</p>}

        {/* Movies Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {!loading &&
            movies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={{
                  imdbID: movie.id.toString(),
                  Title: movie.title,
                  Year: movie.release_date?.split("-")[0] || "N/A",
                  Poster: movie.poster_path ? `${IMAGE_BASE}${movie.poster_path}` : "",
                }}
                onFavorite={toggleFavorite}
              />
            ))}
        </div>

        {/* Favorites Section */}
        {favorites.length > 0 && (
          <div className="mt-10">
            <h2 className="text-2xl font-bold mb-4">Your Favorites</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {movies
                .filter(m => favorites.includes(m.id.toString()))
                .map(movie => (
                  <MovieCard
                    key={movie.id}
                    movie={{
                      imdbID: movie.id.toString(),
                      Title: movie.title,
                      Year: movie.release_date?.split("-")[0] || "N/A",
                      Poster: movie.poster_path ? `${IMAGE_BASE}${movie.poster_path}` : "",
                    }}
                    onFavorite={toggleFavorite}
                  />
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

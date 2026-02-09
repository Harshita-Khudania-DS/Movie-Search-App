"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Navbar from "../../../components/Navbar";
import Spinner from "../../../components/Spinner";

interface MovieDetail {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  poster_path: string | null;
  vote_average: number;
  genres: { id: number; name: string }[];
}

export default function MovieDetailPage() {
  const params = useParams();
  const movieId = params.id;
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const API_KEY = "-"; // replace with your TMDb key
  const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

  useEffect(() => {
    async function fetchMovie() {
      try {
        const res = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
          params: { api_key: API_KEY },
        });
        setMovie(res.data);
      } catch (err) {
        console.log(err);
      }
      setLoading(false);
    }

    fetchMovie();
  }, [movieId]);

  if (loading) return <Spinner />;
  if (!movie) return <p className="text-center">Movie not found</p>;

  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto p-4 flex flex-col md:flex-row gap-6">
        {movie.poster_path && (
          <img
            src={`${IMAGE_BASE}${movie.poster_path}`}
            alt={movie.title}
            className="w-full md:w-1/3 rounded"
          />
        )}
        <div>
          <h1 className="text-3xl font-bold mb-2">{movie.title}</h1>
          <p className="mb-2"><strong>Release:</strong> {movie.release_date}</p>
          <p className="mb-2"><strong>Rating:</strong> {movie.vote_average}</p>
          <p className="mb-2"><strong>Genres:</strong> {movie.genres.map(g => g.name).join(", ")}</p>
          <p className="mt-4">{movie.overview}</p>
        </div>
      </div>
    </div>
  );
}

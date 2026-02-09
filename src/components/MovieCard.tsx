import Link from "next/link";

export default function MovieCard({ movie, onFavorite }: { movie: any, onFavorite?: (id: string) => void }) {
  return (
    <div className="border p-2 rounded hover:shadow-lg cursor-pointer flex flex-col">
      <Link href={`/movie/${movie.imdbID}`}>
        <img
          src={movie.Poster || "/placeholder.png"}
          alt={movie.Title}
          className="w-full h-60 object-cover rounded"
        />
      </Link>
      <div className="mt-2 flex justify-between items-center">
        <div>
          <h2 className="font-bold">{movie.Title}</h2>
          <p>{movie.Year}</p>
        </div>
        {onFavorite && (
          <button
            className="text-red-500 font-bold"
            onClick={() => onFavorite(movie.imdbID)}
          >
            ♥
          </button>
        )}
      </div>
    </div>
  );
}

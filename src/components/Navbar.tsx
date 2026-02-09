import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-gray-800 text-white p-4 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto flex justify-between items-center">
        <Link href="/">
          <h1 className="text-xl font-bold cursor-pointer">Movie Search</h1>
        </Link>
      </div>
    </nav>
  );
}

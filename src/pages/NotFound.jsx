import React, { useEffect, useState } from "react";
import { Home } from "lucide-react";

const NotFound = () => {
  const [psyduckImg, setPsyduckImg] = useState("");

  useEffect(() => {
    async function fetchPsyduck() {
      try {
        const res = await fetch("https://pokeapi.co/api/v2/pokemon/psyduck");
        const data = await res.json();
        const img =
          data.sprites?.other?.["official-artwork"]?.front_default ||
          data.sprites?.front_default;
        setPsyduckImg(img);
      } catch (err) {
        console.error("Failed to fetch Psyduck image", err);
      }
    }
    fetchPsyduck();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      {psyduckImg && (
        <img
          src={psyduckImg}
          alt="Psyduck confused"
          className="w-64 h-64 object-contain mb-6"
        />
      )}
      <h1 className="text-5xl font-bold text-red-500 mb-2">404</h1>
      <h2 className="text-2xl font-semibold text-muted-foreground mb-4">
        Page Not Found
      </h2>
      <p className="text-center text-gray-600 mb-6 max-w-sm">
        Oops! Psyduck seems confused and couldn't find this page. Try going back
        to the home page.
      </p>
      <a
        href="/"
        className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold shadow hover:bg-primary/80 transition-all"
      >
        <Home className="w-5 h-5" />
        Home
      </a>
    </div>
  );
};

export default NotFound;

import { Inter } from "next/font/google";
import { useEffect, useRef } from "react";
import { Scorecard } from "./constituency/[name]";

const inter = Inter({ subsets: ["latin"] });

const fetchConstituency = async (postcode: string) => {
  const find = `https://members-api.parliament.uk/api/Location/Constituency/Search?searchText=${postcode}&skip=0&take=1`;

  const response = await fetch(find);

  const json = (await response.json()) as {
    items: {
      value: {
        id: string;
        name: string;
      };
    }[];
  };

  return json;
};

export default function Home() {
  useEffect(() => {}, []);

  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <main
      className={`flex-col items-center justify-center min-h-screen mx-16 sm:px-6 lg:px-8 ${inter.className}`}
    >
      <div className={`max-w-5xl mx-auto> pt-20`}>
        <h1 className={`text-6xl font-bold mb-4 text-gray-800`}>
          How did your MP vote on the issues that mattered most this year?
        </h1>
        <h2 className={`mb-8 text-lg text-gray-600`}>
          Enter your postcode to get their 2024 Report Card.
        </h2>
      </div>

      <div>
        <div className="text-lg text-gray-700">Your postcode</div>
        <form>
          <input
            required
            ref={inputRef}
            name="Postcode"
            placeholder=""
            className="mb-4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-5"
          />
          <button
            type="submit"
            onClick={(e) => {
              e.preventDefault();

              if (inputRef.current) {
                const { value } = inputRef.current;

                console.log(value);
              }
            }}
            className="px-6 py-3 bg-red-600 text-white font-bold rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Submit
          </button>
        </form>
      </div>
      <Scorecard></Scorecard>
    </main>
  );
}

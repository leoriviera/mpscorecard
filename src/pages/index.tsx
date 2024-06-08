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
      className={`flex min-h-screen flex-col items-center p-24 ${inter.className}`}
    >
      <h1>How did your MP vote on the issues that mattered most this year?</h1>
      <h2>Enter your postcode to get their 2022 Report Card.</h2>
      <div>Your postcode</div>

      <div>
        <h1>Form Page</h1>
        <form>
          <input required ref={inputRef} name="Postcode" placeholder="" />
          <button
            type="submit"
            onClick={(e) => {
              e.preventDefault();

              if (inputRef.current) {
                const { value } = inputRef.current;

                console.log(value);
              }
            }}
          >
            Submit
          </button>
        </form>
      </div>
      <Scorecard></Scorecard>
    </main>
  );
}

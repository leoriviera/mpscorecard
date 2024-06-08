import Image from "next/image";
import { Inter } from "next/font/google";
import { useEffect } from "react";

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

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <h1>How did your MP vote on the issues that mattered most this year?</h1>
      <h2>Enter your postcode to get their 2022 Report Card.</h2>
    </main>
  );
}

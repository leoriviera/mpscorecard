import { Inter } from "next/font/google";
import { useEffect, useRef } from "react";
import { Scorecard } from "./constituency/[name]";
import kebabCase from "lodash.kebabcase";
import { useRouter } from "next/router";

const inter = Inter({ subsets: ["latin"] });

// TODO - add error state to form field
// empty postcode, invalid postcode
// regex postcode before checking with postcodes.io?

// TODO - create 404 page, make look more snazzy
export default function Home() {
  const { push } = useRouter();

  const redirectToConstituency = async (postcode: string) => {
    const find = `https://api.postcodes.io/postcodes/${encodeURIComponent(
      postcode
    )}`;

    const response = await fetch(find);

    const {
      result: { parliamentary_constituency },
    } = (await response.json()) as {
      result: {
        parliamentary_constituency: string;
      };
    };

    await push(`/constituency/${kebabCase(parliamentary_constituency)}`);
  };

  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <main
      className={`flex-col items-center justify-center min-h-screen mx-16 sm:px-6 lg:px-8 ${inter.className}`}>
      <div className={`max-w-5xl mx-auto> pt-20`}>
        <h1 className={`text-6xl font-bold mb-4 text-gray-800`}>
          How did your MP vote on the issues that mattered most this year?
        </h1>
        <h2 className={`mb-8 text-lg text-gray-600`}>
          Enter your postcode to get their 2024 Report Card.
        </h2>
      </div>

      <div>
        <div className='text-lg text-gray-700'>Your postcode</div>
        <form>
          <input
            required
            ref={inputRef}
            name='Postcode'
            placeholder=''
            className='mb-4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-5'
          />
          <button
            type='submit'
            onClick={async (e) => {
              e.preventDefault();

              if (inputRef.current) {
                const { value } = inputRef.current;

                await redirectToConstituency(value);
              }
            }}
            className='px-6 py-3 bg-red-600 text-white font-bold rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500'>
            Submit
          </button>
        </form>
      </div>
      <Scorecard></Scorecard>
    </main>
  );
}

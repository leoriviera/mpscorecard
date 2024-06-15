import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Image from "next/image";
import kebabCase from "lodash.kebabcase";
import {
  CheckCircleIcon,
  XCircleIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/solid";
import { clsx } from "../utils";

import constituencies from "../data/constituencies.json";
import parties from "../data/parties.json";

interface Vote {
  description: string;
  grade: "A" | "F";
}

interface MPScorecard {
  name: string;
  party: (typeof parties)[keyof typeof parties];
  constituency: string;
  votes: Vote[];
  absent: string[];
  none: string[];
  thumbnail: string;
}

export const Scorecard: NextPage<{ score: MPScorecard }> = ({ score }) => {
  return (
    <div
      className={clsx(
        "min-h-screen min-w-full content-center bg-gradient-to-br from-neutral-200 p-6 lg:px-16",
        score.party.gradient
      )}>
      <div className='flex flex-col p-4 md:p-6 lg:p-10 bg-neutral-100 max-w-3xl rounded-md border-2 border-black'>
        {/* Scorecard header */}
        <div className='flex flex-col md:flex-row items-center pb-4'>
          <Image
            src={score.thumbnail}
            width={160}
            height={160}
            alt={score.name}
            className='object-cover object-top w-40 h-40 rounded-full border-black border-2 shrink-0'
          />
          <div className='pt-4 md:pt-0 md:pl-10 w-full text-center md:text-left'>
            <p className='text-md font-bold uppercase'>Scorecard</p>
            <p className='font-extrabold text-4xl'>{score.name}</p>
            <p className={clsx("font-bold text-2xl", score.party.colour)}>
              {score.party.name}
            </p>
            <p className='font-semibold text-xl'>MP for {score.constituency}</p>
          </div>
        </div>

        {/* Votes */}
        <div className='space-y-2'>
          <h2 className='text-2xl font-bold'>
            During the last Parliament, your MP voted...
          </h2>
          <div className='border-t border-black'></div>

          {score.votes.map((vote, index) => (
            <div
              key={index}
              className='flex flex-row justify-between items-center space-x-2'>
              <span className='font-medium text-2xl'>{vote.description}</span>
              {vote.grade == "A" ? (
                <CheckCircleIcon className='h-16 w-16 text-green-500 shrink-0' />
              ) : (
                <XCircleIcon className='h-16 w-16 text-red-500 shrink-0' />
              )}
            </div>
          ))}

          {score.absent.length ? (
            <>
              {score.absent.map((vote, index) => (
                <div
                  key={index}
                  className='flex flex-row justify-between items-center space-x-2'>
                  <span className='text-2xl font-medium'>{vote}</span>
                  <QuestionMarkCircleIcon className='h-16 w-16 text-yellow-500 shrink-0' />
                </div>
              ))}

              <div className='pt-4'>
                <p className='text-md font-light font-gray-200'>
                  The{" "}
                  <span className='text-yellow-700 font-bold'>
                    yellow question mark icon
                  </span>{" "}
                  means no vote was recorded for your MP. An MP may have no vote
                  recorded for several reasons, including abstaining from a
                  vote, illness or carrying out constituency or ministerial
                  business.
                </p>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

// This function gets called at build time
export const getStaticPaths: GetStaticPaths = async () => {
  // Generate the paths we want to pre-render based on posts
  const paths = Object.keys(constituencies).map((c) => ({
    params: {
      slug: kebabCase(c),
    },
  }));

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return {
    paths,
    fallback: false,
  };
};

// This function gets called at build time
export const getStaticProps: GetStaticProps<
  {},
  {
    slug: keyof typeof constituencies;
  }
> = async ({ params }) => {
  if (!params) {
    // TODO - redirect if no params
    return {
      props: {},
    };
  }

  const { slug } = params;

  // const constituencyInfo = constituencies[slug];

  const party = parties["labour"];

  // By returning { props: { posts } }, the Scorecard component
  // will receive `posts` as a prop at build time
  return {
    props: {
      score: {
        name: "Keir Starmer",
        party,
        constituency: "Holborn and St Pancras",
        votes: [
          {
            description: "voted against puppy murder",
            grade: "A",
          },
          {
            description: "voted for a ban on fracking",
            grade: "A",
          },
          {
            description:
              "voted against cracking down on puppy smuggling and dog thefts",
            grade: "F",
          },
        ],
        absent: [
          "did not vote on requiring water companies to reduce sewage discharge into British rivers and seas",
        ],
        thumbnail:
          "https://upload.wikimedia.org/wikipedia/commons/1/1f/Official_portrait_of_Keir_Starmer_%28crop%29.jpg",
      },
    },
  };
};

export default Scorecard;

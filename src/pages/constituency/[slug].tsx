import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Image from "next/image";
import kebabCase from "lodash.kebabcase";

import constituencies from "../data/constituencies.json";
import parties from "../data/parties.json";
import { clsx } from "../utils";

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
  // Render scorecard page

  return (
    // ea1d0e
    <div
      className={clsx(
        "min-h-screen min-w-full content-center bg-gradient-to-br from-neutral-200 px-6 lg:px-16",
        score.party.colour
      )}>
      <div className='flex flex-col p-6 lg:p-10 bg-neutral-200 max-w-3xl rounded-md border-4 border-neutral-200'>
        <div className='flex items-center mb-4'>
          <Image
            src={score.thumbnail}
            width={160}
            height={160}
            alt={score.name}
            className='object-cover object-top w-40 h-40 rounded-full mr-4'
          />
          <div>
            <h1 className='text-5xl font-bold'>Scorecard for</h1>
            <p className='font-extrabold text-3xl'>{score.name}</p>
            <p className='font-bold text-xl'>{score.party.name}</p>
            <p className='font-semibold text-xl'>
              Member of Parliament for {score.constituency}
            </p>
          </div>
        </div>

        <div className='space-y-2'>
          <h2 className='text-3xl font-medium'>
            During the last Parliament, your MP voted
          </h2>

          {score.votes.map((vote, index) => (
            <div
              key={index}
              className='flex flex-row justify-between text-2xl font-extrabold'>
              <span>{vote.description}</span>
              <strong className='text-green-600 font-bold'>{vote.grade}</strong>
            </div>
          ))}
        </div>
        <div className='mt-4 space-y-2'>
          <p className='text-md font-light font-gray-200 italic'>
            Your MP was absent for votes on outlawing ding-dong-ditch, closing
            every Tesco, removing the cap on bankers&apos; bonuses and removing
            Scunthorpe from the United Kingdom. An MP may have been absent for
            several reasons, including illness or handling constituency
            business.
          </p>
          <p className='text-md font-light font-gray-200 italic'>
            Your MP couldn&apos;t vote on potato theft, children in mines or
            supermarket profiteering, as they weren&apos;t an MP when the vote
            was held.
          </p>
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
            description: "against puppy murder",
            grade: "A",
          },
          {
            description: "for world peace",
            grade: "A",
          },
          {
            description: "for fracking",
            grade: "F",
          },
        ],
        absent: ["conversion therapy", "breaking mafioso knees"],
        none: ["playing music on public buses"],
        thumbnail:
          "https://upload.wikimedia.org/wikipedia/commons/1/1f/Official_portrait_of_Keir_Starmer_%28crop%29.jpg",
      },
    },
  };
};

export default Scorecard;

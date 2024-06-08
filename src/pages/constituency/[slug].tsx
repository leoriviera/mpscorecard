import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Image from "next/image";
import kebabCase from "lodash.kebabcase";
import constituencies from "../data/constituencies.json";

interface Vote {
  description: string;
  grade: "A" | "F" | "-";
}

interface MpScorecard {
  name: string;
  party: string;
  constituency: string;
  votes: Vote[];
  thumbnail: string;
}

export const Scorecard: NextPage = () => {
  let mpscore: MpScorecard = {
    name: "Keir Starmer",
    party: "Labour",
    constituency: "Holborn and St Pancras",
    votes: [
      {
        description: "voted against puppy murder",
        grade: "A",
      },
    ],
    thumbnail:
      "https://upload.wikimedia.org/wikipedia/commons/1/1f/Official_portrait_of_Keir_Starmer_%28crop%29.jpg",
  };
  // Render scorecard page
  return (
    <div className='max-w-xl mx-auto bg-neutral-100 rounded-lg shadow-md p-6'>
      <div className='flex items-center mb-4'>
        <Image
          src={mpscore.thumbnail}
          width={50}
          height={100}
          alt={mpscore.name + " image"}
          className='rounded-full mr-4'
        />
        <h1 className='text-2xl font-bold'>Your MP&apos;s 2024 Report Card</h1>
      </div>
      <div className='mb-4'>
        <div className=''>Your MP: {mpscore.name}</div>
        <div className=''>Party: {mpscore.party}</div>
        <div className=''>Constituency: {mpscore.constituency}</div>
      </div>
      <h2 className='text-xl font-bold mb-2'>
        How your MP voted on these key issues this year:
      </h2>
      <ul>
        {mpscore.votes.map((vote, index) => (
          <li key={index} className='flex items-center mb-2'>
            <span className=' mr-2'>{vote.description}:</span>
            <strong className='text-green-600 font-bold'>{vote.grade}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
};

// This function gets called at build time
export const getStaticPaths: GetStaticPaths = async () => {
  // Generate the paths we want to pre-render based on posts
  const paths = Object.keys(constituencies).map((c) => ({
    params: { slug: kebabCase(c) },
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

  const constituencyInfo = constituencies[slug];

  // Call an external API endpoint to get posts
  const res = await fetch("https://.../posts");
  const posts = await res.json();

  // By returning { props: { posts } }, the Blog component
  // will receive `posts` as a prop at build time
  return {
    props: {
      posts,
    },
  };
};

export default Scorecard;

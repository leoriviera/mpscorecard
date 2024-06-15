import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Image from "next/image";
import kebabCase from "lodash.kebabcase";
import constituencies from "../data/constituencies.json";
import parties from "../data/parties.json";
import { clsx, getPartyColorClass } from "../utils";

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
  const a =
    "https://upload.wikimedia.org/wikipedia/commons/7/73/Flat_tick_icon.svg";
  const f =
    "https://upload.wikimedia.org/wikipedia/commons/8/8f/Flat_cross_icon.svg";

  const minus =
    "https://upload.wikimedia.org/wikipedia/commons/3/37/Minus%2C_Web_Fundamentals.svg";

  const mpProfile = (
    <div className='flex items-center mb-4 p-1'>
      <Image
        src={score.thumbnail}
        width={160}
        height={160}
        alt={score.name}
        className='object-cover object-center w-40 h-40 rounded-full border-black border-2'
      />
      <div className='pl-14'>
        <p className='font-extrabold text-3xl'>{score.name}</p>
        <p className={`font-bold text-xl ${score.party.colour}`}>
          {score.party.name}
        </p>
        <p className='font-semibold text-l'>{score.constituency}</p>
      </div>
      <div className='ml-auto mb-auto text-2xl font-bold'>Scorecard</div>
    </div>
  );

  const mpVotes = (
    <div className='space-y-5'>
      <h2 className='text-3xl font-medium'>
        During the last Parliament, your MP voted
      </h2>
      <div className='border-t border-black'></div>

      {score.votes.map((vote, index) => (
        <div
          key={index}
          className='flex flex-row justify-between text-2xl font-extrabold items-center'>
          <span className=''>{vote.description}</span>
          {vote.grade == "A" ? (
            <Image src={a} alt='positive vote' width={60} height={60}></Image>
          ) : (
            <Image src={f} alt='negative vote' width={60} height={60}></Image>
          )}
        </div>
      ))}

      {score.absent.length ? (
        <>
          {score.absent.map((vote, index) => (
            <div
              key={index}
              className='flex flex-row justify-between text-2xl font-extrabold items-center'>
              <span className='text-2xl font-extrabold'>{vote}*</span>
              <Image src={minus} alt='-' width={60} height={50}></Image>
            </div>
          ))}
        </>
      ) : null}
    </div>
  );

  return (
    <div
      className={clsx(
        "min-h-screen min-w-full content-center bg-gradient-to-br from-neutral-200 px-6 lg:px-16",
        score.party.gradient
      )}>
      <div className='flex flex-col p-6 lg:p-10 bg-neutral-100 max-w-3xl rounded-md border-2 border-black'>
        {mpProfile}
        {mpVotes}

        <p className='text-md font-light font-gray-200'>
          *Your MP was absent for these votes
        </p>
        <p className='font-gray-200 text-xs'>
          An MP may have been absent for several reasons, including illness or
          handling constituency business.
        </p>
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

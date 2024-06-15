import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Image from "next/image";
import kebabCase from "lodash.kebabcase";
import {
  CheckCircleIcon,
  XCircleIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/solid";
import { clsx } from "../../utils";

import constituencies from "../data/constituencies.json";
import divisions from "../data/divisions.json";
import parties from "../data/parties.json";

type Vote = {
  id: string;
  description: string;
  grade: "tick" | "x" | "unknown";
};

type MPScorecard = {
  constituency: (typeof constituencies)[keyof typeof constituencies]["constituency"];
  member: Omit<
    (typeof constituencies)[keyof typeof constituencies]["member"],
    "divisions"
  >;
  party: (typeof parties)[keyof typeof parties];
  votes: Vote[];
};

export const Scorecard: NextPage<{ data: MPScorecard }> = ({ data }) => {
  return (
    <div
      className={clsx(
        "min-h-screen min-w-full content-center bg-gradient-to-br from-neutral-200 p-6 lg:px-16",
        data.party.gradient
      )}>
      <div className='flex flex-col max-w-3xl p-4 border-2 border-black rounded-md md:p-6 lg:p-10 bg-neutral-100'>
        {/* Scorecard header */}
        <div className='flex flex-col items-center md:flex-row'>
          <Image
            src={data.member.thumbnail}
            width={160}
            height={160}
            alt={data.member.name}
            className='object-cover object-top w-40 h-40 border-2 border-black rounded-full shrink-0'
          />
          <div className='w-full pt-4 text-center md:pt-0 md:pl-10 md:text-left'>
            <p className='text-sm font-bold uppercase md:text-md'>Scorecard</p>
            <p className='text-2xl font-extrabold md:text-4xl'>
              {data.member.name}
            </p>
            <p
              className={clsx(
                "font-bold text-xl md:text-2xl",
                data.party.colour
              )}>
              {data.party.name}
            </p>
            <p className='font-semibold md:text-xl'>
              MP for {data.constituency.name}
            </p>
          </div>
        </div>

        <div className='my-4 -mx-4 border border-black md:-mx-6 lg:-mx-10'></div>

        {/* Votes */}
        <div className='space-y-2'>
          <h2 className='text-xl font-bold md:text-2xl'>
            During the last Parliament, your MP...
          </h2>

          {data.votes.map((vote, index) => (
            <div
              key={index}
              className='flex flex-row items-center justify-between space-x-2'>
              <p className='text-xl md:text-2xl'>{vote.description}</p>
              {
                {
                  tick: (
                    <CheckCircleIcon className='w-12 h-12 text-green-500 md:h-16 md:w-16 shrink-0' />
                  ),
                  x: (
                    <XCircleIcon className='w-12 h-12 text-red-500 md:h-16 md:w-16 shrink-0' />
                  ),
                  unknown: (
                    <QuestionMarkCircleIcon className='w-12 h-12 text-yellow-500 md:h-16 md:w-16 shrink-0' />
                  ),
                }[vote.grade]
              }
            </div>
          ))}

          {data.votes.filter((v) => v.grade === "unknown").length > 0 && (
            <div className='md:pt-2'>
              <p className='text-sm font-light md:text-md font-gray-200'>
                The{" "}
                <span className='font-bold text-yellow-700'>
                  yellow question mark icon
                </span>{" "}
                means no vote was recorded for your MP. An MP may have no vote
                recorded for several reasons, including if they weren&apos;t an
                MP at the time, if they abstained from a vote, were ill or were
                carrying out constituency or ministerial business.
              </p>
            </div>
          )}
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
  // Params should always have slug, as
  // page is statically generated based on paths
  const { slug } = params!;

  const {
    constituency,
    member: { divisions: memberDivisions, ...member },
  } = constituencies[slug];

  const party = parties[member.party as keyof typeof parties];

  const votes = Object.entries(memberDivisions).map(
    ([id, { vote, teller }]) => {
      const { positive } = divisions[id as keyof typeof divisions];
      const { description } =
        divisions[id as keyof typeof divisions][
          vote as "aye" | "noe" | "notRecorded"
        ];

      return {
        id,
        description: `${description} ${teller ? "(as a teller)" : ""}`,
        grade:
          vote === "notRecorded" ? "unknown" : positive === vote ? "tick" : "x",
      };
    }
  );

  // By returning { props: { posts } }, the Scorecard component
  // will receive `posts` as a prop at build time
  return {
    props: {
      data: {
        constituency,
        party,
        member,
        votes,
      },
    },
  };
};

export default Scorecard;

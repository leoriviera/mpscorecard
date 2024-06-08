import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Image from "next/image";

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
    thumbnail: "www.google.com",
  };
  // Render scorecard page
  return (
    <>
      <Image src={mpscore.thumbnail} alt={mpscore.name + " image"}></Image>
      <h1>Your MP&apos;s 2024 Report Card</h1>
      <div>
        <div>Your MP: {mpscore.name}</div>
        <div>Party: {mpscore.party}</div>
        <div>Constituency: {mpscore.constituency}</div>
      </div>

      <h2>How your MP voted on these key issues this year:</h2>

      <div>{mpscore.votes.map((vote) => vote.description)}</div>
    </>
  );
};

// This function gets called at build time
export const getStaticPaths: GetStaticPaths = async () => {
  // Call an external API endpoint to get posts
  const res = await fetch("https://.../posts");
  const posts = await res.json();

  // Get the paths we want to pre-render based on posts
  const paths = posts.map((post) => ({
    params: { id: post.id },
  }));

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return {
    paths,
    fallback: false,
  };
};

// This function gets called at build time
export const getStaticProps: GetStaticProps = async ({ params }) => {
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

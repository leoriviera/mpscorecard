import { GetStaticPaths, GetStaticProps, NextPage } from "next";

interface Vote {
  aye?: string;
  noe?: string;
  none?: string;
}

interface Division {
  divisionId: string;
  positive: boolean;
  row: Vote;
}

interface MpVote {
  division: Division;
  vote: keyof Vote;
}

interface MpScorecard {
  name: string;
  party: string;
  constituency: string;
  mpvote: MpVote[];
}

export const Scorecard: NextPage = () => {
  let row: Vote = {
    aye: "Voted to ban fraking on shale gas bill",
  };

  let division: Division = {
    divisionId: "Ban on Fracking for Shale Gas Bill",
    positive: true,
    row: row,
  };

  let mpscore: MpScorecard = {
    name: "Keir Starmer",
    party: "Labour",
    constituency: "Holborn and St Pancras",
  };
  // Render scorecard page
  return undefined;
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

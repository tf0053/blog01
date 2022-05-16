import type { NextPage } from "next";
import Link from "next/link";
import { listIssues } from "../lib/issue";
import Time from "../components/Time";
import fs from "fs";
import { generateFeed } from "../lib/feed";

type Props = {
  issues: Array<Issue>;
};

type Issue = any;

const Home: NextPage<Props> = ({ issues }) => {
  return (
    <section>
      <ol className="flex flex-col gap-12">
        {issues.map((issue) => (
          <li key={issue.number}>
            <Time dateTime={issue.created_at} />
            <Link href={`/articles/${issue.number}`}>{issue.title}</Link>
          </li>
        ))}
      </ol>
    </section>
  );
};

export default Home;

export async function getStaticProps() {
  if (process.env.ON_NEXT_BUILD) {
    fs.writeFileSync("public/feed.xml", await generateFeed());
  }

  return {
    props: {
      issues: await listIssues(),
    },
  };
}

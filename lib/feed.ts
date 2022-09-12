import RSS from "rss";
import { listFullIssues, type Issue, type IssueComment } from "./issue";
import { siteBaseUrl } from "../settings";
import { formatInTimeZone } from "date-fns-tz";

export async function generateFeed(): Promise<string> {
  const rss = new RSS({
    description: "Scribbling working memo",
    feed_url: `${siteBaseUrl}/feed.xml`,
    generator: "tf0053/blog01",
    site_url: `${siteBaseUrl}/`,
    title: "tf0053/blog01",
  });

  let fullIssues = await listFullIssues({ limit: 20 });

  fullIssues.forEach(async (fullIssue: Issue) => {
    if (
      fullIssue.title <
      formatInTimeZone(
        new Date(fullIssue.created_at),
        "Europe/Berlin",
        "yyyy-MM-dd"
      )
    ) {
      return;
    }

    const url = `${siteBaseUrl}/articles/${fullIssue.number}`;
    const _cdata = [fullIssue.bodyHTML]
      .concat(
        fullIssue.issueComments.map((issueComment: IssueComment) => {
          return issueComment.bodyHTML;
        })
      )
      .join("<hr>");
    rss.item({
      custom_elements: [
        {
          "content:encoded": {
            _cdata,
          },
        },
      ],
      date: new Date(fullIssue.created_at),
      description: fullIssue.description || "",
      title: fullIssue.title,
      url,
    });
  });

  return rss.xml();
}

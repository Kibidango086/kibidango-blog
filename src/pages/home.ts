import { hero } from "../components/hero";
import { featureCards } from "../components/featureCards";
import { postList } from "../components/postCard";
import { socialFeed } from "../components/socialFeed";
import type { Post } from "../utils/posts";
import type { FeedItem } from "../utils/rss";

export function homePage(posts: Post[], feed: FeedItem[]) {
  return `${hero(socialFeed(feed))}
    ${featureCards()}
    ${postList(posts, 3)}`;
}

import Link from 'next/link';
import { Chip } from '@nextui-org/react';
import paths from '@/paths';
import { db } from '@/db';

export default async function TopicList(){
  const topics = await db.topic.findMany();


  const renderedTopics = topics.map((topic) => (
    <div key={topic.id}>
      <Link href={paths.topicShow(topic.slug)}>
        <Chip color='warning' variant="shadow">
          {topic.slug}
        </Chip>
      </Link>
    </div>
  ))


  return(
    <div className="flex flex-row wrap gap-2 mt-3">
      {renderedTopics}
    </div>
  )
};
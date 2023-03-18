import {
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
  InferGetStaticPropsType,
} from 'next';

import { MDXComponent, SEO } from '@/components';
import { RestrictedLayout } from '@/layouts';
import { styled } from '@/theme';
import { omit } from '@/utils';
import { allThoughts, Thought } from '@contentlayer/generated';
import { format } from 'date-fns';
import { useMDXComponent } from 'next-contentlayer/hooks';
import readTime from 'reading-time';

// #region Styled
const StyledWrapper = styled('div', {
  my: '64px',
  '@md': {
    my: '112px',
  },
  '& h1.title': {
    fontWeight: 'bold',
    fontSize: '48px',
    lineHeight: 1,
    width: '100%',
    '@md': {
      fontSize: '60px',
    },
    '@lg': {
      fontSize: '72px',
    },
  },
  '& h2.description': {
    color: '$gray5',
    fontSize: '$xxl',
    mt: '$6',
  },
  '& div.date-wrapper': {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    borderTopWidth: '1px',
    borderBottomWidth: '1px',
    borderColor: '$gray2',
    py: '$4',
    mt: '$6',
    '@md': {
      flexDirection: 'row',
      alignItems: 'center',
    },
    '& p.reading-time': {
      color: '$gray5',
      mt: '$2',
      '@md': {
        mt: 0,
      },
    },
  },
  '& div.thought-wrapper': {
    mt: '$6',
  },
});
// #endregion Styled

// #region NextJS Data Fetching Functions
export async function getStaticPaths(): Promise<
  GetStaticPathsResult<{ slug: string }>
> {
  const paths = allThoughts.map((thought) => ({
    params: {
      slug: thought.slug,
    },
  }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({
  params,
}: GetStaticPropsContext<{ slug: string }>): Promise<
  GetStaticPropsResult<{
    thought: Omit<Thought, '_id' | '_raw' | 'type'>;
    readingTime: string;
  }>
> {
  const currentThought = allThoughts.find(
    (record) => record.slug === params?.slug,
  ) as Thought;

  const thought = {
    ...omit(currentThought, ['_id', '_raw', 'type']),
    date: format(new Date(currentThought.date), 'dd LLLL yyyy'),
  };

  const readingTime = readTime(thought.body.raw, {
    wordsPerMinute: 255,
  }).text;

  return {
    props: {
      thought,
      readingTime,
    },
  };
}
// #endregion NextJS Data Fetching Functions

export default function ThoughtDetail({
  thought,
  readingTime,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const MDXContent = useMDXComponent(thought.body.code);

  return (
    <RestrictedLayout>
      <SEO
        title={thought.title}
        canonical={thought.slug}
        description={thought.description}
      />
      <StyledWrapper>
        <h1 className="title">{thought.title}</h1>
        <h2 className="description">{thought.description}</h2>
        <div className="date-wrapper">
          <p>Published at : {thought.date}</p>
          <p className="reading-time">{readingTime}</p>
        </div>
        <div className="thought-wrapper">
          <MDXContent components={MDXComponent} />
        </div>
      </StyledWrapper>
    </RestrictedLayout>
  );
}

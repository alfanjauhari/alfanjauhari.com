import { allThoughts, Thought } from '@/../.contentlayer/generated';
import { SEO, SimpleCard } from '@/components';
import { RestrictedLayout } from '@/layouts';
import { styled } from '@/theme';
import { omit } from '@/utils';
import * as Dialog from '@radix-ui/react-dialog';
import { compareDesc, format } from 'date-fns';
import { GetStaticPropsResult, InferGetStaticPropsType } from 'next';
import { useEffect, useState } from 'react';

// #region Styled
const StyledPromptOverlay = styled(Dialog.Overlay, {
  backdropFilter: 'blur(20px)',
  position: 'fixed',
  inset: 0,
});

const StyledPromptContent = styled(Dialog.Content, {
  backgroundColor: 'white',
  borderRadius: '6px',
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90vw',
  maxWidth: '450px',
  maxHeight: '85vh',
  boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
  padding: 25,
  '&:focus': {
    outline: 'none',
  },
});

const StyledPromptTitle = styled(Dialog.Title, {
  fontWeight: 600,
  fontSize: '24px',
});

const StyledPromptCTA = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '$2',
  mt: '$2',
});

const StyledArticles = styled('section', {
  my: '64px',
  '@md': {
    my: '112px',
  },
  '& div.title-description-wrapper': {
    borderBottom: '1px',
    borderColor: '$gray2',
    borderStyle: 'solid',
    pb: '$6',
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
  },
  '& article.articles-list': {
    mt: '$8',
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '$8',
  },
  '& h1.not-found-message': {
    fontSize: '$xxl',
    mt: '$4',
    color: '$gray4',
  },
});
// #endregion Styled

export async function getStaticProps(): Promise<
  GetStaticPropsResult<{
    thoughts: Omit<Thought, '_id' | '_raw' | 'body'>[];
  }>
> {
  const thoughts = allThoughts
    .sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)))
    .map(({ date, ...thought }) => ({
      ...omit(thought, ['_id', '_raw', 'body']),
      date: format(new Date(date), 'dd LLLL yyyy'),
    }));

  return {
    props: {
      thoughts,
    },
  };
}

export default function Thoughts({
  thoughts,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [isAccepted, setIsAccepted] = useState(false);
  const [customLocalStorage, setCustomLocalStorage] = useState<Storage>();

  useEffect(() => {
    const isAcceptedReq = localStorage.getItem('isAccepted')
      ? (JSON.parse(localStorage.getItem('isAccepted') as string) as boolean)
      : false;

    setCustomLocalStorage(localStorage);
    setIsAccepted(isAcceptedReq);
  }, []);

  if (!customLocalStorage) return null;

  return (
    <RestrictedLayout>
      <SEO
        title="Thoughts"
        canonical="/thoughts"
        description='A collection of my thoughts about anything. Be careful, some of them are not suitable for "children".'
      />
      <StyledArticles id="articles">
        <div className="title-description-wrapper">
          <h1 className="title">Thoughts</h1>
          <h2 className="description">
            A collection of my thoughts about anything. Be careful, some of them
            are not suitable for &quot;children&quot;.
          </h2>
        </div>
        {thoughts.length > 0 ? (
          <article className="articles-list">
            {thoughts.map((thought) => (
              <SimpleCard
                href={`/thoughts/${thought.slug}`}
                title={thought.title}
                description={thought.description}
                publishedAt={thought.date}
                key={thought.slug}
              />
            ))}
          </article>
        ) : (
          <h1 className="not-found-message">
            No data found. Sometimes we just prefer to live quietly rather than
            arguing
          </h1>
        )}
      </StyledArticles>
    </RestrictedLayout>
  );
}

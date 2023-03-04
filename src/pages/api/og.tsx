import { ImageResponse } from '@vercel/og';
import { NextRequest, NextResponse } from 'next/server';

export const config = {
  runtime: 'edge',
};

const poppinsBoldFont = fetch(
  new URL('../../assets/poppins-bold.ttf', import.meta.url),
).then((res) => res.arrayBuffer());
const poppinsRegularFont = fetch(
  new URL('../../assets/poppins-regular.ttf', import.meta.url),
).then((res) => res.arrayBuffer());

export default async function OGImage(req: NextRequest) {
  const poppinsBold = await poppinsBoldFont;
  const poppinsRegular = await poppinsRegularFont;

  const title = new URL(req.url).searchParams.get('title');

  if (!title) {
    return NextResponse.redirect(new URL('/404', req.url));
  }

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          padding: '48px',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <div
          style={{
            fontSize: '48px',
            fontFamily: 'Poppins Bold',
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: '16px',
            fontFamily: 'Poppins Regular',
            position: 'absolute',
            top: 42,
            left: 42,
            backgroundColor: '#000000',
            borderRadius: '4px',
            color: '#ffffff',
            padding: '4px 8px',
          }}
        >
          Alfan Jauhari
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          data: poppinsBold,
          name: 'Poppins Bold',
          style: 'normal',
        },
        {
          data: poppinsRegular,
          name: 'Poppins Regular',
          style: 'normal',
        },
      ],
    },
  );
}

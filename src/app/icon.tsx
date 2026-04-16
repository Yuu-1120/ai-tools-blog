import { ImageResponse } from 'next/og';

export const size = {
  width: 32,
  height: 32
};

export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: 'linear-gradient(135deg, #c96442 0%, #e8a090 100%)',
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="10" stroke="white" strokeWidth="2" fill="none" opacity="0.9"/>
          <circle cx="16" cy="16" r="4" fill="white"/>
          <circle cx="16" cy="16" r="2" fill="#c96442"/>
        </svg>
      </div>
    ),
    {
      ...size
    }
  );
}

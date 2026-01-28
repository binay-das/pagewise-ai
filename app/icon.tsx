import { ImageResponse } from 'next/og'

export function generateImageMetadata() {
    return [
        {
            id: 'light',
            alt: 'PageWise',
            size: { width: 32, height: 32 },
            contentType: 'image/png',
        },
        {
            id: 'dark',
            alt: 'PageWise',
            size: { width: 32, height: 32 },
            contentType: 'image/png',
            media: '(prefers-color-scheme: dark)',
        },
    ]
}

export default function Icon({ id }: { id: string }) {
    const isDark = id === 'dark'

    const bg = isDark ? '#ffffff' : '#171717'
    const fg = isDark ? '#171717' : '#ffffff'

    return new ImageResponse(
        (
            <div
                style={{
                    fontSize: 24,
                    background: bg,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: fg,
                    borderRadius: '8px',
                }}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ width: '16px', height: '16px' }}
                >
                    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275Z" />
                </svg>
            </div>
        ),
        {
            width: 32,
            height: 32,
        }
    )
}

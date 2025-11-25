import '../styles/globals.css'

export const metadata = {
  title: 'TalkFlow',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <main style={{ padding: 24, fontFamily: 'Inter, system-ui, Arial' }}>{children}</main>
      </body>
    </html>
  )
}

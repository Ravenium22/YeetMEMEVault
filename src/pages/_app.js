import Head from 'next/head';
import { ThemeProvider } from 'next-themes';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider attribute="class">
      <Head>
        <title>Yeet Meme Vault</title>
        <meta name="description" content="Your one-stop meme vault for all the dankest content" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Basic favicon */}
        <link rel="shortcut icon" href="/favicon.ico" />
        
        {/* Individual PNG icons */}
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        
        {/* Apple Touch Icon */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        
        {/* Android */}
        <link rel="manifest" href="/site.webmanifest" />
      </Head>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
'use client'
import { Container } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function NotFound(){
    const router = useRouter();
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/');
    }, 3000);
    return () => clearTimeout(timer);
  }, [router]);

    return (
        <Container style={{
            color: 'rgb(150,23,2)',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center'
          }}>
            {/* <Image src="/images/404_page.webp" height={'300'} width={'500'}></Image> */}
            <h1 style={{ fontSize: '3rem',lineHeight:'3.5rem',marginTop:'50px' }}>404 - Page Not Found</h1>
            <p style={{ fontSize: '1.5rem',lineHeight:'1.5rem',marginTop:'20px' }}>You will be redirected to the homepage shortly...</p>
          </Container>
      

    )
}
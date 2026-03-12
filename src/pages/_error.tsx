import { NextPage } from 'next';
import Link from 'next/link';

interface ErrorProps {
  statusCode?: number;
}

const Error: NextPage<ErrorProps> = ({ statusCode }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '50vh',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <div style={{ fontSize: '6rem', fontWeight: 'bold', color: '#ccc', marginBottom: '1rem' }}>
        {statusCode || 'Error'}
      </div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
        오류가 발생했습니다
      </h2>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>
        요청하신 페이지를 처리하는 중 문제가 발생했습니다.
      </p>
      <Link
        href="/"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          padding: '0.5rem 1rem',
          backgroundColor: '#3B82F6',
          color: 'white',
          borderRadius: '0.375rem',
          textDecoration: 'none',
        }}
      >
        홈으로 가기
      </Link>
    </div>
  );
};

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;

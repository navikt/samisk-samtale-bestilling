import { GetServerSideProps } from 'next';
import { SamiskSamtaleApp } from '../components/SamiskSamtaleApp';

export const getServerSideProps: GetServerSideProps = async () => {
  return { props: {} };
};

export default SamiskSamtaleApp;

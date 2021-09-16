import { GetServerSideProps } from 'next';
import { SamiskSamtaleApp } from '../components/SamiskSamtaleApp';

export const getServerSideProps: GetServerSideProps = async (context) => {
    // Redirect all requests to app base path
    if (context.query?.index) {
        return {
            props: {},
            redirect: {
                destination: '/',
            },
        };
    }

    return { props: {} };
};

export default SamiskSamtaleApp;

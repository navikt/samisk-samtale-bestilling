import { GetStaticPaths, GetStaticProps } from 'next';
import { SamiskSamtaleApp } from '../components/SamiskSamtaleApp';

export const getStaticProps: GetStaticProps = async (context) => {
    // Redirect all requests to app base path
    if (context.params?.index) {
        return {
            props: {},
            redirect: {
                destination: '/',
            },
        };
    }

    return { props: {} };
};

export const getStaticPaths: GetStaticPaths = async () => {
    return { paths: [], fallback: 'blocking' };
};

export default SamiskSamtaleApp;

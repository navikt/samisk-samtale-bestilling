import { SamiskSamtaleApp } from '../components/SamiskSamtaleApp';
import { GetStaticProps } from "next";

export const getStaticProps: GetStaticProps = async () => {
    return {
        props: {},
        revalidate: 300
    };
};

export default SamiskSamtaleApp;

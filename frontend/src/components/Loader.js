import React from "react";
import { ThreeDots } from "react-loader-spinner";

const LoaderComp = ({ coloripl }) => {
    return (
        <ThreeDots
            height="80"
            width="80"
            color={coloripl || "white"}
            ariaLabel="three-dots-loading"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
        />
    );
};

export default LoaderComp;

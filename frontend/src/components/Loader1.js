import { TailSpin } from "react-loader-spinner";
const LoaderComp1 = () => {
    return (
        <TailSpin
            height="80"
            width="80"
            color="#333"
            ariaLabel="tail-spin-loading"
            radius="1"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
        />
    );
};  
export default LoaderComp1;
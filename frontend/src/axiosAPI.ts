import axios from "axios";

const backendUri = (import.meta.env.VITE_BACKEND_URI || "http://localhost:3000");

async function axiosGet(uriPath: string): Promise<Result> {
    const uri = backendUri + uriPath;
    console.log("GET", uriPath);

    return await axios.get(uri)
        .then((response) => {
            const responseMessage = response.data.message;
            console.log(">GET", responseMessage);

            return new Result(response.data, response.status, responseMessage, true);
        })
        .catch((error) => {
            const responseMessage = error?.response?.data?.message;
            console.log(">GET", responseMessage);

            return new Result(null, error.status, responseMessage, false);
        });
}

async function axiosPost(uriPath: string, requestBody: Object): Promise<Result> {
    if (!requestBody || Object.values(requestBody).some((value) => !value)) {
        console.error("POST", "Reqest Body has empty values", requestBody);
        return new Result(null, 400, "Reqest Body has empty values", false);
    }
    const uri = backendUri + uriPath;
    console.log("POST", uriPath, requestBody);

    return await axios.post(uri, requestBody)
        .then((response) => {
            const responseMessage = response.data.message;
            console.log(">POST", responseMessage);

            return new Result(response.data, response.status, responseMessage, true);
        })
        .catch((error) => {
            console.log(error);

            const responseMessage = error?.response?.data?.message;
            console.log(">POST", responseMessage);

            return new Result(null, error.status, responseMessage, false);
        });
}

function useAxiosAPI() {
    return {
        axiosGet,
        axiosPost,
    };
}

export class Result {
    data: Object | null;
    statusCode: number;
    message: string;
    success: boolean;
    constructor(data: Object | null, statusCode: number, message: string, success: boolean) {
        this.data = data;
        this.statusCode = statusCode;
        this.message = message;
        this.success = success;
    }
}

export default useAxiosAPI;
import { useRouteError } from "react-router-dom";

const ErrorBoundary = () => {
    const error = useRouteError();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-3xl font-bold text-red-600">
                Oops! Something went wrong.
            </h1>
            <p className="text-gray-700">
                Error: {error?.statusText || "Unknown Error"}
            </p>
        </div>
    );
};

export default ErrorBoundary;

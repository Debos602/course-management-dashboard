import PropTypes from "prop-types";

export const Button = ({
    children,
    type = "button",
    className = "",
    ...props
}) => {
    return (
        <button
            type={type}
            className={`w-full bg-brand-600 text-white py-2 rounded-md hover:bg-brand-700 transition-colors shadow-md ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

Button.propTypes = {
    children: PropTypes.node.isRequired,
    type: PropTypes.string,
    className: PropTypes.string,
};

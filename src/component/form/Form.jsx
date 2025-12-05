import PropTypes from "prop-types";

export const Form = ({ children, onSubmit, className = "", ...props }) => {
    return (
        <form
            onSubmit={onSubmit}
            className={`space-y-5 ${className}`}
            {...props}
        >
            {children}
        </form>
    );
};

Form.propTypes = {
    children: PropTypes.node.isRequired,
    onSubmit: PropTypes.func,
    className: PropTypes.string,
};

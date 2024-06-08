import { Button } from "flowbite-react";
import PropTypes from "prop-types";

const ButtonEx = ({ title, type, size, onClick, outline }) => {
  return (
    <Button
      type={type}
      size={size}
      onClick={onClick}
      className="bg-gradient-to-r from-greenEx to-blueEx hover:from-blueEx hover:to-greenEx"
      outline={outline}
    >
      {title}
    </Button>
  );
};

ButtonEx.propTypes = {
  title: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  onClick: PropTypes.func,
  outline: PropTypes.bool,
  // width: PropTypes.string,
  // loading: PropTypes.bool,
  // padding: PropTypes.string,
  // noIcon: PropTypes.bool
};

export default ButtonEx;

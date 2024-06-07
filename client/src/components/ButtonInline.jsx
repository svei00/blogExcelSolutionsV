import { Button } from "flowbite-react";
import PropTypes from "prop-types";

const ButtonInline = ({ title, type, size, onClick }) => {
  return (
    <Button
      type={type}
      className="bg-gradient-to-r from-greenEx to-blueEx hover:from-blueEx hover:to-greenEx"
      size={size}
      onClick={onClick}
    >
      {title}
    </Button>
  );
};

ButtonInline.propTypes = {
  title: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  onClick: PropTypes.func,
  // width: PropTypes.string,
  // loading: PropTypes.bool,
  // padding: PropTypes.string,
  // noIcon: PropTypes.bool
};

export default ButtonInline;

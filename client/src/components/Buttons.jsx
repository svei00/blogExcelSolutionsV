import { Button } from "flowbite-react";
import PropTypes from "prop-types";

const ButtonOutline = ({ title, type }) => {
  return (
    <Button
      type={type}
      className="bg-gradient-to-r from-blueEx to-greenEx"
      outline
    >
      {title}
    </Button>
  );
};

ButtonOutline.propTypes = {
  title: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  // onClick: PropTypes.func,
  // width: PropTypes.string,
  // loading: PropTypes.bool,
  // padding: PropTypes.string,
  // noIcon: PropTypes.bool
};

export default ButtonOutline;

const ButtonInline = ({ title, type }) => {
  return (
    <Button
      type={type}
      className="bg-gradient-to-r from-greenEx to-blueEx hover:from-blueEx hover:to-greenEx"
    >
      {title}
    </Button>
  );
};

ButtonInline.propTypes = {
  title: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  // onClick: PropTypes.func,
  // width: PropTypes.string,
  // loading: PropTypes.bool,
  // padding: PropTypes.string,
  // noIcon: PropTypes.bool
};

export { ButtonInline };

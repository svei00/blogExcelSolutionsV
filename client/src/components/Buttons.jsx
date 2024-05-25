import { Button } from "flowbite-react";
import PropTypes from "prop-types";

const ButtonOutline = ({ title }) => {
  return (
    <Button className="bg-gradient-to-r from-blueEx to-greenEx" outline>
      {title}
    </Button>
  );
};

ButtonOutline.propTypes = {
  title: PropTypes.string.isRequired,
  // onClick: PropTypes.func,
  // width: PropTypes.string,
  // loading: PropTypes.bool,
  // padding: PropTypes.string,
  // noIcon: PropTypes.bool
};

export default ButtonOutline;

import { Button } from "flowbite-react";
import PropTypes from "prop-types";

const ButtonEx1 = ({ title }) => {
  return (
    <Button className="bg-gradient-to-r from-blueEx to-greenEx" outline>
      {title}
    </Button>
  );
};

ButtonEx1.propTypes = {
  title: PropTypes.string.isRequired,
  // onClick: PropTypes.func,
  // width: PropTypes.string,
  // loading: PropTypes.bool,
  // padding: PropTypes.string,
  // noIcon: PropTypes.bool
};

export default ButtonEx1;

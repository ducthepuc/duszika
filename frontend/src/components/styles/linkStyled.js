import styled from 'styled-components';
import { motion } from 'framer-motion';

const AnimatedLink = styled(motion.a)`
  font-size: 1.2rem;
  text-decoration: none;
  color: #6200ea;
  font-weight: bold;
  position: relative;
  transition: color 0.3s ease;

  &:hover {
    color: #ea7900;
  }

  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: #6200ea;
    transform: scaleX(0);
    transform-origin: bottom right;
    transition: transform 0.3s ease;
  }

  &:hover::after {
    transform: scaleX(1);
    transform-origin: bottom left;
  }
`;

export default AnimatedLink;
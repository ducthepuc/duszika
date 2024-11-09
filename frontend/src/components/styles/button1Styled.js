import styled from 'styled-components';
import { motion } from 'framer-motion';

const AnimatedButton = styled(motion.button)`
    background-color: rgb(40,40,40);
    color: rgb(240,240,240);
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    font-size: 1rem;
    cursor: pointer;
    margin: 5px 10px;
    outline: 2px solid rgb(20,20,20);
    transition: 0.3s color 0.1s ease;
    
    &:hover {
        background-color: rgb(240,240,240); 
        color: rgb(40,40,40);
        outline: 4px solid rgb(20,20,20);
        
        &:before {
            content: '•';
        }
        &:after {
            content: '•';
        }
    }
`
export default AnimatedButton;
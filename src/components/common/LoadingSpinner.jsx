import styled from '@emotion/styled';
import { motion } from 'framer-motion';

const SpinnerContainer = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
`;

const Spinner = styled(motion.div)`
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #2563eb;
  border-radius: 50%;
`;

export const LoadingSpinner = () => (
  <SpinnerContainer>
    <Spinner
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  </SpinnerContainer>
); 
import React from 'react';
import styled from 'styled-components';

const Button = () => {
  return (
    <StyledWrapper>
      <button>Connect Wallet</button>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  button {
    --glow-color: #2CC295;
    --glow-spread-color: rgba(44, 194, 149, 0.4);
    --enhanced-glow-color: #2CC295;
    --btn-color: #03221B; /* Background dark tone */
    border: 0.25em solid var(--glow-color);
    padding: 1em 3em;
    color: #F1F7F6;
    font-size: 15px;
    font-weight: bold;
    background-color: var(--btn-color);
    border-radius: 1em;
    outline: none;
    box-shadow:
      0 0 1em 0.25em var(--glow-color),
      0 0 4em 1em var(--glow-spread-color),
      inset 0 0 0.75em 0.25em var(--glow-color);
    text-shadow: 0 0 0.5em var(--glow-color);
    position: relative;
    transition: all 0.3s;
  }

  button::after {
    pointer-events: none;
    content: "";
    position: absolute;
    top: 120%;
    left: 0;
    height: 100%;
    width: 100%;
    background-color: var(--glow-spread-color);
    filter: blur(2em);
    opacity: 0.7;
    transform: perspective(1.5em) rotateX(35deg) scale(1, 0.6);
  }

  button:hover {
    color: var(--btn-color);
    background-color: var(--glow-color);
    box-shadow:
      0 0 1em 0.25em var(--glow-color),
      0 0 4em 2em var(--glow-spread-color),
      inset 0 0 0.75em 0.25em var(--glow-color);
  }

  button:active {
    box-shadow:
      0 0 0.6em 0.25em var(--glow-color),
      0 0 2.5em 2em var(--glow-spread-color),
      inset 0 0 0.5em 0.25em var(--glow-color);
  }
`;

export default Button;

import React from 'react';
import styled from "styled-components";
import { useSpring, animated, InterpolationConfig } from 'react-spring';

import logoImg from 'assets/logo.svg';

const calc = (x, y) => [-(y - window.innerHeight / 2) / 20, (x - window.innerWidth / 2) / 40, 1.1]
const trans = (x, y, s) => `perspective(300px) rotateX(${x}deg) rotateY(${y}deg) scale(${s})`

const Test = styled(animated.div)`
  width: 300px;
  height: 64px;
  background: url(${logoImg}) no-repeat center center;
  display: flex;
`;

const Logo = () => {
  const [props, set] = useSpring(() => (
    { xys: [0, 0, 1], config: { mass: 5, tension: 350, friction: 40 } }
  ))
  return (
    <Test
      onMouseMove={({ clientX: x, clientY: y }) => set({ xys: calc(x, y) })}
      onMouseLeave={() => set({ xys: [0, 0, 1] })}
      style={{ transform: props.xys.interpolate(trans) }}
    />
  )
};

export default Logo;

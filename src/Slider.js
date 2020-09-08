import React, { useState, useEffect } from 'react';
import styled from "styled-components";

const slides = [
  'https://images.unsplash.com/photo-1449034446853-66c86144b0ad?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2100&q=80',
  'https://images.unsplash.com/photo-1470341223622-1019832be824?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2288&q=80',
  'https://images.unsplash.com/photo-1448630360428-65456885c650?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2094&q=80',
  'https://images.unsplash.com/photo-1534161308652-fdfcf10f62c4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2174&q=80'
]

export const StyledWrapper = styled.div`
position: relative;
height: 100vh;
width: 100vw;
margin: 0 auto;
overflow: hidden;
`;

export const StyledSlider = styled.div`
transform: translateX(-${props => props.translate}px);
transition: transform ease-out ${props => props.transition}s;
height: 100%;
width: ${props => props.width}px;
display: flex;
`;

const StyledSlide = styled.div`
flex: 0 0 100%;
height: 100%;
width: 100%;
background-image: url('${props => props.content}');
background-size: cover;
background-repeat: no-repeat;
background-position: center;
`

const StyledArrow = styled.div`
color: black;
display: flex;
position: absolute;
top: 50%;
${props => props.direction === 'right' ? `right: 25px` : `left: 25px`};
height: 50px;
width: 50px;
justify-content: center;
background: white;
border-radius: 50%;
cursor: pointer;
align-items: center;
transition: transform ease-in 0.1s;
&:hover {
  transform: scale(1.1);
}
img {
  transform: translateX(${props => props.direction === 'left' ? '-2' : '2'}px);
  &:focus {
    outline: 0;
  }
}`;

const Dot = styled.div`
padding: 10px;
margin-right: 5px;
cursor: pointer;
border-radius: 50%;
background: ${props => props.active ? 'black' : 'white'};
`;

const StyledDots = styled.div`
position: absolute;
bottom: 25px;
width: 100%;
display: flex;
align-items: center;
justify-content: center;
`;

const Slide = ({ content }) => (
  <StyledSlide content={content} />
)

const Dots = ({ activeIndex, handleClick }) => (
  <StyledDots>
    {slides.map((slide, i) => (
      <Dot key={slide} active={activeIndex === i} onClick={() => handleClick(i)} />
    ))}
  </StyledDots>
)

const Arrow = ({ direction, handleClick }) => (
  <StyledArrow direction={direction} onClick={handleClick}>{direction === "left" ? "<" : ">"}</StyledArrow>
)

const Slider = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [translate, setTranslate] = useState(window.innerWidth);
  const [transition, setTransition] = useState(0.5);
  const [slide, setSlides] = useState([slides[slides.length - 1], slides[0], slides[1]]);
  const getWidth = () => window.innerWidth;

  useEffect(() => {
    const timer = setInterval(() => { nextSlide() }, 3000);
    const transitionEnd = window.addEventListener('transitionend', createSlides);

    return () => {
      clearInterval(timer);
      window.removeEventListener('transitionend', transitionEnd);  
    }
  });

  function prevSlide() {
    setActiveIndex(activeIndex === 0 ? slides.length - 1 : activeIndex - 1);
    setTranslate(0);
    setTransition(0.5);
  }

  function nextSlide() {
    setActiveIndex(activeIndex === slides.length - 1 ? 0 : activeIndex + 1);
    setTranslate(translate + getWidth())
    setTransition(0.5);
  }

  function gotoSlide(number) {
    setActiveIndex(number);
    setTranslate(number * getWidth());
    setTransition(0.5);
  }

  function createSlides() {
    let images = [];

    if (activeIndex === slides.length - 1) {
      images = [slides[slides.length - 2], slides[slides.length - 1], slides[0]];
    } else if (activeIndex === 0) {
      images = [slides[slides.length - 1], slides[0], slides[1]];
    } else {
      images = slides.slice(activeIndex - 1, activeIndex + 2)
    }

    setTransition(0);
    setTranslate(getWidth());
    setSlides(images)
  }

  return (
    <StyledWrapper>
      <StyledSlider width={getWidth()} translate={translate} transition={transition}>
        {slide.map((slide, i) => (
          <Slide key={slide + i} content={slide} width={getWidth()} />
        ))}
      </StyledSlider>
      <Arrow direction="left" handleClick={() => { prevSlide(); }} />
      <Arrow direction="right" handleClick={() => { nextSlide(); }} />
      <Dots activeIndex={activeIndex} handleClick={gotoSlide} />
    </StyledWrapper>
  );
}

export default Slider;

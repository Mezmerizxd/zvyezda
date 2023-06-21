import styled from 'styled-components';

export const Container = styled.div`
  width: 100vw;
  height: 100vh;
`;

export const Card = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  h1 {
    font-family: 'Quicksand', sans-serif;
    font-weight: bold;
    font-size: 3rem;
    border-radius: 6px;
    color: black;
  }

  p {
    font-family: 'Quicksand', sans-serif;
    font-weight: lighter;
    font-size: 2rem;
    border-radius: 6px;
    color: black;
  }
`;

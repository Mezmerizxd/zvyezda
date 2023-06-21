import styled from 'styled-components';

export const IconInput = styled.div`
  display: grid;
  grid-template-columns: 40px 1fr;
  width: 100%;
  height: 40px;

  border: 1px solid rgba(50, 50, 50, 0.5);
  border-radius: 2px;

  .Icon {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;

    svg {
      color: rgb(50, 50, 50);
    }
  }

  .InputField {
    padding-right: 5px;

    input {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      border: none;
      outline: none;
      color: rgba(40, 40, 40, 1);
      font-size: 16px;
      font-weight: 500;

      &::placeholder {
        color: rgba(50, 50, 50, 0.7);
        font-size: 15px;
        font-weight: 500;
      }
    }
  }
`;

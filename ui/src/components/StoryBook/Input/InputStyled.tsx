// import styled from "@emotion/styled";
import styled from '@emotion/styled/macro';
import { type InputProps } from './InputTypes';

export const InputBoxAdornmentLefet = styled('div')<InputProps>`
  width: 54px;
  height: 100%;
  padding: 1rem 0.75rem 1rem 0.88rem;
  display: flex;
  align-items: center;
  border: none;
  background: ${(props) => (props.value ? '#262626' : '#C0C0C0')};
`;

export const InputBoxAdornmentRigth = styled('div')<InputProps>`
  font-family: Inter;
  font-size: 16px;
  font-weight: 400;

  width: 54px;
  height: 100%;
  padding: 1rem 0.75rem 1rem 0.88rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: ${(props) =>
    props.value ? props.theme.color?.indicatorColor.ef1 : '#C0C0C0'};

  color: ${(props) => (props.value ? '#f4f4f4' : '#040404')};
`;

export const InputBox = styled('div')<InputProps>((props) => {
  return {
    display: 'flex',
    width: '100%',

    padding: `${
      props.type === 'form-group'
        ? '0px'
        : props.type === 'input-button'
          ? '0.5rem 0.5rem 0.5rem 0.88rem'
          : '1rem 0.88rem'
    }`,

    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'stretch',
    borderRadius: '4px',

    overflow: 'hidden',
    boxSizing: 'border-box',
    // [`&:${props.disabled}`]: {
    //   // border: `2px solid ${'#DFDFDF'})`
    // },
    border: `2px solid ${
      props.disabled
        ? '#DFDFDF'
        : props.value
          ? props.theme.color?.indicatorColor.ef1
          : '#C0C0C0'
    }`,

    background: `${props.disabled ? '#DFDFDF' : '#fff'}`,

    '&:focus-within': {
      border: `2px solid #262626`,
      background: `#fff`,
      outline: 'none',
      color: `${'#000'}`,

      [`${InputBoxAdornmentLefet}`]: {
        background: `#262626`
      },
      [`${InputBoxAdornmentRigth}`]: {
        background: `#262626`
      }
    },
    '::before':
      props.type === 'file'
        ? {
            content: `""Attr(placeholder)""`,
            fontFamily: 'Inter',
            fontSize: '16px',
            fontStyle: 'normal',
            fontWeight: 400,
            lineHeight: 'normal',
            pointerEvents: 'none',
            zIndex: 20,
            color: `#c0c0c0`
          }
        : {}
  };
});

export const InputStyled = styled('input')<InputProps>`
  display: ${(porps) => (porps.type === 'file' ? 'none' : 'flex')};
  width: 100%;
  max-width: 100%;
  align-items: center;
  align-self: stretch;
  border: none;
  background: transparent;
  overflow: hidden;

  color: ${(props) => '#000'};
  text-overflow: ellipsis;

  padding: ${(props) =>
    props.type === 'form-group'
      ? '0px 0.25rem'
      : props.type === 'input-button'
        ? '0px 0.3rem 0px 0px'
        : '0px 0.3rem 0px 0px'};

  /* Body/Regular */
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;

  &:focus {
    border: none;
    outline: none;

    color: ${(props) => '#000'};
  }

  &:disabled {
    border: none;
    background: ${(props) => '#DFDFDF'};

    color: ${(props) => '#C0C0C0'};

    ${InputBox} {
      border: 2px solid ${(props) => '#DFDFDF'};
      background: ${(props) => '#DFDFDF'};
    }
  }

  &:valid {
    ${InputBoxAdornmentLefet} {
      background: ${(props) => '#FF8B5E'};
    }

    ${InputBoxAdornmentRigth} {
      background: ${(props) => '#FF8B5E'};
    }

    ${InputBox} {
      border: 2px solid cyan;
    }
  }

  &:invalid {
    ${InputBoxAdornmentLefet} {
      background: ${(props) => '#FF8B5E'};
    }

    ${InputBoxAdornmentRigth} {
      background: ${(props) => '#FF8B5E'};
    }

    ${InputBox} {
      border: 2px solid ${(props) => '#FF8B5E'};
    }
  }

  &::placeholder {
    color: ${(props) => '#C0C0C0'};
  }

  &::-ms-input-placeholder {
    /* Edge 12-18 */
    color: ${(props) => '#C0C0C0'};
  }
`;

export const CalendarDivContainer = styled('div')<InputProps>`
  position: relative;
  display: inline-block;
`;

export const CalendarDivContent = styled('div')<InputProps>((props) => {
  return {
    marginTop: '-17px',
    display: `${props.isOpen ? 'block' : 'none'}`,
    position: 'absolute',
    boxShadow: '0px 8px 16px 0px rgba(0,0,0,0.2)',
    zIndex: 1
  };
});

export const Input = styled.input`
  width: 100%;
  height: 56px;

  padding: 0.5rem 0.5rem 0.5rem 0.88rem;
  border-radius: 4px;
  border: 2px solid #c0c0c0;

  background: #fff;

  &:focus-within {
    border: 2px solid #262626;
    background: #fff;
    outline: 'none';
    color: '#000';
  }
`;

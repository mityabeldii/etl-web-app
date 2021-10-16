/*eslint-disable*/
import styled, { css } from "styled-components";

const Textarea = (props = {}) => {
    return <StyledTextarea {...props} />;
};

const StyledTextarea = styled.textarea.attrs((props) => {
    return {
        ...props,
    };
})`
    &:focus {
        outline: none;
    }

    width: 100%;
    height: 100%;
    min-height: 75px;
    padding: 7px 20px;
    box-sizing: border-box;
    border-radius: 4px;
    border: 1px solid #dadada;
    background: ${({ theme }) => theme.background.secondary};
    color: ${({ theme }) => theme.text.primary};
    display: flex;
    flex: 1;
    margin: 0;
    font-size: inherit;

    resize: none;

    ::-webkit-input-placeholder {
        color: ${({ theme }) => theme.text.secondary};
    }
    :-ms-input-placeholder {
        color: ${({ theme }) => theme.text.secondary};
    }

    ${({ extra }) => extra}
`;

export default Textarea;
/*eslint-enable*/

import styled from '@emotion/styled'

export const BaseButton = styled.button`
    padding: 0px 24px;
    border-radius: 8px;
    align-items: center;
    justify-content: center;
    text-transform: uppercase;
    line-height: 29.26px;
    display: flex;
    flex-direction: row;
    gap: 8px;
`

export const BlackButton = styled(BaseButton)`
    width: 240px;
    padding: 4px 16px;
    border: 3px solid #2f3c4f;
    background-color: #2f3c4f;
    color: white;
    &:hover {
        background-color: grey;
        border-color: grey;
    }
    &:active {
        background-color: white;
        color: #2f3c4f;
    }
`

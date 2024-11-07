import styled from '@emotion/styled'
import { Column, Id } from '../types'
import { BaseButton } from './atoms/button'
import { TrashIcon } from '../assets/icons/TrashIcon'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const Container = styled.div`
    width: 240px;
    max-height: 500px;
    background-color: #2f3c4f;
    color: white;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
`

const Header = styled.div`
    background-color: #21252e;
    padding: 16px;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    cursor: grab;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: row;
    gap: 8px;
`

const Content = styled.div`
    padding: 16px;
    overflow-y: auto;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
`

const Footer = styled.div`
    background-color: #21252e;
    padding: 16px;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
`

const ItemsNumber = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #3e3f63;
    border-radius: 4px;
    padding: 4px 8px;
`

const TitleContainer = styled.div`
    display: flex;
    flex-direction: row;
    gap: 8px;
    align-items: center;
`

const TrashButton = styled(BaseButton)`
    background-color: transparent;
    border-radius: 4px;
    padding: 4px;
    border: 3px solid transparent;
    color: grey;
    &:hover {
        background-color: #3e3f63;
        border: 3px solid #3e3f63;
        color: white;
    }
    &:active {
        background-color: #6882a8;
        border: 3px solid #4a5d78;
    }
`

interface Props {
    column: Column
    deleteColumn: (id: Id) => void
}

export default function ColumnContainer(props: Props) {
    const { column, deleteColumn } = props

    const { setNodeRef, attributes, listeners, transform, transition } = useSortable({
        id: column.id,
        data: {
            type: 'Column',
            column,
        },
    })

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    }

    return (
        <Container ref={setNodeRef} style={style}>
            <Header {...attributes} {...listeners}>
                <TitleContainer>
                    <ItemsNumber>0</ItemsNumber>
                    {column.title}
                </TitleContainer>
                <TrashButton onClick={() => deleteColumn(column.id)}>
                    <TrashIcon />
                </TrashButton>
            </Header>
            <Content>Content</Content>
            <Footer>Footer</Footer>
        </Container>
    )
}

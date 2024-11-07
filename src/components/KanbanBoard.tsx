import { useMemo, useState } from 'react'
import { PlusIcon } from '../assets/icons/PlusIcon'
import { BlackButton } from './atoms/button'
import { Column, Id } from '../types'
import styled from '@emotion/styled'
import ColumnContainer from './ColumnContainer'
import { DndContext } from '@dnd-kit/core'
import { SortableContext } from '@dnd-kit/sortable'

const Background = styled.div`
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: row;
    gap: 8px;
    justify-content: center;
    align-items: center;
`

const ColumnsWrapper = styled.div`
    display: flex;
    flex-direction: row;
    gap: 8px;
`

function KanbanBoard() {
    const [columns, setColumns] = useState<Column[]>([])
    const columnsId = useMemo(() => columns.map((col) => col.id), [columns])
    console.log(columns)
    return (
        <Background>
            <DndContext>
                <ColumnsWrapper>
                    <SortableContext items={columnsId}>
                        {columns.map((col) => (
                            <ColumnContainer column={col} key={col.id} deleteColumn={deleteColumn} />
                        ))}
                    </SortableContext>
                </ColumnsWrapper>
                <BlackButton onClick={() => createNewColumn()}>
                    <PlusIcon />
                    Add column
                </BlackButton>
            </DndContext>
        </Background>
    )

    function createNewColumn() {
        const columnToAdd: Column = {
            id: generateId(),
            title: `Column ${columns.length + 1}`,
        }

        setColumns([...columns, columnToAdd])
    }

    function deleteColumn(id: Id) {
        const filteredColumn = columns.filter((col) => col.id !== id)
        setColumns(filteredColumn)
    }
}

function generateId() {
    return Math.floor(Math.random() * 10001)
}

export default KanbanBoard

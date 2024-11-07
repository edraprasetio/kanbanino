import { useMemo, useState } from 'react'
import { PlusIcon } from '../assets/icons/PlusIcon'
import { BlackButton } from './atoms/button'
import { Column, Id, Task } from '../types'
import styled from '@emotion/styled'
import ColumnContainer from './ColumnContainer'
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext } from '@dnd-kit/sortable'
import { createPortal } from 'react-dom'

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

    const [tasks, setTasks] = useState<Task[]>([])

    const [activeColumn, setActiveColumn] = useState<Column | null>(null)

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 3,
            },
        })
    )
    return (
        <Background>
            <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd}>
                <ColumnsWrapper>
                    <SortableContext items={columnsId}>
                        {columns.map((col) => (
                            <ColumnContainer column={col} key={col.id} deleteColumn={deleteColumn} updateColumn={updateColumn} createTask={createTask} tasks={tasks.filter((task) => task.columnId === col.id)} />
                        ))}
                    </SortableContext>
                </ColumnsWrapper>
                <BlackButton onClick={() => createNewColumn()}>
                    <PlusIcon />
                    Add column
                </BlackButton>
                {createPortal(<DragOverlay>{activeColumn && <ColumnContainer column={activeColumn} deleteColumn={deleteColumn} updateColumn={updateColumn} createTask={createTask} tasks={[]} />}</DragOverlay>, document.body)}
            </DndContext>
        </Background>
    )

    function createTask(columnId: Id) {
        const newTask: Task = {
            id: generateId(),
            columnId,
            content: `Task ${tasks.length + 1}`,
        }

        setTasks([...tasks, newTask])
    }

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

    function updateColumn(id: Id, title: string) {
        const newColumns = columns.map((col) => {
            if (col.id === id) {
                return { ...col, title }
            }
            return col
        })

        setColumns(newColumns)
    }

    function onDragStart(event: DragStartEvent) {
        console.log('Drag started', event)
        if (event.active.data.current?.type === 'Column') {
            setActiveColumn(event.active.data.current.column)
            return
        }
    }

    function onDragEnd(event: DragEndEvent) {
        const { active, over } = event

        if (!over) return

        const activeColumnId = active.id
        const overColumnId = over.id

        if (activeColumnId === overColumnId) return

        setColumns((columns) => {
            const activeColumnIndex = columns.findIndex((col) => col.id === activeColumnId)
            const overColumnIndex = columns.findIndex((col) => col.id === overColumnId)

            return arrayMove(columns, activeColumnIndex, overColumnIndex)
        })
    }

    function generateId() {
        return Math.floor(Math.random() * 10001)
    }
}

export default KanbanBoard

import styled from '@emotion/styled'
import { Column, Id, Task } from '../types'
import { BaseButton } from './atoms/button'
import { TrashIcon } from '../assets/icons/TrashIcon'
import { SortableContext, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useMemo, useState } from 'react'
import { PlusIcon } from '../assets/icons/PlusIcon'
import TaskCard from './TaskCard'

const Container = styled.div`
    width: 300px;
    height: 500px;
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

const TaskButton = styled(TrashButton)`
    margin-bottom: 8px;
    margin-left: 8px;
    width: 160px;
    color: white;
    &:hover {
        background-color: #595a80;
        border: 3px solid #595a80;
        color: white;
    }
    &:active {
        background-color: #6882a8;
        border: 3px solid #4a5d78;
    }
`

const EmptyContainer = styled(Container)`
    opacity: 0.3;
`

const StyledInput = styled.input`
    width: 160px;
    background-color: #3e3f63;
    color: white;
    border: none;
    border-bottom: 1px solid white;
    radius: 4px;
    font-size: 16px;
`

interface Props {
    column: Column
    deleteColumn: (id: Id) => void
    updateColumn: (id: Id, title: string) => void

    createTask: (columnId: Id) => void
    deleteTask: (id: Id) => void
    updateTask: (id: Id, content: string) => void
    tasks: Task[]
}

export default function ColumnContainer(props: Props) {
    const { column, deleteColumn, updateColumn, createTask, deleteTask, updateTask, tasks } = props

    const [editMode, setEditMode] = useState(false)

    const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
        id: column.id,
        data: {
            type: 'Column',
            column,
        },
        disabled: editMode,
    })

    const tasksIds = useMemo(() => {
        return tasks.map((task) => task.id)
    }, [tasks])

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    }

    if (isDragging) {
        return <EmptyContainer ref={setNodeRef} style={style}></EmptyContainer>
    }

    return (
        <Container ref={setNodeRef} style={style}>
            <Header
                {...attributes}
                {...listeners}
                onClick={() => {
                    setEditMode(true)
                }}
            >
                <TitleContainer>
                    <ItemsNumber>0</ItemsNumber>
                    {!editMode && column.title}
                    {editMode && (
                        <StyledInput
                            value={column.title}
                            onChange={(e) => {
                                updateColumn(column.id, e.target.value)
                            }}
                            autoFocus
                            onBlur={() => {
                                setEditMode(false)
                            }}
                            onKeyDown={(e) => {
                                if (e.key !== 'Enter') return
                                setEditMode(false)
                            }}
                        />
                    )}
                </TitleContainer>
                <TrashButton onClick={() => deleteColumn(column.id)}>
                    <TrashIcon />
                </TrashButton>
            </Header>
            <Content>
                <SortableContext items={tasksIds}>
                    {tasks.map((task) => (
                        <TaskCard key={task.id} task={task} deleteTask={deleteTask} updateTask={updateTask} />
                    ))}
                </SortableContext>
            </Content>
            <TaskButton onClick={() => createTask(column.id)}>
                <PlusIcon />
                Add Task
            </TaskButton>
        </Container>
    )
}

import styled from '@emotion/styled'
import { Id, Task } from '../types'
import { TrashIcon } from '../assets/icons/TrashIcon'
import { BaseButton } from './atoms/button'
import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const TaskContainer = styled.div`
    align-items: center;
    height: 40px;
    background-color: #21252e;
    border: 2px solid #21252e;
    border-radius: 8px;
    color: white;
    cursor: grab;
    display: flex;
    gap: 8px;
    justify-content: space-between;
    padding: 8px 16px;

    &:hover {
        border: 2px solid #cc313e;
    }
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

const StyledTextArea = styled.textarea`
    height: 90%;
    resize: none;
    border: none;
    background-color: transparent;
    color: white;
    font-size: 16px;
    padding: 8px;
    width: 100%;
    border-radius: 8px;
    border-color: #21252e;
    align-items: center;
    outline: none;
`

const EmptyContainer = styled(TaskContainer)`
    opacity: 0.5;
`

interface Props {
    task: Task
    deleteTask: (id: Id) => void
    updateTask: (id: Id, content: string) => void
}

export default function TaskCard({ task, deleteTask, updateTask }: Props) {
    const [mouseIsOver, setMouseIsOver] = useState(false)
    const [editMode, setEditMode] = useState(false)

    const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
        id: task.id,
        data: {
            type: 'Task',
            task,
        },
        disabled: editMode,
    })

    const toggleEditMode = () => {
        setEditMode((prev) => !prev)
        setMouseIsOver(false)
    }
    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    }

    if (isDragging) {
        return <EmptyContainer ref={setNodeRef} style={style} />
    }

    if (editMode) {
        return (
            <TaskContainer ref={setNodeRef} style={style} {...attributes} {...listeners}>
                <StyledTextArea
                    value={task.content}
                    autoFocus
                    placeholder='Task Content Here'
                    onBlur={toggleEditMode}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') toggleEditMode()
                    }}
                    onChange={(e) => updateTask(task.id, e.target.value)}
                />
            </TaskContainer>
        )
    }
    return (
        <TaskContainer ref={setNodeRef} style={style} {...attributes} {...listeners} onMouseEnter={() => setMouseIsOver(true)} onMouseLeave={() => setMouseIsOver(false)} onClick={toggleEditMode}>
            <p style={{ height: '90%', overflowX: 'auto', overflowY: 'auto', whiteSpace: 'pre-wrap' }}>{task.content}</p>
            {mouseIsOver && (
                <TrashButton onClick={() => deleteTask(task.id)}>
                    <TrashIcon />
                </TrashButton>
            )}
        </TaskContainer>
    )
}

import { useMemo, useState } from 'react'
import { PlusIcon } from '../assets/icons/PlusIcon'
import { BlackButton } from './atoms/button'
import { Column, Id, Task } from '../types'
import styled from '@emotion/styled'
import ColumnContainer from './ColumnContainer'
import { DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext } from '@dnd-kit/sortable'
import { createPortal } from 'react-dom'
import TaskCard from './TaskCard'

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
    const [activeTask, setActiveTask] = useState<Task | null>(null)

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 3,
            },
        })
    )
    return (
        <Background>
            <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd} onDragOver={onDragOver}>
                <ColumnsWrapper>
                    <SortableContext items={columnsId}>
                        {columns.map((col) => (
                            <ColumnContainer column={col} key={col.id} deleteColumn={deleteColumn} updateColumn={updateColumn} createTask={createTask} deleteTask={deleteTask} updateTask={updateTask} tasks={tasks.filter((task) => task.columnId === col.id)} />
                        ))}
                    </SortableContext>
                </ColumnsWrapper>
                <BlackButton onClick={() => createNewColumn()}>
                    <PlusIcon />
                    Add column
                </BlackButton>
                {createPortal(
                    <DragOverlay>
                        {activeColumn && <ColumnContainer column={activeColumn} deleteColumn={deleteColumn} updateColumn={updateColumn} createTask={createTask} deleteTask={deleteTask} updateTask={updateTask} tasks={tasks.filter((task) => task.columnId === activeColumn.id)} />}
                        {activeTask && <TaskCard task={activeTask} deleteTask={deleteTask} updateTask={updateTask} />}
                    </DragOverlay>,
                    document.body
                )}
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

    function deleteTask(id: Id) {
        const newTasks = tasks.filter((task) => task.id !== id)
        setTasks(newTasks)
    }

    function updateTask(id: Id, content: string) {
        const newTasks = tasks.map((task) => {
            if (task.id !== id) return task
            return { ...task, content }
        })

        setTasks(newTasks)
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

        const newTasks = tasks.filter((task) => task.columnId !== id)
        setTasks(newTasks)
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

        if (event.active.data.current?.type === 'Task') {
            setActiveTask(event.active.data.current.task)
            return
        }
    }

    function onDragEnd(event: DragEndEvent) {
        setActiveColumn(null)
        setActiveTask(null)

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

    function onDragOver(event: DragOverEvent) {
        const { active, over } = event

        if (!over) return

        const activeId = active.id
        const overId = over.id

        if (activeId === overId) return

        const isActiveATask = active.data.current?.type === 'Task'
        const isOverATask = over.data.current?.type === 'Task'

        if (!isActiveATask) return

        if (isActiveATask && isOverATask) {
            setTasks((tasks) => {
                const activeIndex = tasks.findIndex((t) => t.id === activeId)
                const overIndex = tasks.findIndex((t) => t.id === overId)

                tasks[activeIndex].columnId = tasks[overIndex].columnId

                return arrayMove(tasks, activeIndex, overIndex)
            })
        }

        const isOverAColumn = over.data.current?.type === 'Column'
        if (isActiveATask && isOverAColumn) {
            setTasks((tasks) => {
                const activeIndex = tasks.findIndex((t) => t.id === activeId)

                tasks[activeIndex].columnId = overId

                return arrayMove(tasks, activeIndex, activeIndex)
            })
        }
    }

    function generateId() {
        return Math.floor(Math.random() * 10001)
    }
}

export default KanbanBoard
